"""
🚀 Enhanced GitHub API Endpoints
Advanced repository analysis with similar repo search and best practices
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any
from loguru import logger

from app.services.github.github_repository import GitHubRepositoryService
from app.services.github.repository_analyzer import RepositoryAnalyzerService
from app.services.github.enhanced_analyzer import EnhancedGitHubAnalyzer

router = APIRouter()

async def get_enhanced_analyzer() -> EnhancedGitHubAnalyzer:
    """Get enhanced analyzer instance"""
    github_service = GitHubRepositoryService()
    analyzer_service = RepositoryAnalyzerService(github_service)
    return EnhancedGitHubAnalyzer(github_service, analyzer_service)

@router.post("/enhanced-analyze/{username}/{repo_name}")
async def enhanced_analyze_repository(
    username: str,
    repo_name: str,
    enhanced_analyzer: EnhancedGitHubAnalyzer = Depends(get_enhanced_analyzer)
):
    """Enhanced repository analysis with similar repo search and best practices"""
    try:
        logger.info(f"🔍 Enhanced analysis for: {username}/{repo_name}")
        
        # Get repository data
        async with enhanced_analyzer.github_service:
            repository = await enhanced_analyzer.github_service.get_repository(username, repo_name)
        
        # Perform enhanced analysis
        enhanced_analysis = await enhanced_analyzer.enhance_repository_analysis(repository)
        
        return {
            "success": True,
            "repository": f"{username}/{repo_name}",
            "enhanced_analysis": enhanced_analysis,
            "summary": {
                "basic_scores": {
                    "technical": enhanced_analysis["basic_analysis"].technical_score,
                    "quality": enhanced_analysis["basic_analysis"].quality_score,
                    "activity": enhanced_analysis["basic_analysis"].activity_score,
                    "overall": enhanced_analysis["basic_analysis"].overall_score
                },
                "enhanced_scores": enhanced_analysis["enhanced_scores"],
                "similar_repos_found": len(enhanced_analysis["similar_repositories"]),
                "improvements_suggested": len(enhanced_analysis["improvements"]),
                "market_position": enhanced_analysis["enhanced_scores"]["market_position_score"]
            }
        }
        
    except Exception as e:
        logger.error(f"Enhanced analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/enhanced-batch-analyze/{username}")
async def enhanced_batch_analyze_repositories(
    username: str,
    max_repos: int = 10,
    enhanced_analyzer: EnhancedGitHubAnalyzer = Depends(get_enhanced_analyzer)
):
    """Enhanced batch analysis of multiple repositories"""
    try:
        logger.info(f"🔍 Enhanced batch analysis for: {username}")
        
        # Get repositories
        async with enhanced_analyzer.github_service:
            repositories = await enhanced_analyzer.github_service.get_repositories(username, max_repos)
        
        # Perform enhanced analysis on each repository
        enhanced_analyses = []
        for repo in repositories:
            try:
                analysis = await enhanced_analyzer.enhance_repository_analysis(repo)
                enhanced_analyses.append(analysis)
            except Exception as e:
                logger.error(f"Failed to analyze {repo.name}: {e}")
                continue
        
        # Calculate portfolio-level insights
        portfolio_insights = await _calculate_portfolio_insights(enhanced_analyses)
        
        return {
            "success": True,
            "username": username,
            "total_repositories": len(repositories),
            "analyzed_repositories": len(enhanced_analyses),
            "enhanced_analyses": [
                {
                    "repository": analysis["repository"].name,
                    "enhanced_scores": analysis["enhanced_scores"],
                    "improvements_count": len(analysis["improvements"]),
                    "similar_repos_count": len(analysis["similar_repositories"])
                }
                for analysis in enhanced_analyses
            ],
            "portfolio_insights": portfolio_insights
        }
        
    except Exception as e:
        logger.error(f"Enhanced batch analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/similar-repositories/{username}/{repo_name}")
async def get_similar_repositories(
    username: str,
    repo_name: str,
    enhanced_analyzer: EnhancedGitHubAnalyzer = Depends(get_enhanced_analyzer)
):
    """Get similar repositories for a given repository"""
    try:
        logger.info(f"🔍 Finding similar repositories for: {username}/{repo_name}")
        
        # Get repository data
        async with enhanced_analyzer.github_service:
            repository = await enhanced_analyzer.github_service.get_repository(username, repo_name)
        
        # Find similar repositories
        similar_repos = await enhanced_analyzer._search_similar_repositories(repository)
        
        return {
            "success": True,
            "repository": f"{username}/{repo_name}",
            "similar_repositories": [
                {
                    "name": repo["name"],
                    "full_name": repo["full_name"],
                    "description": repo.get("description"),
                    "language": repo.get("language"),
                    "stars": repo["stargazers_count"],
                    "forks": repo["forks_count"],
                    "topics": repo.get("topics", []),
                    "url": repo["html_url"]
                }
                for repo in similar_repos
            ],
            "total_found": len(similar_repos)
        }
        
    except Exception as e:
        logger.error(f"Similar repositories search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/best-practices/{username}/{repo_name}")
async def get_best_practices(
    username: str,
    repo_name: str,
    enhanced_analyzer: EnhancedGitHubAnalyzer = Depends(get_enhanced_analyzer)
):
    """Get best practices recommendations for a repository"""
    try:
        logger.info(f"💡 Getting best practices for: {username}/{repo_name}")
        
        # Get repository data
        async with enhanced_analyzer.github_service:
            repository = await enhanced_analyzer.github_service.get_repository(username, repo_name)
        
        # Get basic analysis
        basic_analysis = await enhanced_analyzer.analyzer_service.analyze_repository(repository)
        
        # Find similar repositories
        similar_repos = await enhanced_analyzer._search_similar_repositories(repository)
        
        # Analyze top repositories
        top_repos_analysis = await enhanced_analyzer._analyze_top_repositories(similar_repos)
        
        # Generate recommendations
        improvements = await enhanced_analyzer._generate_improvement_recommendations(
            repository, basic_analysis, top_repos_analysis
        )
        
        return {
            "success": True,
            "repository": f"{username}/{repo_name}",
            "current_scores": {
                "technical": basic_analysis.technical_score,
                "quality": basic_analysis.quality_score,
                "activity": basic_analysis.activity_score,
                "overall": basic_analysis.overall_score
            },
            "best_practices": top_repos_analysis.get("best_practices", []),
            "improvements": improvements,
            "similar_repos_analyzed": top_repos_analysis.get("total_analyzed", 0)
        }
        
    except Exception as e:
        logger.error(f"Best practices analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def _calculate_portfolio_insights(enhanced_analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate portfolio-level insights from enhanced analyses"""
    if not enhanced_analyses:
        return {}
    
    # Calculate averages
    avg_technical = sum(analysis["enhanced_scores"]["technical_score"] for analysis in enhanced_analyses) / len(enhanced_analyses)
    avg_quality = sum(analysis["enhanced_scores"]["quality_score"] for analysis in enhanced_analyses) / len(enhanced_analyses)
    avg_activity = sum(analysis["enhanced_scores"]["activity_score"] for analysis in enhanced_analyses) / len(enhanced_analyses)
    avg_market_position = sum(analysis["enhanced_scores"]["market_position_score"] for analysis in enhanced_analyses) / len(enhanced_analyses)
    avg_improvement_potential = sum(analysis["enhanced_scores"]["improvement_potential_score"] for analysis in enhanced_analyses) / len(enhanced_analyses)
    
    # Count improvements by priority
    high_priority_improvements = sum(
        len([imp for imp in analysis["improvements"] if imp.get("priority") == "high"])
        for analysis in enhanced_analyses
    )
    medium_priority_improvements = sum(
        len([imp for imp in analysis["improvements"] if imp.get("priority") == "medium"])
        for analysis in enhanced_analyses
    )
    
    # Find top performing repository
    top_repo = max(enhanced_analyses, key=lambda x: x["enhanced_scores"]["overall_score"])
    
    return {
        "average_scores": {
            "technical": round(avg_technical, 2),
            "quality": round(avg_quality, 2),
            "activity": round(avg_activity, 2),
            "market_position": round(avg_market_position, 2),
            "improvement_potential": round(avg_improvement_potential, 2),
            "overall": round((avg_technical + avg_quality + avg_activity + avg_market_position + avg_improvement_potential) / 5, 2)
        },
        "improvement_summary": {
            "high_priority": high_priority_improvements,
            "medium_priority": medium_priority_improvements,
            "total_improvements": high_priority_improvements + medium_priority_improvements
        },
        "top_performing_repository": {
            "name": top_repo["repository"].name,
            "overall_score": top_repo["enhanced_scores"]["overall_score"],
            "market_position": top_repo["enhanced_scores"]["market_position_score"]
        },
        "portfolio_strengths": [
            "Strong technical implementation" if avg_technical > 7 else "Technical skills development needed",
            "High code quality" if avg_quality > 7 else "Code quality improvement needed",
            "Active development" if avg_activity > 6 else "Increase development activity",
            "Good market position" if avg_market_position > 6 else "Improve repository visibility"
        ]
    }
