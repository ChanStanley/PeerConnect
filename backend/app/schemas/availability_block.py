from sqlalchemy import Column, Integer, ForeignKey, String

from app.database import Base

class AvailabilityBlock(Base):
    __tablename__ = "availability_blocks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day = Column(Integer, nullable=False) # 0 = Sunday ... 6 = Saturday (same as frontend grid)
    preferred = Column(Integer, nullable=False) # first 24, each bit represents hour of day
    possible = Column(Integer, nullable=False) # first 24, each bit represents hour of day

    # IMPORTANT: JS getDay() starts week on Sunday but Python datetime.weekday() starts on Monday