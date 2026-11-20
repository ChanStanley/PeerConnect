from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate, UserOut
from app.security import create_access_token, hash_password, verify_password
from app.models.course import Course
from app.models.availability_block import AvailabilityBlock

router = APIRouter(prefix="/auth", tags=["auth"])

# this can be changed if we want, right now it's 7 days
REMEMBER_ME_MINUTES = 60 * 24 * 7

@router.post("/register", response_model=UserOut, status_code=201)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    email = data.email.lower()
    if await db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="An account with this email address already exists")

    user = User(
        email=email,
        hashed_password=await hash_password(data.password),
        full_name=data.full_name
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == data.email.lower()))
    if user is None or not await verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    minutes = REMEMBER_ME_MINUTES if data.remember else None
    return TokenResponse(access_token=create_access_token(user.id, minutes))

@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/complete-onboarding", response_model=UserOut)
async def complete_boarding(current_user: User = Depends(get_current_user),
                      db: AsyncSession = Depends(get_db),):
    # run a SQLAlchemy query checking whether or not a user has at least 1 course and availability block
    has_course = await db.scalar(select(Course.id).where(Course.user_id == current_user.id).limit(1))
    has_availability = await db.scalar(select(AvailabilityBlock.id).where(AvailabilityBlock.user_id == current_user.id).limit(1))

    if not has_course or not has_availability:
        raise HTTPException(status_code=400, detail="Add at least one course and one availability window first")

    current_user.onboarding_completed = True
    await db.commit()
    await db.refresh(current_user)
    return current_user