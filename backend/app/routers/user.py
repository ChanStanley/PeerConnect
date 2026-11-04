from fastapi import APIRouter
 
router = APIRouter(prefix="/user")
 
 
@router.get("/courses")
async def get_user_courses():
    pass
 
 
@router.get("/groups")
async def get_user_groups():
    pass
 
 
@router.get("/cardsets")
async def get_user_cardsets():
    pass