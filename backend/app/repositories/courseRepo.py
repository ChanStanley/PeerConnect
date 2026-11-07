from sqlalchemy.orm import Session

from app.embedding_model import generate_embeddings
from app.models.course import CourseIn
from app.schemas.course import Course

class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, course: CourseIn, user: int):
        embedding = generate_embeddings(course.name + course.description)
        self.db.add(Course(user_id=user, embedding=embedding, name=course.name, description=course.description))

    def get_matching_users(self):
        pass

    def get_matching_groups(self):
        pass