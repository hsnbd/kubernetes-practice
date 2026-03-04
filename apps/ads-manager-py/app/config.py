from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    port: int = 8081
    database_url: str = "postgresql://postgres:postgres@localhost:5432/tododb"
    jwt_secret: str = "your-secret-key-change-this"
    cors_origins: List[str] = ["http://localhost:3000"]
    log_level: str = "INFO"
    analysis_interval_minutes: int = 15

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
