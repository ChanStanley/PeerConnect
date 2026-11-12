from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload


from app.database import get_db
from app.dependencies import get_current_user
from app.repositories.courseRepo import CourseRepository
from app.schemas.course import CourseIn, CourseGroupMatchOut, CourseUserMatchOut
from app.models.course import Course
from app.models.availability_block import AvailabilityBlock
from app.models.user import User
from app.models.study_group import StudyGroup
 
router = APIRouter(prefix="/courses")
 
 
@router.get("/{id}")
async def get_course(id: int):
    pass
 
 
@router.put("/{id}")
async def update_course(id: int):
    pass
 
 
@router.get("/{id}/match-users", response_model=list[CourseUserMatchOut])
async def match_users(
    id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    courseRepo = CourseRepository(db)

    # get course
    course = db.get(Course, id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course does not exist")

    # find similar courses, have it eager load course.user and user.availability_blocks
    courses = courses = db.execute(select(Course)
        .options(joinedload(Course.user).selectinload(User.availability_blocks))
        .where(Course.user_id != current_user)
        .where(Course.searching == True)
        .where(Course.embedding.cosine_distance(course.embedding) < 0.1)
    ).scalars().all()

    # get when user is available
    block_hash = courseRepo.get_availability(current_user)

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
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    courseRepo = CourseRepository(db)
    
    course = db.get(Course, id)
    if course is None:
            raise HTTPException(status_code=404, detail="Course does not exist")
    
    result = db.execute(
        select(Course, StudyGroup)
            .join(StudyGroup, StudyGroup.course_id == Course.id)
            .options(selectinload(StudyGroup.availability_blocks))
            .where(Course.user_id != current_user)
            .where(StudyGroup.open == True)
            .where(Course.embedding.cosine_distance(course.embedding) < 0.1)
    ).all()

    # get when user is available
    block_hash = courseRepo.get_availability(current_user)

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
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    courseRepo = CourseRepository(db)
    courseRepo.create(course, current_user)
    db.commit()

    return {"message": "Post created"}