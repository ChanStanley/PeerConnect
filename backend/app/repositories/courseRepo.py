from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.embedding_model import generate_embeddings, generate_embedding_batch
from app.schemas.course import CourseIn
from app.models.course import Course
from app.models.availability_block import AvailabilityBlock

class CourseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @staticmethod
    def _embed_text(course: CourseIn) -> str:
        return f"{course.name} {course.description}".strip()

    async def create(self, course: CourseIn, user_id: int):
        embedding = await generate_embeddings(self._embed_text(course))
        self.db.add(Course(user_id=user_id, embedding=embedding, name=course.name, description=course.description))

    async def insert_list(self, courses: list[CourseIn], user_id: int):
        embeddings = await generate_embedding_batch([self._embed_text(c) for c in courses])
        self.db.add_all([
            Course(user_id=user_id, embedding=e, name=c.name, description=c.description)
            for e, c in zip(embeddings, courses)
        ])

    async def get_availability(self, user_id: int) -> dict[int, AvailabilityBlock]:
        blocks = (await self.db.execute(
            select(AvailabilityBlock)
                .where(AvailabilityBlock.user_id == user_id)
        )).scalars().all()

        block_hash: dict[int, AvailabilityBlock] = {}
        for block in blocks:
                block_hash[block.day] = block

        return block_hash