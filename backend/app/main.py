import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import asyncio
import logging

from .services.gemini_client import GeminiClient
from .services.search_client import SearchClient
from .services.era_detector import EraDetector
from .services.database import DatabaseService
from .models.schemas import (
    ReconstructRequest,
    ReconstructionReport,
    HealthCheck
)
from .dependencies import get_gemini_client, get_search_client, get_era_detector, get_db_service
from .core.config import Settings, get_settings
from .middleware.rate_limit import RateLimitMiddleware

from .api.errors import add_exception_handlers

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Project Chronos - The AI Archeologist",
    description="AI-powered text fragment reconstruction with era detection",
    version="1.0.0"
)

# Add custom exception handlers
add_exception_handlers(app)

# Add rate limiting middleware
settings = get_settings()
app.add_middleware(RateLimitMiddleware, requests_per_minute=settings.max_requests_per_minute)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database service for startup/shutdown
db_service_instance = None

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    global db_service_instance
    settings_instance = get_settings()
    db_service_instance = DatabaseService(settings_instance)
    
    # Try to connect to database, but don't fail if unavailable
    try:
        await db_service_instance.connect()
        logger.info("Database connected successfully")
    except Exception as e:
        logger.warning(f"Database connection failed: {str(e)}")
        logger.info("Running without database - reports won't be stored")
        db_service_instance = None
    
    logger.info(f"Project Chronos backend started successfully (Demo mode: {settings_instance.demo_mode})")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global db_service_instance
    if db_service_instance:
        try:
            await db_service_instance.disconnect()
            logger.info("Database disconnected")
        except Exception as e:
            logger.warning(f"Error disconnecting database: {str(e)}")
    logger.info("Project Chronos backend shut down")


@app.get("/health", response_model=HealthCheck)
@app.get("/api/health", response_model=HealthCheck)
async def health_check(settings: Settings = Depends(get_settings)):
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0",
        demo_mode=settings.demo_mode
    )


from .core.exceptions import InvalidInputError, ReconstructionError

@app.post("/api/reconstruct", response_model=ReconstructionReport)
async def reconstruct_fragment(
    request: ReconstructRequest,
    gemini_client: GeminiClient = Depends(get_gemini_client),
    search_client: SearchClient = Depends(get_search_client),
    era_detector: EraDetector = Depends(get_era_detector),
    db_service: DatabaseService = Depends(get_db_service),
    settings: Settings = Depends(get_settings)
):
    """
    Core orchestration endpoint for text fragment reconstruction
    """
    logger.info(f"Processing reconstruction request: {request.fragment[:50]}...")
    
    # Step 1: Sanitize and validate input
    fragment = request.fragment.strip()
    if not fragment:
        raise InvalidInputError("Fragment cannot be empty")
    
    if len(fragment) < 5:
        raise InvalidInputError("Fragment too short (minimum 5 characters)")
    
    if len(fragment) > 2000:
        raise InvalidInputError("Fragment too long (max 2000 characters)")
    
    # Check for suspicious patterns
    if fragment.count('\n') > 50:
        raise InvalidInputError("Fragment contains too many line breaks")
    
    try:
        # Step 2: Call Gemini for reconstruction
        logger.info("Calling Gemini for reconstruction...")
        gemini_response = await gemini_client.reconstruct_fragment(fragment)
        if not gemini_response or "reconstructed_text" not in gemini_response:
            raise ReconstructionError("Failed to get a valid reconstruction from the AI model.")

        # Step 3: Search for contextual sources
        logger.info("Searching for contextual sources...")
        max_sources = min(request.options.get("max_sources", 5), 10)  # Cap at 10
        contextual_sources = await search_client.search_sources(
            gemini_response.get("keywords", []),
            max_results=max_sources
        )
        
        # Step 4: Era detection
        logger.info("Detecting era...")
        era_detection_enabled = request.options.get("era_detection", True)
        era_result = None
        
        if era_detection_enabled:
            era_result = await era_detector.detect_era(
                fragment, 
                gemini_response.get("era_guess")
            )
        
        # Step 5: Compose final report
        start_time = datetime.utcnow()
        processing_time_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        
        report = ReconstructionReport(
            id=str(uuid.uuid4()),
            fragment=fragment,
            original_fragment=fragment,
            reconstructed_text=gemini_response.get("reconstructed_text", ""),
            explanation=gemini_response.get("explanation", ""),
            missing_words=gemini_response.get("missing_words", []),
            keywords=gemini_response.get("keywords", []),
            reconstruction_confidence=min(max(gemini_response.get("confidence", 0.8), 0.0), 0.95),  # Cap at 95%
            contextual_sources=contextual_sources,
            era_guess=era_result,
            created_at=datetime.utcnow(),
            metadata={
                "timestamp": datetime.utcnow().isoformat(),
                "processing_time_ms": processing_time_ms
            },
            model_meta={
                "model": settings.gemini_model,
                "tokens_used": gemini_response.get("tokens_used", 0),
                "demo_mode": settings.demo_mode
            }
        )
        
        # Step 6: Store in database (non-blocking)
        logger.info("Storing report in database...")
        if db_service:
            try:
                await db_service.store_report(report)
            except Exception as e:
                logger.error(f"Failed to store report in database: {str(e)}")
                # Don't fail the request if database storage fails
        else:
            logger.debug("Skipping database storage (database not available)")
        
        logger.info(f"Reconstruction completed successfully: {report.id}")
        return report
        
    except InvalidInputError:
        raise  # Re-raise validation errors
    except ReconstructionError:
        raise  # Re-raise reconstruction errors
    except Exception as e:
        logger.error(f"Unexpected error during reconstruction: {str(e)}", exc_info=True)
        raise ReconstructionError(f"An unexpected error occurred during reconstruction: {str(e)}")
        
@app.get("/api/report/{report_id}", response_model=ReconstructionReport)
async def get_report(report_id: str, db_service: DatabaseService = Depends(get_db_service)):
    """Fetch a single stored report"""
    report = await db_service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@app.get("/api/reports")
async def list_reports(limit: int = 10, offset: int = 0, db_service: DatabaseService = Depends(get_db_service)):
    """List recent reports with pagination"""
    reports = await db_service.list_reports(limit=limit, offset=offset)
    return {"reports": reports, "limit": limit, "offset": offset}

@app.post("/api/admin/seed-era-samples")
async def seed_era_samples(era_detector: EraDetector = Depends(get_era_detector)):
    """Admin endpoint to seed era samples with embeddings"""
    await era_detector.seed_era_samples()
    return {"message": "Era samples seeded successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)