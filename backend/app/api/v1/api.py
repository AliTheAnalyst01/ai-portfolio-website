"""
🚀 Main API Router
Central router for all API endpoints
"""

from fastapi import APIRouter
from app.api.v1.endpoints import github, portfolio, ai, enhanced_github, visitor

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(
    github.router,
    prefix="/github",
    tags=["GitHub Analysis"]
)

api_router.include_router(
    portfolio.router,
    prefix="/portfolio",
    tags=["Portfolio Analysis"]
)

api_router.include_router(
    ai.router,
    prefix="/ai",
    tags=["AI Insights"]
)

api_router.include_router(
    enhanced_github.router,
    prefix="/enhanced-github",
    tags=["Enhanced GitHub Analysis"]
)

api_router.include_router(
    visitor.router,
    prefix="/visitor",
    tags=["Visitor Tracking & Personalization"]
)

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """API health check"""
    return {
        "status": "healthy",
        "api_version": "v1",
                "endpoints": [
            "/github",
            "/portfolio",
            "/ai",
            "/enhanced-github",
            "/visitor"
        ]
    }
