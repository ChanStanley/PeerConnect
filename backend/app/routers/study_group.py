from fastapi import APIRouter
 
router = APIRouter(prefix="/study_groups")
 
 
@router.get("/{id}")
async def get_study_group(id: str):
    pass
 
 
@router.put("/{id}")
async def update_study_group(id: str):
    pass
 
 
@router.post("")
async def create_study_group():
    pass
 