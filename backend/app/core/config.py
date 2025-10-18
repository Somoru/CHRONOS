import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Gemini Configuration
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    
    # Google Custom Search
    google_api_key: str = ""
    google_cx: str = ""
    
    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/chronos"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # Environment
    environment: str = "development"
    secret_key: str = "your-secret-key-here"
    
    # Demo Mode
    demo_mode: bool = False
    
    # Rate Limiting
    max_requests_per_minute: int = 10
    max_monthly_tokens: int = 100000
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )
        
    def __init__(self, **values):
        super().__init__(**values)
        # Auto-enable demo mode if API keys are missing
        if not self.gemini_api_key or not self.google_api_key:
            self.demo_mode = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()