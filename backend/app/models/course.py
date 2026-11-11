from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    embedding = Column(Vector(384), nullable=False)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    searching = Column(Boolean, index=True, default=True)

    user = relationship("User")
    study_group = relationship("StudyGroup")

    __table_args__ = (
        Index(
            "course_embedding",
            embedding,
            postgresql_using="hsnw",
            postgresql_ops={"embedding": "vector_cosine_ops"}
        ),
        UniqueConstraint("user_id", "course")
    )