from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.embedding_model import generate_embeddings
from app.schemas.course import CourseIn
from app.models.course import Course
from app.models.user import User

class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, course: CourseIn, user_id: int):
        embedding = generate_embeddings(course.name + course.description)
        self.db.add(Course(user_id=user_id, embedding=embedding, name=course.name, description=course.description))

    def get_matching_users(self, course_id: int, user_id: int) -> Course:
        pass

    def get_matching_groups(self, course_id: int, user_id: int):
        pass