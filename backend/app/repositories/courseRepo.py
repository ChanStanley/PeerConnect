from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from app.embedding_model import generate_embeddings, generate_embedding_batch
from app.schemas.course import CourseIn
from app.models.course import Course
from app.models.availability_block import AvailabilityBlock

class CourseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, course: CourseIn, user_id: int):
        embedding = await generate_embeddings(course.name + course.description)
        self.db.add(Course(user_id=user_id, embedding=embedding, name=course.name, description=course.description))

    async def insert_list(self, courses: list[CourseIn], user_id: int):
        texts = [(course.name + course.description) for course in courses]
        embeddings = await generate_embedding_batch(texts)
        courseList = [
            Course(user_id=user_id, embedding=embedding, name=course.name, description=course.description) 
            for embedding, course in zip(embeddings, courses)
        ]
        self.db.add_all(courseList)

    async def get_availability(self, user_id: int) -> dict[int, AvailabilityBlock]:
        blocks = (await self.db.execute(
            select(AvailabilityBlock)
                .where(AvailabilityBlock.user_id == user_id)
        )).scalars().all()

        block_hash: dict[int, AvailabilityBlock] = {}
        for block in blocks:
                block_hash[block.day] = block

        return block_hash