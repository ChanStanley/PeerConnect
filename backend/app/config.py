from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 60
    frontend_origin: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings()