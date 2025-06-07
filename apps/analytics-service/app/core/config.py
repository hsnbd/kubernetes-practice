from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MyApp"
    API_V1_STR: str = "/api/v1"
    DB_URL: str = "sqlite:///./test.db"
    class Config:
        env_file = ".env"

settings = Settings()
