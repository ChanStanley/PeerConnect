from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, status
from pydantic import ValidationError
from app.database import AsyncSessionLocal
from app.services.chat import tickets
from app.repositories import chat as repo
from app.schemas.chat import MessageIn, MessageOut, WSEvent
from app.services.chat.manager import manager


router = APIRouter()

@router.websocket("/ws/chat/{group_id}")
async def chat_ws(websocket: WebSocket, group_id: int, ticket: str = Query(...)):
    # 1. Authenticate + authorize BEFORE accepting
    user_id = await tickets.redeem_ticket(ticket)
    if user_id is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    async with AsyncSessionLocal() as session:
        if not await repo.is_member(session, group_id, user_id):
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

    await manager.connect(group_id, websocket)
    try:
        while True:
            raw = await websocket.receive_json()
            try:
                incoming = MessageIn.model_validate(raw)
            except ValidationError as e:
                await websocket.send_json({"type": "error", "data": {"detail": e.errors()}})
                continue

            # Short-lived session per message: don't hold a DB connection for the whole socket lifetime
            async with AsyncSessionLocal() as session:
                msg = await repo.create_message(session, group_id, user_id, incoming.content.strip())

            payload = MessageOut.model_validate(msg).model_dump(mode="json")
            await manager.broadcast_local(group_id=group_id, payload=payload)

    except WebSocketDisconnect:
        pass
    finally:
        await manager.disconnect(group_id, websocket)
