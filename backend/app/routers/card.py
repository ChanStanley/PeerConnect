from fastapi import APIRouter
 
router = APIRouter(prefix="/cards")
 
 
@router.post("")
async def create_card():
    pass
 
 
@router.delete("/{id}")
async def delete_card(id: str):
    pass
 
 
@router.put("/{id}")
async def update_card(id: str):
    pass
 