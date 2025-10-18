import asyncpg
import json
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..core.config import get_settings
from ..models.schemas import ReconstructionReport, ContextualSource, EraGuess

logger = logging.getLogger(__name__)


class DatabaseService:
    def __init__(self, settings):
        self.settings = settings
        self.pool = None
    
    async def connect(self):
        """Initialize database connection pool"""
        try:
            self.pool = await asyncpg.create_pool(
                self.settings.database_url,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            logger.info("Database connection pool created")
        except Exception as e:
            logger.error(f"Failed to create database pool: {str(e)}")
            raise
    
    async def disconnect(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            logger.info("Database connection pool closed")
    
    async def store_report(self, report: ReconstructionReport) -> str:
        """Store reconstruction report in database"""
        try:
            async with self.pool.acquire() as conn:
                query = """
                INSERT INTO reports (
                    id, original_fragment, reconstructed_text, explanation,
                    missing_words, keywords, reconstruction_confidence,
                    era_label, era_confidence, contextual_sources, model_meta
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id
                """
                
                # Prepare data
                contextual_sources_json = json.dumps([
                    {
                        "title": source.title,
                        "url": source.url,
                        "snippet": source.snippet
                    } for source in report.contextual_sources
                ])
                
                era_label = report.era_guess.label if report.era_guess else None
                era_confidence = report.era_guess.confidence if report.era_guess else None
                
                result = await conn.fetchval(
                    query,
                    report.id,
                    report.original_fragment,
                    report.reconstructed_text,
                    report.explanation,
                    report.missing_words,
                    report.keywords,
                    report.reconstruction_confidence,
                    era_label,
                    era_confidence,
                    contextual_sources_json,
                    json.dumps(report.model_meta)
                )
                
                logger.info(f"Stored report: {result}")
                return result
                
        except Exception as e:
            logger.error(f"Failed to store report: {str(e)}")
            raise
    
    async def get_report(self, report_id: str) -> Optional[ReconstructionReport]:
        """Fetch a single report by ID"""
        try:
            async with self.pool.acquire() as conn:
                query = """
                SELECT id, original_fragment, reconstructed_text, explanation,
                       missing_words, keywords, reconstruction_confidence,
                       era_label, era_confidence, contextual_sources, 
                       model_meta, created_at
                FROM reports WHERE id = $1
                """
                
                row = await conn.fetchrow(query, report_id)
                if not row:
                    return None
                
                return self._row_to_report(row)
                
        except Exception as e:
            logger.error(f"Failed to fetch report {report_id}: {str(e)}")
            return None
    
    async def list_reports(self, limit: int = 10, offset: int = 0) -> List[Dict[str, Any]]:
        """List reports with pagination"""
        try:
            async with self.pool.acquire() as conn:
                query = """
                SELECT id, original_fragment, reconstructed_text, era_label,
                       reconstruction_confidence, created_at
                FROM reports 
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
                """
                
                rows = await conn.fetch(query, limit, offset)
                
                reports = []
                for row in rows:
                    reports.append({
                        "id": row["id"],
                        "original_fragment": row["original_fragment"][:100] + "..." if len(row["original_fragment"]) > 100 else row["original_fragment"],
                        "reconstructed_text": row["reconstructed_text"][:100] + "..." if len(row["reconstructed_text"]) > 100 else row["reconstructed_text"],
                        "era_label": row["era_label"],
                        "reconstruction_confidence": row["reconstruction_confidence"],
                        "created_at": row["created_at"].isoformat()
                    })
                
                return reports
                
        except Exception as e:
            logger.error(f"Failed to list reports: {str(e)}")
            return []
    
    def _row_to_report(self, row) -> ReconstructionReport:
        """Convert database row to ReconstructionReport"""
        # Parse contextual sources
        contextual_sources_data = json.loads(row["contextual_sources"]) if row["contextual_sources"] else []
        contextual_sources = [
            ContextualSource(
                title=source["title"],
                url=source["url"],
                snippet=source["snippet"]
            ) for source in contextual_sources_data
        ]
        
        # Parse era guess
        era_guess = None
        if row["era_label"] and row["era_confidence"]:
            era_guess = EraGuess(
                label=row["era_label"],
                confidence=row["era_confidence"]
            )
        
        # Parse model meta
        model_meta = json.loads(row["model_meta"]) if row["model_meta"] else {}
        
        return ReconstructionReport(
            id=row["id"],
            original_fragment=row["original_fragment"],
            reconstructed_text=row["reconstructed_text"],
            explanation=row["explanation"],
            missing_words=row["missing_words"] or [],
            keywords=row["keywords"] or [],
            reconstruction_confidence=row["reconstruction_confidence"],
            contextual_sources=contextual_sources,
            era_guess=era_guess,
            created_at=row["created_at"],
            model_meta=model_meta
        )