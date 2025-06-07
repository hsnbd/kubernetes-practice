from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.endpoints import users

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
