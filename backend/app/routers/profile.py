from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.availability_block import AvailabilityBlock
from app.models.course import Course
from app.models.profile import Profile
from app.schemas.profile import BlockIn, OnboardingIn
from app.repositories.courseRepo import CourseRepository
from app.schemas import UserOut

router = APIRouter(prefix="/profile", tags=["profile"])


@router.put("/onboarding", response_model=UserOut)
def save_onboarding(
    data: OnboardingIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    courseRepo = CourseRepository(db)

    if not data.courses:
        raise HTTPException(status_code=422, detail="Add at least one course")

    # PUT replaces earlier answers, submitting twice is safe
    db.execute(delete(Course).where(Course.user_id == current_user.id))
    db.execute(delete(AvailabilityBlock).where(AvailabilityBlock.user_id == current_user.id))

    for course in data.courses:
        courseRepo.create(course, current_user)
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