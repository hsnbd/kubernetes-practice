from typing import List
from uuid import UUID
from datetime import datetime
import logging

from app.repository import Repository
from app.database import Campaign, UserAdCache, AdImpression
from app.schemas import CampaignResponse

logger = logging.getLogger(__name__)


class TargetingService:
    def __init__(self, repo: Repository):
        self.repo = repo

    def get_targeted_ads(self, user_id: UUID) -> List[CampaignResponse]:
        """Get precomputed targeted ads for a user"""
        # Try to get cached recommendations
        cache = self.repo.get_user_ad_cache(user_id)
        
        if cache and cache.ad_ids:
            # Convert string IDs to UUIDs
            try:
                campaign_ids = [UUID(ad_id) for ad_id in cache.ad_ids]
                campaigns = self.repo.get_campaigns_by_ids(campaign_ids)
                return [CampaignResponse.from_orm(c) for c in campaigns]
            except Exception as e:
                logger.warning(f"Error retrieving cached ads: {e}")
        
        # Fallback: compute on the fly
        return self.compute_targeted_ads(user_id)

    def compute_targeted_ads(self, user_id: UUID) -> List[CampaignResponse]:
        """Compute targeted ads in real-time (fallback)"""
        # Get user interests
        categories = self.repo.get_user_categories(user_id)
        tags = self.repo.get_user_tags(user_id)
        
        # Extract keywords
        keywords = self._extract_keywords(categories, tags)
        
        if not keywords:
            # No interests, return random active campaigns
            campaigns = self.repo.get_active_campaigns()[:3]
            return [CampaignResponse.from_orm(c) for c in campaigns]
        
        # Get all active campaigns
        campaigns = self.repo.get_active_campaigns()
        
        # Match and score campaigns
        matched = self._match_campaigns(keywords, campaigns)
        
        # Return top 3
        return [CampaignResponse.from_orm(c) for c in matched[:3]]

    def track_impression(self, user_id: UUID, campaign_id: UUID, clicked: bool) -> AdImpression:
        """Track an ad impression or click"""
        impression = AdImpression(
            user_id=user_id,
            campaign_id=campaign_id,
            clicked=clicked,
            timestamp=datetime.utcnow()
        )
        return self.repo.create_impression(impression)

    def _extract_keywords(self, categories: List[str], tags: List[str]) -> List[str]:
        """Extract unique keywords from categories and tags"""
        keywords = set()
        
        for cat in categories:
            keywords.add(cat.lower().strip())
        
        for tag in tags:
            keywords.add(tag.lower().strip())
        
        return list(keywords)

    def _match_campaigns(self, user_keywords: List[str], campaigns: List[Campaign]) -> List[Campaign]:
        """Match and score campaigns based on keyword overlap"""
        scored_campaigns = []
        
        for campaign in campaigns:
            score = 0
            for user_kw in user_keywords:
                for camp_kw in campaign.keywords:
                    if user_kw.lower() == camp_kw.lower():
                        score += 1
            
            if score > 0:
                scored_campaigns.append((campaign, score))
        
        # Sort by score descending
        scored_campaigns.sort(key=lambda x: x[1], reverse=True)
        
        return [c[0] for c in scored_campaigns]
