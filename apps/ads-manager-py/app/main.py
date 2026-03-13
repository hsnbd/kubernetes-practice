from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.database import engine
from sqlalchemy import text

from app.config import settings
from app.routes import router as ads_router
from app.analysis_service import analysis_service

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Ads Manager API",
    description="Contextual advertising service for todo application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ads_router)


@app.on_event("startup")
async def startup_event():
    """Start the analysis service on application startup"""
    logger.info("Starting Ads Manager API...")
    analysis_service.start()
    logger.info("Application started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Stop the analysis service on application shutdown"""
    logger.info("Shutting down...")
    analysis_service.stop()
    logger.info("Shutdown complete")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ads-manager"}


@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint - verifies database connectivity"""
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise HTTPException(
            status_code=503,
            detail={"status": "not ready", "error": "database unavailable"}
        )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ads-manager",
        "version": "1.0.0",
        "docs": "/docs"
    }
