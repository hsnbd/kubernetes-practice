from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.repository import Repository
from app.targeting_service import TargetingService
from app.schemas import (
    CampaignResponse,
    TargetedAdsResponse,
    ImpressionRequest,
    ImpressionResponse
)
from app.auth import get_current_user_id

router = APIRouter(prefix="/api/ads", tags=["ads"])


@router.get("/targeted", response_model=TargetedAdsResponse)
async def get_targeted_ads(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get targeted ads for the current user"""
    repo = Repository(db)
    targeting_service = TargetingService(repo)
    
    ads = targeting_service.get_targeted_ads(user_id)
    
    return TargetedAdsResponse(ads=ads)


@router.post("/impressions", response_model=ImpressionResponse)
async def track_impression(
    impression_req: ImpressionRequest,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Track an ad impression or click"""
    repo = Repository(db)
    targeting_service = TargetingService(repo)
    
    impression = targeting_service.track_impression(
        user_id=user_id,
        campaign_id=impression_req.campaign_id,
        clicked=impression_req.clicked
    )
    
    return ImpressionResponse.from_orm(impression)


@router.get("/campaigns", response_model=List[CampaignResponse])
async def list_campaigns(
    db: Session = Depends(get_db)
):
    """List all active campaigns (for debugging/admin)"""
    repo = Repository(db)
    campaigns = repo.get_active_campaigns()
    
    return [CampaignResponse.from_orm(c) for c in campaigns]
