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
from .core.config import get_settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Initialize FastAPI app
app = FastAPI(
    title="Project Chronos - The AI Archeologist",
    description="AI-powered text fragment reconstruction with era detection",
    version="1.0.0"
)

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

# Initialize services
gemini_client = GeminiClient()
search_client = SearchClient()
era_detector = EraDetector()
db_service = DatabaseService()


@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    await db_service.connect()
    logger.info("Project Chronos backend started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    await db_service.disconnect()
    logger.info("Project Chronos backend shut down")


@app.get("/api/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0",
        demo_mode=settings.demo_mode
    )


@app.post("/api/reconstruct", response_model=ReconstructionReport)
async def reconstruct_fragment(request: ReconstructRequest):
    """
    Core orchestration endpoint for text fragment reconstruction
    """
    try:
        logger.info(f"Processing reconstruction request: {request.fragment[:50]}...")
        
        # Step 1: Sanitize input
        fragment = request.fragment.strip()
        if not fragment:
            raise HTTPException(status_code=400, detail="Fragment cannot be empty")
        
        if len(fragment) > 2000:
            raise HTTPException(status_code=400, detail="Fragment too long (max 2000 characters)")
        
        # Step 2: Call Gemini for reconstruction
        logger.info("Calling Gemini for reconstruction...")
        gemini_response = await gemini_client.reconstruct_fragment(fragment)
        
        # Step 3: Search for contextual sources
        logger.info("Searching for contextual sources...")
        max_sources = request.options.get("max_sources", 5)
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
        report = ReconstructionReport(
            id=str(uuid.uuid4()),
            original_fragment=fragment,
            reconstructed_text=gemini_response.get("reconstructed_text", ""),
            explanation=gemini_response.get("explanation", ""),
            missing_words=gemini_response.get("missing_words", []),
            keywords=gemini_response.get("keywords", []),
            reconstruction_confidence=gemini_response.get("confidence", 0.8),
            contextual_sources=contextual_sources,
            era_guess=era_result,
            created_at=datetime.utcnow(),
            model_meta={
                "model": settings.gemini_model,
                "tokens_used": gemini_response.get("tokens_used", 0),
                "demo_mode": settings.demo_mode
            }
        )
        
        # Step 6: Store in database
        logger.info("Storing report in database...")
        await db_service.store_report(report)
        
        logger.info(f"Reconstruction completed successfully: {report.id}")
        return report
        
    except Exception as e:
        logger.error(f"Error during reconstruction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Reconstruction failed: {str(e)}")


@app.get("/api/report/{report_id}", response_model=ReconstructionReport)
async def get_report(report_id: str):
    """Fetch a single stored report"""
    try:
        report = await db_service.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except Exception as e:
        logger.error(f"Error fetching report {report_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch report")


@app.get("/api/reports")
async def list_reports(limit: int = 10, offset: int = 0):
    """List recent reports with pagination"""
    try:
        reports = await db_service.list_reports(limit=limit, offset=offset)
        return {"reports": reports, "limit": limit, "offset": offset}
    except Exception as e:
        logger.error(f"Error listing reports: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list reports")


@app.post("/api/admin/seed-era-samples")
async def seed_era_samples():
    """Admin endpoint to seed era samples with embeddings"""
    try:
        await era_detector.seed_era_samples()
        return {"message": "Era samples seeded successfully"}
    except Exception as e:
        logger.error(f"Error seeding era samples: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to seed era samples")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)