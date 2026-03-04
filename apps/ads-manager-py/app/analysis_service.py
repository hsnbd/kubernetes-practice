import logging
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

from app.database import SessionLocal, UserAdCache
from app.repository import Repository
from app.targeting_service import TargetingService
from app.config import settings

logger = logging.getLogger(__name__)


class AnalysisService:
    def __init__(self):
        self.scheduler = BackgroundScheduler()

    def start(self):
        """Start the periodic analysis job"""
        interval_minutes = settings.analysis_interval_minutes
        self.scheduler.add_job(
            self.analyze_all_users,
            'interval',
            minutes=interval_minutes,
            id='analyze_users',
            name='Analyze user interests and precompute ads',
            replace_existing=True
        )
        self.scheduler.start()
        logger.info(f"Analysis service started. Running every {interval_minutes} minutes.")

    def stop(self):
        """Stop the scheduler"""
        self.scheduler.shutdown()
        logger.info("Analysis service stopped.")

    def analyze_all_users(self):
        """Batch analyze all users and precompute their targeted ads"""
        logger.info("Starting batch user analysis...")
        
        db = SessionLocal()
        try:
            repo = Repository(db)
            targeting_service = TargetingService(repo)
            
            # Get all user IDs
            user_ids = repo.get_all_user_ids()
            logger.info(f"Analyzing {len(user_ids)} users...")
            
            for user_id in user_ids:
                try:
                    self.analyze_user(user_id, repo, targeting_service)
                except Exception as e:
                    logger.error(f"Error analyzing user {user_id}: {e}")
                    continue
            
            logger.info("Batch analysis complete.")
        except Exception as e:
            logger.error(f"Error in batch analysis: {e}")
        finally:
            db.close()

    def analyze_user(self, user_id, repo: Repository, targeting_service: TargetingService):
        """Analyze a single user and cache their targeted ads"""
        # Get user interests
        categories = repo.get_user_categories(user_id)
        tags = repo.get_user_tags(user_id)
        
        # Extract keywords
        keywords = targeting_service._extract_keywords(categories, tags)
        
        # Get matched campaigns
        campaigns = repo.get_active_campaigns()
        matched = targeting_service._match_campaigns(keywords, campaigns)
        
        # Take top 5 for caching
        top_campaigns = matched[:5]
        ad_ids = [str(c.id) for c in top_campaigns]
        
        # Create or update cache
        cache = UserAdCache(
            user_id=user_id,
            ad_ids=ad_ids,
            interests=keywords,
            last_analyzed_at=datetime.utcnow()
        )
        
        repo.upsert_user_ad_cache(cache)
        logger.debug(f"Cached {len(ad_ids)} ads for user {user_id}")


# Global instance
analysis_service = AnalysisService()
