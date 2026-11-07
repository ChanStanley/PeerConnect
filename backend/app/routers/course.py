from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.repositories.courseRepo import CourseRepository
from app.models.course import CourseIn
 
router = APIRouter(prefix="/courses")
 
 
@router.get("/{id}")
async def get_course(id: int):
    pass
 
 
@router.put("/{id}")
async def update_course(id: int):
    pass
 
 
@router.get("/{id}/match-users")
async def match_users(id: int):
    pass
 
 
@router.get("/{id}/match-groups")
async def match_groups(id: int):
    pass
 
 
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_course(
    course: CourseIn,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    courseRepo = CourseRepository(db)
    courseRepo.create(course.name, course.description, current_user)

    return {"message": "Post created"}