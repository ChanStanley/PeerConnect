from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, model_validator
from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.availability_block import AvailabilityBlock
from app.models.course import Course
from app.models.profile import Profile
from app.schemas import UserOut

router = APIRouter(prefix="/profile", tags=["profile"])

class BlockIn(BaseModel):
    day: int = Field(ge=0, le=6) # 0 = Sunday | ge -> greater or equal to
    time_start: int = Field(ge=0, lt=1440) # minutes since midnight
    time_end: int = Field(ge=0, lt=1440)
    level: Literal["preferred", "possible"] # level of availability

    # ensure that users input their time slots correctly
    @model_validator(mode="after")
    def end_after_start(self):
        if self.time_end <= self.time_start:
            raise ValueError("time_end must be after time_start")
        return self

class OnboardingIn(BaseModel):
    campus: str = Field(min_length=1)
    year: str = ""
    major: str = ""
    courses: list[str] = Field(min_length=1, max_length=30)
    goals: list[str] = []
    style: list[str] = []
    availability: list[BlockIn] = Field(min_length=1, max_length=91)
    session_length: str = ""
    group_size: str = ""
    places: list[str] = []


@router.put("/onboarding", response_model=UserOut)
def save_onboarding(
    data: OnboardingIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # CSCI 135 and csci 135 should count as same course
    codes = {"".join(c.upper().split()) for c in data.courses}
    codes.discard("")
    if not codes:
        raise HTTPException(status_code=422, detail="Add at least one course")

    # PUT replaces earlier answers, submitting twice is safe
    db.execute(delete(Course).where(Course.user_id == current_user.id))
    db.execute(delete(AvailabilityBlock).where(AvailabilityBlock.user_id == current_user.id))

    for code in sorted(codes):
        db.add(Course(user_id=current_user.id, course=code, searching=True))
    for b in data.availability:
        db.add(AvailabilityBlock(
            user_id=current_user.id,
            day=b.day,
            time_start=b.time_start,
            time_end=b.time_end,
            level=b.level,
        ))

    profile = db.get(Profile, current_user.id) or Profile(user_id=current_user.id)
    profile.campus = data.campus.strip()
    profile.year = data.year
    profile.major = data.major.strip()
    profile.goals = data.goals
    profile.study_style = data.style
    profile.session_length = data.session_length
    profile.group_size = data.group_size
    profile.places = data.places
    db.add(profile)

    current_user.onboarding_completed = True
    db.commit()
    db.refresh(current_user)
    return current_user