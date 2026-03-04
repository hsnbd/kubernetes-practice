from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from uuid import UUID
import uuid as uuid_lib

from app.database import Campaign, UserAdCache, AdImpression


class Repository:
    def __init__(self, db: Session):
        self.db = db

    # Campaign operations
    def get_active_campaigns(self) -> List[Campaign]:
        return self.db.query(Campaign).filter(Campaign.active == True).all()

    def get_campaign_by_id(self, campaign_id: UUID) -> Optional[Campaign]:
        return self.db.query(Campaign).filter(Campaign.id == campaign_id).first()

    def create_campaign(self, campaign: Campaign) -> Campaign:
        self.db.add(campaign)
        self.db.commit()
        self.db.refresh(campaign)
        return campaign

    def get_campaigns_by_ids(self, campaign_ids: List[UUID]) -> List[Campaign]:
        return self.db.query(Campaign).filter(Campaign.id.in_(campaign_ids)).all()

    # User profile extraction from todo-api schema
    def get_user_categories(self, user_id: UUID) -> List[str]:
        query = text("SELECT name FROM categories WHERE user_id = :user_id")
        result = self.db.execute(query, {"user_id": str(user_id)})
        return [row[0] for row in result]

    def get_user_tags(self, user_id: UUID) -> List[str]:
        query = text("SELECT name FROM tags WHERE user_id = :user_id")
        result = self.db.execute(query, {"user_id": str(user_id)})
        return [row[0] for row in result]

    def get_all_user_ids(self) -> List[UUID]:
        query = text("SELECT id FROM users")
        result = self.db.execute(query)
        return [uuid_lib.UUID(row[0]) for row in result]

    # Ad cache operations
    def get_user_ad_cache(self, user_id: UUID) -> Optional[UserAdCache]:
        return self.db.query(UserAdCache).filter(UserAdCache.user_id == user_id).first()

    def upsert_user_ad_cache(self, cache: UserAdCache) -> UserAdCache:
        existing = self.get_user_ad_cache(cache.user_id)
        if existing:
            existing.ad_ids = cache.ad_ids
            existing.interests = cache.interests
            existing.last_analyzed_at = cache.last_analyzed_at
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            self.db.add(cache)
            self.db.commit()
            self.db.refresh(cache)
            return cache

    # Impression tracking
    def create_impression(self, impression: AdImpression) -> AdImpression:
        self.db.add(impression)
        self.db.commit()
        self.db.refresh(impression)
        return impression
