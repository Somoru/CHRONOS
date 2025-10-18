"""
Centralized dependency injection for the Chronos backend.

This module manages the lifecycle of services, ensuring that they are
instantiated once per application lifecycle and properly configured.
Using FastAPI's dependency injection system with `Depends` allows for
cleaner, more testable, and more maintainable code.

Key Principles:
- Single Responsibility: Each function is responsible for providing one service.
- Caching: Services are cached to avoid re-creating them on every request.
- Configuration: Services are configured using the centralized settings object.
- Testability: Dependencies can be easily overridden in tests.
"""

from functools import lru_cache
from fastapi import Depends
from app.core.config import Settings, get_settings
from app.services.gemini_client import GeminiClient
from app.services.search_client import SearchClient
from app.services.era_detector import EraDetector
from app.services.database import DatabaseService

# Caching the settings function to avoid re-reading environment variables
@lru_cache()
def get_cached_settings() -> Settings:
    """
    Returns a cached instance of the application settings.
    This is the recommended way to access settings in dependencies.
    """
    return get_settings()

def get_gemini_client(settings: Settings = Depends(get_cached_settings)) -> GeminiClient:
    """
    Dependency provider for the GeminiClient.
    
    Injects the GeminiClient configured with the application settings.
    
    Args:
        settings: The application settings dependency.
        
    Returns:
        An instance of the GeminiClient.
    """
    return GeminiClient(settings)

def get_search_client(settings: Settings = Depends(get_cached_settings)) -> SearchClient:
    """
    Dependency provider for the SearchClient.
    
    Injects the SearchClient configured with the application settings.
    
    Args:
        settings: The application settings dependency.
        
    Returns:
        An instance of the SearchClient.
    """
    return SearchClient(settings)

def get_db_service(settings: Settings = Depends(get_cached_settings)) -> DatabaseService:
    """
    Dependency provider for the DatabaseService.
    
    Returns the global database service instance initialized at startup.
    If the database failed to connect, returns None.
    
    Args:
        settings: The application settings dependency.
        
    Returns:
        The global DatabaseService instance or None if unavailable.
    """
    from app.main import db_service_instance
    return db_service_instance

def get_era_detector(
    db_service: DatabaseService = Depends(get_db_service),
    settings: Settings = Depends(get_cached_settings)
) -> EraDetector:
    """
    Dependency provider for the EraDetector.
    
    Injects the EraDetector configured with the application settings
    and database service.
    
    Args:
        db_service: The database service dependency.
        settings: The application settings dependency.
        
    Returns:
        An instance of the EraDetector.
    """
    return EraDetector(db_service, settings)
