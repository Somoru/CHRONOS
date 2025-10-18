from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid


class ReconstructRequest(BaseModel):
    fragment: str = Field(..., description="The text fragment to reconstruct")
    options: Dict[str, Any] = Field(
        default_factory=lambda: {"era_detection": True, "max_sources": 5},
        description="Reconstruction options"
    )


class ContextualSource(BaseModel):
    title: str
    url: str
    snippet: str


class EraGuess(BaseModel):
    label: str
    confidence: float
    reasoning: Optional[str] = None


class ReconstructionReport(BaseModel):
    id: str
    fragment: Optional[str] = None
    original_fragment: str
    reconstructed_text: str
    explanation: str
    missing_words: List[str]
    keywords: List[str]
    reconstruction_confidence: float
    contextual_sources: List[ContextualSource]
    era_guess: Optional[EraGuess] = None
    created_at: datetime
    metadata: Dict[str, Any]
    model_meta: Dict[str, Any]


class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    version: str
    demo_mode: bool


class EraSample(BaseModel):
    id: Optional[int] = None
    sample_text: str
    era_label: str
    embedding: Optional[List[float]] = None
    created_at: Optional[datetime] = None