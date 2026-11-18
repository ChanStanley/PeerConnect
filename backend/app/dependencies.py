from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.security import decode_access_token

bearer_scheme = HTTPBearer()

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession= Depends(get_db),
    ) -> User:
    user_id = decode_access_token(creds.credentials)
    user = await db.get(User, user_id) if user_id is not None else None
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def get_onboarded_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.onboarding_completed:
        raise HTTPException(status_code=403, detail="Finish setting up your profile first")
    return current_user