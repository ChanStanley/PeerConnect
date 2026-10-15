from sqlalchemy import Column, Integer, ForeignKey

from app.database import Base

class AvailabilityBlock(Base):
    __tablename__ = "availability_blocks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day = Column(Integer, nullable=False)
    time_start = Column(Integer, nullable=False)
    time_end = Column(Integer, nullable=False)