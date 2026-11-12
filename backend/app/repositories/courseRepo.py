from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.orm.attributes import InstrumentedAttribute

from app.embedding_model import generate_embeddings
from app.schemas.course import CourseIn
from app.models.course import Course
from app.models.availability_block import AvailabilityBlock
from app.models.user import User

class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, course: CourseIn, user_id: int):
        embedding = generate_embeddings(course.name + course.description)
        self.db.add(Course(user_id=user_id, embedding=embedding, name=course.name, description=course.description))

    def get_availability(self, user_id: int) -> dict[int, AvailabilityBlock]:
        blocks = self.db.execute(
            select(AvailabilityBlock)
                .where(AvailabilityBlock.user_id == user_id)
        ).scalars().all()

        block_hash: dict[int, AvailabilityBlock] = {}
        for block in blocks:
                block_hash[block.day] = block

        return block_hash