import logging
from typing import Dict, Any, List, Optional
import re
from ..core.config import get_settings
from ..models.schemas import EraGuess

logger = logging.getLogger(__name__)


class EraDetector:
    def __init__(self, settings, db_service):
        self.settings = settings
        self.db_service = db_service
        
        # Phase 1: Heuristic keyword-to-era mapping
        self.keyword_patterns = {
            "late-1990s": [
                r"\bdialup\b", r"\bgeocities\b", r"\bnapster\b", r"\baol\b", 
                r"\b404\b", r"\baway message\b", r"\bbrb\b.*dialup"
            ],
            "early-2000s": [
                r"\blivejournal\b", r"\bfrienster\b", r"\bkazaa\b", r"\bmix cd\b",
                r"\baway message\b", r"\bburned.*cd\b"
            ],
            "mid-2000s": [
                r"\bmyspace\b", r"\btop 8\b", r"\brickroll\b", r"\bepic fail\b",
                r"\bpwned\b", r"\bsmh\b", r"\bg2g\b", r"\bttyl\b"
            ],
            "late-2000s": [
                r"\blolcat\b", r"\bnom nom\b", r"\bover 9000\b", r"\bdo not want\b",
                r"\bthis is sparta\b", r"\bfail\b"
            ],
            "early-2010s": [
                r"\byolo\b", r"\brage comic\b", r"\bforever alone\b", r"\btrollface\b",
                r"\bu mad bro\b", r"\brt if\b"
            ],
            "mid-2010s": [
                r"\bsliding into dms\b", r"\bnetflix and chill\b", r"\bon fleek\b",
                r"\bsorry not sorry\b", r"\bbasic af\b"
            ],
            "late-2010s": [
                r"\bnot it chief\b", r"\bweird flex\b", r"\bstan twitter\b",
                r"\bperiodt\b", r"\band i oop\b"
            ],
            "early-2020s": [
                r"\bno cap\b", r"\bfr fr\b", r"\bits giving\b", r"\bbestie\b",
                r"\btouch grass\b", r"\bbased\b"
            ]
        }
    
    async def detect_era(self, fragment: str, gemini_era_guess: Optional[Dict] = None) -> Optional[EraGuess]:
        """
        Detect era using heuristic patterns and optionally pgvector embeddings
        """
        try:
            # Phase 1: Heuristic detection
            heuristic_result = self._heuristic_detection(fragment)
            
            # If we have a Gemini guess, combine with heuristic
            if gemini_era_guess:
                gemini_result = EraGuess(
                    label=gemini_era_guess.get("label", "unknown"),
                    confidence=gemini_era_guess.get("confidence", 0.5)
                )
                
                # If both agree, boost confidence
                if heuristic_result and heuristic_result.label == gemini_result.label:
                    return EraGuess(
                        label=heuristic_result.label,
                        confidence=min(0.98, (heuristic_result.confidence + gemini_result.confidence) / 2 + 0.1)
                    )
                
                # If they disagree, prefer the one with higher confidence
                if heuristic_result and heuristic_result.confidence > gemini_result.confidence:
                    return heuristic_result
                else:
                    return gemini_result
            
            # TODO: Phase 2 - Implement pgvector embeddings lookup
            # This would involve:
            # 1. Generate embedding for fragment
            # 2. Query era_samples table for nearest neighbors
            # 3. Return majority vote with confidence based on distances
            
            return heuristic_result
            
        except Exception as e:
            logger.error(f"Era detection failed: {str(e)}")
            return EraGuess(label="unknown", confidence=0.1)
    
    def _heuristic_detection(self, fragment: str) -> Optional[EraGuess]:
        """Phase 1: Pattern-based era detection"""
        fragment_lower = fragment.lower()
        era_scores = {}
        
        for era, patterns in self.keyword_patterns.items():
            score = 0
            matches = 0
            
            for pattern in patterns:
                if re.search(pattern, fragment_lower):
                    matches += 1
                    score += 1
            
            if matches > 0:
                # Calculate confidence based on number and strength of matches
                confidence = min(0.95, 0.6 + (matches * 0.1))
                era_scores[era] = confidence
        
        if era_scores:
            best_era = max(era_scores.items(), key=lambda x: x[1])
            return EraGuess(label=best_era[0], confidence=best_era[1])
        
        return None
    
    async def seed_era_samples(self):
        """
        Seed the era_samples table with embeddings for Phase 2 implementation
        This would involve:
        1. Fetch all era_samples without embeddings
        2. Generate embeddings for each sample
        3. Update the database with embeddings
        """
        # TODO: Implement embedding generation and database updates
        logger.info("Era samples seeding not yet implemented - Phase 2 feature")
        pass
    
    async def _get_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for text (Phase 2 implementation)
        This could use OpenAI embeddings, Sentence Transformers, or other embedding APIs
        """
        # TODO: Implement actual embedding generation
        # For now, return dummy embedding
        return [0.0] * 1536