"""
🗄️ Database Configuration
SQLAlchemy database setup and session management
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
from loguru import logger

# Database URL - using SQLite for simplicity, can be changed to PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    poolclass=StaticPool if "sqlite" in DATABASE_URL else None,
    echo=False  # Set to True for SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    try:
        # Import all models
        from app.models.visitor import Visitor, AgentActivity, PersonalizedContent
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

def reset_db():
    """Reset database (drop and recreate all tables)"""
    try:
        Base.metadata.drop_all(bind=engine)
        init_db()
        logger.info("Database reset successfully")
        
    except Exception as e:
        logger.error(f"Database reset failed: {e}")
        raise
