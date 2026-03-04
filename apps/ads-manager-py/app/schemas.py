from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class CampaignBase(BaseModel):
    title: str
    description: str
    product_url: str
    image_url: Optional[str] = None
    keywords: List[str]
    active: bool = True


class CampaignCreate(CampaignBase):
    pass


class CampaignResponse(CampaignBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class UserAdCacheResponse(BaseModel):
    user_id: UUID
    ad_ids: List[str]
    interests: List[str]
    last_analyzed_at: datetime

    class Config:
        from_attributes = True


class ImpressionRequest(BaseModel):
    campaign_id: UUID
    clicked: bool = False


class ImpressionResponse(BaseModel):
    id: UUID
    user_id: UUID
    campaign_id: UUID
    clicked: bool
    timestamp: datetime

    class Config:
        from_attributes = True


class TargetedAdsResponse(BaseModel):
    ads: List[CampaignResponse]
