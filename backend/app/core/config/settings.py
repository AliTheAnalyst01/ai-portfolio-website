"""
⚙️ Configuration Settings
Uses same environment variables as frontend following Single Responsibility Principle
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings using frontend environment variables"""
    
    # Application
    APP_NAME: str = "AI Portfolio Backend"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Frontend Integration (Same as frontend)
    NEXT_PUBLIC_APP_URL: str = "http://localhost:3000"
    NEXT_PUBLIC_GITHUB_USERNAME: Optional[str] = None
    
    # GitHub Configuration (Same as frontend)
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_USERNAME: Optional[str] = None
    
    # OpenAI Configuration (Same as frontend)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4"
    
    # Database Configuration (Same as frontend)
    DATABASE_URL: Optional[str] = None
    DATABASE_ECHO: bool = False
    
    # Analytics Configuration (Same as frontend)
    GOOGLE_ANALYTICS_ID: Optional[str] = None
    PLAUSIBLE_DOMAIN: Optional[str] = None
    
    # Performance Monitoring (Same as frontend)
    SENTRY_DSN: Optional[str] = None
    
    # Security Configuration (Same as frontend)
    NEXTAUTH_SECRET: Optional[str] = None
    NEXTAUTH_URL: str = "http://localhost:3000"
    
    # Backend-specific settings
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
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
        env_file_encoding = 'utf-8'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Use frontend environment variables if backend ones are not set
        if not self.GITHUB_USERNAME and self.NEXT_PUBLIC_GITHUB_USERNAME:
            self.GITHUB_USERNAME = self.NEXT_PUBLIC_GITHUB_USERNAME
        
        # Set environment-specific defaults
        if self.ENVIRONMENT == "development":
            self.DEBUG = True
            self.DATABASE_ECHO = True
            self.LOG_LEVEL = "DEBUG"
        
        # Ensure logs directory exists
        Path(self.LOG_FILE).parent.mkdir(parents=True, exist_ok=True)

# Create settings instance
settings = Settings()

# Validate required settings
def validate_settings():
    """Validate required settings"""
    required_settings = [
        ("GITHUB_TOKEN", "GitHub Personal Access Token"),
        ("OPENAI_API_KEY", "OpenAI API Key"),
    ]
    
    missing_settings = []
    for setting_name, description in required_settings:
        if not getattr(settings, setting_name):
            missing_settings.append(f"{setting_name} ({description})")
    
    if missing_settings:
        print("⚠️  Missing required environment variables:")
        for setting in missing_settings:
            print(f"   - {setting}")
        print("\n📝 Please set these in your .env file")
        return False
    
    return True

# Export settings
__all__ = ["settings", "validate_settings"]
