from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint

from app.database import Base

class Course(Base):
    __tablename__ = "courses"
    __table_args__ = (UniqueConstraint("user_id", "course"),)

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    course = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    searching = Column(Boolean, index=True)