from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select, exists
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession


from app.database import get_db
from app.dependencies import get_current_user, get_onboarded_user
from app.repositories.courseRepo import CourseRepository
from app.schemas.course import CourseIn, CourseGroupMatchOut, CourseUserMatchOut
from app.models.course import Course
from app.models.availability_block import AvailabilityBlock
from app.models.user import User
from app.models.study_group import StudyGroup, StudyGroupMember
 
router = APIRouter(prefix="/courses")
 
# IMPORTANT: when implementing these two, make sure current_user is Depends(get_onboarded_user)
# make sure you also have the ownership check too (course.user_id has to be current_user.id) 
# so someone else can't grab or modify someone else's courses
@router.get("/{id}")
async def get_course(id: int):
    pass
 
 
@router.put("/{id}")
async def update_course(id: int):
    pass
 
 
@router.get("/{id}/match-users", response_model=list[CourseUserMatchOut])
async def match_users(
    id: int,
    current_user: User = Depends(get_onboarded_user),
    db: AsyncSession = Depends(get_db)
):
    courseRepo = CourseRepository(db)

    # get course
    course = await db.get(Course, id)
    # added ownership check
    if course is None or course.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Course does not exist")

    # find similar courses, have it eager load course.user and user.availability_blocks
    courses = (await db.execute(select(Course)
        .options(joinedload(Course.user).selectinload(User.availability_blocks))
        .where(Course.user_id != current_user.id)
        .where(Course.searching == True)
        .where(Course.embedding.cosine_distance(course.embedding) < 0.1)
        .order_by(Course.embedding.cosine_distance(course.embedding))
        .limit(50)
    )).scalars().all()

    # get when user is available
    block_hash = await courseRepo.get_availability(current_user.id)

    # create CourseUserMatchOut for each matching course found
    response = []
    for row in courses:
        isPreferred = False
        isPossible = False

        # check if there is overlapping times in preferred or possible
        for other in row.user.availability_blocks:
             if (block_hash.get(other.day)):
                if ((block_hash[other.day].preferred & other.preferred) > 0):
                    isPreferred = True
                if ((block_hash[other.day].possible & other.possible) > 0):
                    isPossible = True

        response.append(CourseUserMatchOut(
            name=row.name,
            description=row.description,
            username=row.user.full_name,
            user_id=row.user_id,
            preferred_match=isPreferred,
            possible_match=isPossible
        ))

    return response

 
 
@router.get("/{id}/match-groups", response_model=list[CourseGroupMatchOut])
async def match_groups(
    id: int,
    current_user: User = Depends(get_onboarded_user),
    db: AsyncSession = Depends(get_db)
):
    courseRepo = CourseRepository(db)
    
    course = await db.get(Course, id)
    # added ownership check
    if course is None or course.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Course does not exist")
    
    result = (await db.execute(
        select(Course, StudyGroup)
            .join(StudyGroup, StudyGroup.course_id == Course.id)
            .options(selectinload(StudyGroup.availability_blocks))
            .where(Course.user_id != current_user.id)
            .where(StudyGroup.open == True)
            .where(~exists().where(
                StudyGroupMember.study_group_id == StudyGroup.id,
                StudyGroupMember.user_id == current_user.id
            ))
            .where(Course.embedding.cosine_distance(course.embedding) < 0.1)
            .order_by(Course.embedding.cosine_distance(course.embedding))
            .limit(50)
    )).all()

    # get when user is available
    block_hash = await courseRepo.get_availability(current_user.id)

    response = []
    for course, study_group in result:
        isPreferred = False
        isPossible = False

        # check if there is overlapping times in preferred or possible
        for other in study_group.availability_blocks:
            if (block_hash.get(other.day)):
                if ((block_hash[other.day].preferred & other.preferred) > 0):
                    isPreferred = True
                if ((block_hash[other.day].possible & other.possible) > 0):
                    isPossible = True

        response.append(CourseGroupMatchOut(
            name=course.name,
            description=course.description,
            group_name=study_group.name,
            group_id=study_group.id,
            preferred_match=isPreferred,
            possible_match=isPossible
        ))

    return response
 
 
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_course(
    course: CourseIn,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    courseRepo = CourseRepository(db)
    await courseRepo.create(course, current_user.id)
    await db.commit()

    return {"message": "Post created"}