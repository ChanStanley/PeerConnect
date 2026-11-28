from fastapi import APIRouter
 
router = APIRouter(prefix="/study_groups")
 
 
@router.get("/{id}")
async def get_study_group(id: str):
    pass
 
 
@router.post("")
async def create_study_group():
    pass


@router.post("/request")
async def create_group_request():
    pass


@router.post("/request/{id}")
async def respond_group_request():
    pass