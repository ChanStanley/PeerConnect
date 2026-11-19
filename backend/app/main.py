from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.config import settings
from app.database import Base, engine, init_db
from app.routers import auth, profile, course

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan, title="PeerConnect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(course.router)

@app.get("/")
def check():
    return {"status": "ok"}