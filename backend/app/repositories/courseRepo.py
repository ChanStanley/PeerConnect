from sqlalchemy.orm import Session

from app.embedding_model import generate_embeddings
from app.schemas.course import Course

class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, course: str, user: int):
        embedding = generate_embeddings(course)

        self.db.add(Course(user_id=user, embedding=embedding, name=course))
        self.db.commit()

    def get_match(self):
        pass