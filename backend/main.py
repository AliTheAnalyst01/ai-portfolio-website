"""
🚀 AI-Powered Portfolio Backend
Superhit, Fast, Scalable Python Backend for Your Portfolio Website
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from loguru import logger
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger.add("logs/portfolio.log", rotation="1 day", retention="30 days")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("🚀 Starting AI Portfolio Backend...")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down AI Portfolio Backend...")

# Create FastAPI app
app = FastAPI(
    title="🚀 AI Portfolio Backend",
    description="Superhit, Fast, Scalable Python Backend for Professional Portfolio",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000", "http://127.0.0.1:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Portfolio Backend",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with portfolio information"""
    return {
        "message": "🚀 Welcome to AI Portfolio Backend!",
        "description": "Superhit, Fast, Scalable Python Backend",
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

# Simple API endpoints for testing
@app.get("/api/v1/test")
async def test_endpoint():
    """Test endpoint"""
    return {
        "success": True,
        "message": "API is working!",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/github/test")
async def github_test():
    """GitHub test endpoint"""
    return {
        "success": True,
        "message": "GitHub endpoints ready!",
        "features": [
            "Repository analysis",
            "Portfolio insights",
            "AI-powered recommendations"
        ]
    }

@app.get("/api/v1/portfolio/test")
async def portfolio_test():
    """Portfolio test endpoint"""
    return {
        "success": True,
        "message": "Portfolio analysis ready!",
        "features": [
            "Skill assessment",
            "Career guidance",
            "Market positioning"
        ]
    }

@app.get("/api/v1/ai/test")
async def ai_test():
    """AI test endpoint"""
    return {
        "success": True,
        "message": "AI engine ready!",
        "capabilities": [
            "Code analysis",
            "Insight generation",
            "Recommendation engine"
        ]
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
    logger.info("🚀 Starting AI Portfolio Backend Server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
