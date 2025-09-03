"""
🤖 AI Insights Endpoints
AI-powered analysis and recommendations
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any
from loguru import logger

from app.services.ai_engine import ai_engine

router = APIRouter()

class AIAnalysisRequest(BaseModel):
    """AI analysis request model"""
    data: Dict[str, Any]
    analysis_type: str = "general"
    include_recommendations: bool = True

@router.post("/analyze")
async def analyze_with_ai(request: AIAnalysisRequest):
    """Analyze data with AI"""
    try:
        logger.info(f"Starting AI analysis: {request.analysis_type}")
        
        if request.analysis_type == "repository":
            insights = await ai_engine.generate_repository_insights(request.data)
        elif request.analysis_type == "portfolio":
            insights = await ai_engine.generate_portfolio_insights(request.data)
        else:
            insights = await ai_engine.generate_repository_insights(request.data)
        
        return {
            "success": True,
            "analysis_type": request.analysis_type,
            "data": insights
        }
        
    except Exception as e:
        logger.error(f"AI analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-description")
async def generate_project_description(project_data: Dict[str, Any], audience: str = "technical"):
    """Generate project description for different audiences"""
    try:
        logger.info(f"Generating description for audience: {audience}")
        
        description = await ai_engine.generate_project_description(project_data, audience)
        
        return {
            "success": True,
            "audience": audience,
            "description": description
        }
        
    except Exception as e:
        logger.error(f"Failed to generate description: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights-summary")
async def get_ai_insights_summary():
    """Get AI insights summary"""
    try:
        summary = {
            "ai_capabilities": [
                "Repository analysis and insights",
                "Portfolio optimization recommendations",
                "Career guidance and skill assessment",
                "Project description generation",
                "Market positioning analysis"
            ],
            "analysis_types": [
                "Technical complexity assessment",
                "Code quality evaluation",
                "Business value analysis",
                "Career impact assessment",
                "Market opportunity identification"
            ],
            "benefits": [
                "Professional portfolio insights",
                "Data-driven career decisions",
                "Skill gap identification",
                "Market trend analysis",
                "Competitive positioning"
            ]
        }
        
        return {
            "success": True,
            "data": summary
        }
        
    except Exception as e:
        logger.error(f"Failed to get AI summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))
