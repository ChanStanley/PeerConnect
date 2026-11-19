from sqlalchemy import Column, Integer, ForeignKey, String, CheckConstraint, UniqueConstraint

from app.database import Base

class AvailabilityBlock(Base):
    __tablename__ = "availability_blocks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True)
    study_group_id = Column(Integer, ForeignKey("study_groups.id", ondelete="CASCADE"), index=True, nullable=True)
    day = Column(Integer, nullable=False) # 0 = Sunday ... 6 = Saturday (same as frontend grid)
    preferred = Column(Integer, nullable=False) # first 24, each bit represents hour of day
    possible = Column(Integer, nullable=False) # first 24, each bit represents hour of day

    # IMPORTANT: JS getDay() starts week on Sunday but Python datetime.weekday() starts on Monday

    __table_args__ = (
        CheckConstraint(
            "(user_id IS NULL) <> (study_group_id IS NULL)",
            name="block_has_exactly_one_owner"
        ),
        CheckConstraint("day BETWEEN 0 AND 6", name="block_day_range"),
        UniqueConstraint("user_id", "day", name="uq_block_user_day"),
        UniqueConstraint("study_group_id", "day", name="uq_block_group_day"),
    )