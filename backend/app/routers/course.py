from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload


from app.database import get_db
from app.dependencies import get_current_user
from app.repositories.courseRepo import CourseRepository
from app.schemas.course import CourseIn, CourseGroupMatchOut, CourseUserMatchOut
from app.models.course import Course
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
    course = db.get(Course, id)
    courses = db.execute(
        select(Course)
            .options(joinedload(Course.user))
            .where(Course.user_id != current_user)
            .where(course.embedding.cosine_distance(course.embedding) < 0.1)
    ).scalars().all()

    response = [
        CourseUserMatchOut(
            name=row.name,
            description=row.description,
            username=row.user.full_name,
            user_id=row.user_id
        )
        for row in courses
    ]

    return response

 
 
@router.get("/{id}/match-groups", response_model=list[CourseGroupMatchOut])
async def match_groups(
    id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    course = db.get(Course, id)
    courses = db.execute(
        select(Course)
            .options(joinedload(Course.study_group))
            .where(Course.user_id != current_user)
            .where(course.embedding.cosine_distance(course.embedding) < 0.1)
    ).scalars().all()

    response = [
        CourseGroupMatchOut(
            name=row.name,
            description=row.description,
            group_name=row.study_group.name,
            group_id=row.study_group.id
        )
        for row in courses
    ]

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