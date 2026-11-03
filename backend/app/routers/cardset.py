from fastapi import APIRouter
 
router = APIRouter(prefix="/cardset")
 
 
@router.post("")
async def create_cardset():
    pass
 
 
@router.get("/{id}")
async def get_cardset(id: str):
    pass
 
 
@router.delete("/{id}")
async def delete_cardset(id: str):
    pass
 