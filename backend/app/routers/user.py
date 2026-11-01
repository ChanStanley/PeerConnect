from fastapi import APIRouter
 
router = APIRouter(prefix="/user")
 
 
@router.get("/cards")
async def get_user_cards():
    pass
 
 
@router.get("/groups")
async def get_user_groups():
    pass
 
 
@router.get("/cardset")
async def get_user_cardset():
    pass