from sqlalchemy import create_engine, Column, String, Boolean, DateTime, ARRAY, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.config import settings

# Create database engine
engine = create_engine(settings.database_url, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    product_url = Column(String(500), nullable=False)
    image_url = Column(String(500), nullable=True)
    keywords = Column(ARRAY(String), nullable=False, default=[])
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class UserAdCache(Base):
    __tablename__ = "user_ad_cache"

    user_id = Column(UUID(as_uuid=True), primary_key=True)
    ad_ids = Column(ARRAY(String), nullable=False, default=[])
    interests = Column(ARRAY(String), nullable=False, default=[])
    last_analyzed_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AdImpression(Base):
    __tablename__ = "ad_impressions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    campaign_id = Column(UUID(as_uuid=True), nullable=False)
    clicked = Column(Boolean, default=False, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
