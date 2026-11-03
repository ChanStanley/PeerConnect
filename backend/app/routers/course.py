from fastapi import APIRouter
 
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
 
 
@router.post("")
async def create_course():
    pass