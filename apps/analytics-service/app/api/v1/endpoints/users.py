from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db.session import get_session
from app.db.models.user import User

router = APIRouter()

@router.get("/", response_model=list[User])
def read_users(session: Session = Depends(get_session)):
    return session.exec(select(User)).all()
