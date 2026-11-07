from sqlalchemy.orm import Session

from app.embedding_model import generate_embeddings
from app.schemas.course import Course

class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, descrition: str, user: int):
        embedding = generate_embeddings(name + descrition)

        self.db.add(Course(user_id=user, embedding=embedding, name=name, description=descrition))
        self.db.commit()

    def get_matching_users(self):
        pass

    def get_matching_groups(self):
        pass