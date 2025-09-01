"""
🔍 GitHub Analysis Endpoints
Repository analysis and insights
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from fastapi.responses import JSONResponse
from typing import Optional, List
from pydantic import BaseModel
import asyncio
from loguru import logger

from app.services.github_analyzer import github_analyzer
from app.services.ai_engine import ai_engine

router = APIRouter()

class RepositoryAnalysisRequest(BaseModel):
    """Repository analysis request model"""
    username: str
    repo_name: str
    analysis_type: str = "comprehensive"
    include_ai: bool = True

class BatchAnalysisRequest(BaseModel):
    """Batch analysis request model"""
    username: str
    max_repos: int = 20
    include_private: bool = False
    include_ai: bool = True

@router.get("/repositories/{username}")
async def get_user_repositories(username: str, max_repos: int = Query(50, ge=1, le=100)):
    """Get user repositories"""
    try:
        logger.info(f"Fetching repositories for user: {username}")
        
        # This would use GitHub API to get repositories
        # For now, return mock data
        repositories = [
            {
                "name": "portfolio-backend",
                "description": "AI-powered portfolio backend",
                "language": "Python",
                "stars": 15,
                "forks": 3,
                "updated_at": "2024-01-01T00:00:00Z"
            },
            {
                "name": "data-analysis-tool",
                "description": "Advanced data analysis tool",
                "language": "Python",
                "stars": 8,
                "forks": 2,
                "updated_at": "2024-01-01T00:00:00Z"
            }
        ]
        
        return {
            "success": True,
            "username": username,
            "total_count": len(repositories),
            "repositories": repositories[:max_repos]
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch repositories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-repository")
async def analyze_repository(request: RepositoryAnalysisRequest):
    """Analyze a single repository comprehensively"""
    try:
        logger.info(f"Starting analysis of {request.username}/{request.repo_name}")
        
        # Analyze repository
        analysis = await github_analyzer.analyze_repository(
            request.username, 
            request.repo_name
        )
        
        # Generate AI insights if requested
        ai_insights = None
        if request.include_ai:
            ai_insights = await ai_engine.generate_repository_insights(analysis)
        
        return {
            "success": True,
            "repository": f"{request.username}/{request.repo_name}",
            "analysis": analysis,
            "ai_insights": ai_insights,
            "timestamp": analysis.get("timestamp")
        }
        
    except Exception as e:
        logger.error(f"Repository analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-analyze")
async def batch_analyze(
    request: BatchAnalysisRequest,
    background_tasks: BackgroundTasks
):
    """Analyze multiple repositories in background"""
    try:
        logger.info(f"Starting batch analysis for {request.username}")
        
        # Start background analysis
        task_id = f"batch_{request.username}_{int(asyncio.get_event_loop().time())}"
        
        # Add background task
        background_tasks.add_task(
            run_batch_analysis,
            task_id,
            request.username,
            request.max_repos,
            request.include_ai
        )
        
        return {
            "success": True,
            "task_id": task_id,
            "message": "Batch analysis started in background",
            "username": request.username,
            "max_repositories": request.max_repos
        }
        
    except Exception as e:
        logger.error(f"Batch analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analysis-status/{task_id}")
async def get_analysis_status(task_id: str):
    """Get status of background analysis task"""
    try:
        # This would check the actual task status
        # For now, return mock status
        return {
            "success": True,
            "task_id": task_id,
            "status": "completed",
            "progress": 100,
            "results": {
                "total_repositories": 5,
                "analyzed": 5,
                "failed": 0
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get task status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/repository/{username}/{repo_name}/languages")
async def get_repository_languages(username: str, repo_name: str):
    """Get repository language statistics"""
    try:
        # This would fetch from GitHub API
        languages = {
            "Python": 65,
            "JavaScript": 25,
            "HTML": 10
        }
        
        return {
            "success": True,
            "repository": f"{username}/{repo_name}",
            "languages": languages,
            "total_bytes": sum(languages.values())
        }
        
    except Exception as e:
        logger.error(f"Failed to get languages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/repository/{username}/{repo_name}/contributors")
async def get_repository_contributors(username: str, repo_name: str):
    """Get repository contributors"""
    try:
        # This would fetch from GitHub API
        contributors = [
            {
                "login": username,
                "contributions": 95,
                "avatar_url": f"https://github.com/{username}.png"
            }
        ]
        
        return {
            "success": True,
            "repository": f"{username}/{repo_name}",
            "contributors": contributors,
            "total_contributors": len(contributors)
        }
        
    except Exception as e:
        logger.error(f"Failed to get contributors: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def run_batch_analysis(task_id: str, username: str, max_repos: int, include_ai: bool):
    """Run batch analysis in background"""
    try:
        logger.info(f"Running batch analysis {task_id} for {username}")
        
        # This would implement the actual batch analysis
        # For now, just log the task
        await asyncio.sleep(2)  # Simulate work
        
        logger.info(f"Batch analysis {task_id} completed")
        
    except Exception as e:
        logger.error(f"Batch analysis {task_id} failed: {e}")
