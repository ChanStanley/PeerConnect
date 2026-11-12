from sqlalchemy import Column, Integer, ForeignKey, String, CheckConstraint

from app.database import Base

class AvailabilityBlock(Base):
    __tablename__ = "availability_blocks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    study_group_id = Column(Integer, ForeignKey("study_groups.id"), nullable=True)
    day = Column(Integer, nullable=False) # 0 = Sunday ... 6 = Saturday (same as frontend grid)
    preferred = Column(Integer, nullable=False) # first 24, each bit represents hour of day
    possible = Column(Integer, nullable=False) # first 24, each bit represents hour of day

    # IMPORTANT: JS getDay() starts week on Sunday but Python datetime.weekday() starts on Monday

    __table_args__ = (
        CheckConstraint(
            "user_id IS NOT NULL OR study_group_id IS NOT NULL",
            name="require_block_owner_id"
        )
    )