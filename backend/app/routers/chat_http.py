from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.repositories import chat as repo
from app.schemas.chat import MessageOut, TicketResponse
from app.services.chat import tickets
from app.models.user import User

router = APIRouter(prefix="/chat", tags=["chat"])

@router.get("/history/{group_id}/messages", response_model=list[MessageOut])
async def get_history(
    group_id: int,
    before_id: int | None = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not await repo.is_member(db, group_id, current_user.id):
        raise HTTPException(403)
    return await repo.get_history(db, group_id, before_id, min(limit, 100))

@router.get("/ticket", response_model=TicketResponse)
async def get_ticket(
    current_user: User = Depends(get_current_user),
):
    return TicketResponse(ticket=(await tickets.issue_ticket(user_id=current_user.id)))