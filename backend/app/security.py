from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash
from starlette.concurrency import run_in_threadpool

from app.config import settings

ALGORITHM = "HS256"
password_hash = PasswordHash.recommended()

async def hash_password(password: str) -> str:
    return await run_in_threadpool(password_hash.hash, password)

async def verify_password(password: str, hashed: str) -> str:
    return await run_in_threadpool(password_hash.verify, password, hashed)

def create_access_token(user_id: int, expires_minutes: int | None = None) -> str:
    minutes = expires_minutes or settings.access_token_expire_minutes
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)

def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        return None