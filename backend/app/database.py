from sqlalchemy import text
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession, AsyncAttrs
from app.config import settings

engine = create_async_engine(settings.database_url, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False,
)

class Base(AsyncAttrs, DeclarativeBase):
    pass

async def init_db():
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session