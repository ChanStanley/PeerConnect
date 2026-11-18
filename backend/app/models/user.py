from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    learning_goals = Column(String, nullable=True)
    onboarding_completed = Column(Boolean, nullable=False, default=False)
    # integrate this later probably
    # role = Column(String, default="student")

    availability_blocks = relationship("AvailabilityBlock", uselist=True)