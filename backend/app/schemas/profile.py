from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY

from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    campus = Column(String, nullable=False)
    year = Column(String, nullable=True)
    major = Column(String, nullable=True)
    goals = Column(ARRAY(String), nullable=False, default=list)
    study_style = Column(ARRAY(String), nullable=False, default=list)
    session_length = Column(String, nullable=True)
    group_size = Column(String, nullable=True)
    places = Column(ARRAY(String), nullable=False, default=list)