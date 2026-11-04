from sqlalchemy import Column, Integer, ForeignKey, String

from app.database import Base

class AvailabilityBlock(Base):
    __tablename__ = "availability_blocks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day = Column(Integer, nullable=False) # 0 = Sunday ... 6 = Saturday (same as frontend grid)
    time_start = Column(Integer, nullable=False) # minutes since midnight
    time_end = Column(Integer, nullable=False) # minutes since midnight
    level = Column(String, nullable=False, default="preferred") # can be preferred or possible

    # IMPORTANT: JS getDay() starts week on Sunday but Python datetime.weekday() starts on Monday