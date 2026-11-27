import secrets

from app.redis_client import redis_client as redis

TTL = 30

async def issue_ticket(user_id: int) -> str:
    ticket = secrets.token_urlsafe(32)
    await redis.set(f"ws_ticket:{ticket}", user_id, ex=TTL)
    return ticket

async def redeem_ticket(ticket: str) -> int | None:
    user_id = await redis.getdel(f"ws_ticket:{ticket}")  # atomic read + delete
    return int(user_id) if user_id else None