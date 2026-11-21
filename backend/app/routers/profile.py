from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.availability_block import AvailabilityBlock
from app.models.course import Course
from app.models.profile import Profile
from app.models.study_group import StudyGroup
from app.schemas.profile import BlockIn, OnboardingIn
from app.repositories.courseRepo import CourseRepository
from app.schemas.auth import UserOut

router = APIRouter(prefix="/profile", tags=["profile"])


@router.put("/onboarding", response_model=UserOut)
async def save_onboarding(
    data: OnboardingIn,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    courseRepo = CourseRepository(db)

    if not data.courses:
        raise HTTPException(status_code=422, detail="Add at least one course")

    # PUT replaces earlier answers, submitting twice is safe

    # Sync the courses instead of replacing them, so course ids and any study group pointing at them
    # stay stable
    existing = (await db.execute(
        select(Course).where(Course.user_id == current_user.id)
    )).scalars().all()
    submitted = {c.name: c for c in data.courses} # also drops repeated names
    existing_names = {c.name for c in existing}
    removed = [c for c in existing if c.name not in submitted]
    if removed:
        in_use = await db.scalar(
            select(StudyGroup.id).where(StudyGroup.course_id.in_([c.id for c in removed])).limit(1)
        )
        if in_use:
            raise HTTPException(
                status_code=409,
                detail="A course you removed still has a study group. Delete or hand over ownership to another member first."
            )
        for row in removed:
            await db.delete(row)

    await db.execute(delete(AvailabilityBlock).where(AvailabilityBlock.user_id == current_user.id))
    
    new_courses = [c for name, c in submitted.items() if name not in existing_names]
    if new_courses:
        await courseRepo.insert_list(courses=new_courses, user_id=current_user.id)

    for b in data.availability:
        db.add(AvailabilityBlock(
            user_id=current_user.id,
            day=b.day,
            preferred=b.preferred,
            possible=b.possible,
        ))

    profile = await db.get(Profile, current_user.id) or Profile(user_id=current_user.id)
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
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.post("/availability_block", status_code=status.HTTP_201_CREATED)
async def create_availability_block(
    block: BlockIn,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # replace day's row instead of adding a duplicate
    existing = await db.scalar(
        select(AvailabilityBlock).where(
            AvailabilityBlock.user_id == current_user.id,
            AvailabilityBlock.day == block.day
        )
    )
    if existing: 
        existing.preferred = block.preferred
        existing.possible = block.possible
    else:
        db.add(AvailabilityBlock(
            user_id=current_user.id,
            day=block.day,
            preferred=block.preferred,
            possible=block.possible,
        ))
        
    await db.commit()

    return  {"message": "availability block created"}