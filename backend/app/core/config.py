"""
Configuration settings for AI Portfolio Backend
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "AI Portfolio Backend"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/portfolio"
    DATABASE_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # GitHub
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_USERNAME: Optional[str] = None
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    # Background Tasks
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/portfolio.log"
    
    # Cache
    CACHE_TTL: int = 3600  # 1 hour
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Environment-specific overrides
if os.getenv("ENVIRONMENT") == "development":
    settings.DEBUG = True
    settings.DATABASE_ECHO = True
    settings.LOG_LEVEL = "DEBUG"
