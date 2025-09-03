"""
🚀 AI Portfolio Backend - SOLID Architecture
Superhit, Fast, Scalable Python Backend following SOLID Principles
"""

import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from loguru import logger
from datetime import datetime
from typing import List, Dict, Any

# Import our SOLID-based services
from app.core.config.settings import settings, validate_settings
from app.services.github.github_repository import GitHubRepositoryService
from app.services.github.repository_analyzer import RepositoryAnalyzerService
from app.services.ai.ai_engine import AIEngineService
from app.interfaces.github_interface import RepositoryData, AnalysisResult
from app.interfaces.ai_interface import AIInsight, AIRecommendation
from app.api.v1.api import api_router
from app.database.database import init_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger.add(settings.LOG_FILE, rotation="1 day", retention="30 days")

# Dependency injection container
class ServiceContainer:
    """Dependency injection container following Dependency Inversion Principle"""
    
    def __init__(self):
        self._github_service = None
        self._analyzer_service = None
        self._ai_service = None
    
    async def get_github_service(self) -> GitHubRepositoryService:
        """Get GitHub service instance"""
        if self._github_service is None:
            self._github_service = GitHubRepositoryService()
        return self._github_service
    
    async def get_analyzer_service(self) -> RepositoryAnalyzerService:
        """Get analyzer service instance"""
        if self._analyzer_service is None:
            github_service = await self.get_github_service()
            self._analyzer_service = RepositoryAnalyzerService(github_service)
        return self._analyzer_service
    
    async def get_ai_service(self) -> AIEngineService:
        """Get AI service instance"""
        if self._ai_service is None:
            self._ai_service = AIEngineService()
        return self._ai_service

# Global service container
container = ServiceContainer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("🚀 Starting AI Portfolio Backend (SOLID Architecture)...")
    
    # Validate settings
    if not validate_settings():
        logger.warning("⚠️  Some required settings are missing")
    
    # Initialize database
    try:
        init_db()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down AI Portfolio Backend...")

# Create FastAPI app
app = FastAPI(
    title="🚀 AI Portfolio Backend (SOLID)",
    description="Superhit, Fast, Scalable Python Backend following SOLID Principles",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Portfolio Backend (SOLID)",
        "version": "2.0.0",
        "architecture": "SOLID Principles",
        "timestamp": datetime.now().isoformat()
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with portfolio information"""
    return {
        "message": "🚀 Welcome to AI Portfolio Backend (SOLID Architecture)!",
        "description": "Superhit, Fast, Scalable Python Backend following SOLID Principles",
        "principles": [
            "🔧 Single Responsibility Principle",
            "🔓 Open/Closed Principle", 
            "🔄 Liskov Substitution Principle",
            "🔌 Interface Segregation Principle",
            "⬆️  Dependency Inversion Principle"
        ],
        "features": [
            "🤖 AI-Powered GitHub Analysis",
            "📊 Advanced Portfolio Analytics",
            "🚀 Real-time Insights",
            "📈 Professional Reporting",
            "🎯 Career Guidance",
            "⚡ Lightning Fast Performance"
        ],
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "api": "/api/v1"
        },
        "author": "Ali The Analyst",
        "version": "2.0.0"
    }

# GitHub Analysis Endpoints
@app.get("/api/v1/github/repositories/{username}")
async def get_user_repositories(
    username: str,
    max_repos: int = 50,
    github_service: GitHubRepositoryService = Depends(container.get_github_service)
):
    """Get user repositories"""
    try:
        logger.info(f"Fetching repositories for user: {username}")
        
        async with github_service:
            repositories = await github_service.get_repositories(username, max_repos)
        
        return {
            "success": True,
            "username": username,
            "total_count": len(repositories),
            "repositories": [
                {
                    "id": repo.id,
                    "name": repo.name,
                    "full_name": repo.full_name,
                    "description": repo.description,
                    "language": repo.language,
                    "stars": repo.stars,
                    "forks": repo.forks,
                    "topics": repo.topics,
                    "url": repo.url,
                    "created_at": repo.created_at,
                    "updated_at": repo.updated_at
                }
                for repo in repositories
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch repositories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/github/analyze/{username}/{repo_name}")
async def analyze_repository(
    username: str,
    repo_name: str,
    analyzer_service: RepositoryAnalyzerService = Depends(container.get_analyzer_service),
    ai_service: AIEngineService = Depends(container.get_ai_service)
):
    """Analyze a single repository"""
    try:
        logger.info(f"Analyzing repository: {username}/{repo_name}")
        
        # Get repository data
        github_service = await container.get_github_service()
        async with github_service:
            repository = await github_service.get_repository(username, repo_name)
        
        # Analyze repository
        analysis = await analyzer_service.analyze_repository(repository)
        
        # Generate AI insights
        ai_insights = await ai_service.generate_insights(
            {
                "repository": repository.__dict__,
                "analysis": analysis.__dict__
            },
            "repository_analysis"
        )
        
        return {
            "success": True,
            "repository": f"{username}/{repo_name}",
            "analysis": {
                "technical_score": analysis.technical_score,
                "quality_score": analysis.quality_score,
                "activity_score": analysis.activity_score,
                "overall_score": analysis.overall_score,
                "insights": analysis.insights,
                "recommendations": analysis.recommendations,
                "timestamp": analysis.timestamp
            },
            "ai_insights": [
                {
                    "type": insight.type,
                    "content": insight.content,
                    "confidence": insight.confidence,
                    "category": insight.category
                }
                for insight in ai_insights
            ]
        }
        
    except Exception as e:
        logger.error(f"Repository analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/github/batch-analyze/{username}")
async def batch_analyze_repositories(
    username: str,
    max_repos: int = 20,
    analyzer_service: RepositoryAnalyzerService = Depends(container.get_analyzer_service),
    ai_service: AIEngineService = Depends(container.get_ai_service)
):
    """Analyze multiple repositories"""
    try:
        logger.info(f"Batch analyzing repositories for user: {username}")
        
        # Get repositories
        github_service = await container.get_github_service()
        async with github_service:
            repositories = await github_service.get_repositories(username, max_repos)
        
        # Analyze repositories
        analyses = await analyzer_service.analyze_batch(repositories)
        
        # Generate portfolio insights
        portfolio_data = {
            "repositories": [repo.__dict__ for repo in repositories],
            "analyses": [analysis.__dict__ for analysis in analyses]
        }
        
        ai_insights = await ai_service.generate_insights(portfolio_data, "portfolio_analysis")
        ai_recommendations = await ai_service.generate_recommendations(portfolio_data, "portfolio_analysis")
        
        return {
            "success": True,
            "username": username,
            "total_repositories": len(repositories),
            "analyzed_repositories": len(analyses),
            "analyses": [
                {
                    "repository": analysis.repository.name,
                    "technical_score": analysis.technical_score,
                    "quality_score": analysis.quality_score,
                    "activity_score": analysis.activity_score,
                    "overall_score": analysis.overall_score
                }
                for analysis in analyses
            ],
            "portfolio_insights": [
                {
                    "type": insight.type,
                    "content": insight.content,
                    "confidence": insight.confidence,
                    "category": insight.category
                }
                for insight in ai_insights
            ],
            "recommendations": [
                {
                    "priority": rec.priority,
                    "category": rec.category,
                    "title": rec.title,
                    "description": rec.description,
                    "impact": rec.impact,
                    "effort": rec.effort
                }
                for rec in ai_recommendations
            ]
        }
        
    except Exception as e:
        logger.error(f"Batch analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# AI Endpoints
@app.post("/api/v1/ai/analyze")
async def ai_analyze(
    data: Dict[str, Any],
    context: str = "general",
    ai_service: AIEngineService = Depends(container.get_ai_service)
):
    """AI-powered analysis endpoint"""
    try:
        logger.info(f"AI analysis requested for context: {context}")
        
        insights = await ai_service.generate_insights(data, context)
        recommendations = await ai_service.generate_recommendations(data, context)
        
        return {
            "success": True,
            "context": context,
            "insights": [
                {
                    "type": insight.type,
                    "content": insight.content,
                    "confidence": insight.confidence,
                    "category": insight.category
                }
                for insight in insights
            ],
            "recommendations": [
                {
                    "priority": rec.priority,
                    "category": rec.category,
                    "title": rec.title,
                    "description": rec.description,
                    "impact": rec.impact,
                    "effort": rec.effort
                }
                for rec in recommendations
            ]
        }
        
    except Exception as e:
        logger.error(f"AI analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Test endpoints
@app.get("/api/v1/test")
async def test_endpoint():
    """Test endpoint"""
    return {
        "success": True,
        "message": "SOLID Architecture API is working!",
        "timestamp": datetime.now().isoformat()
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "Something went wrong on our end",
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    logger.info("🚀 Starting AI Portfolio Backend Server (SOLID Architecture)...")
    uvicorn.run(
        "main_solid:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
