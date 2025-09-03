"""
🔍 Repository Analyzer Service
Implements repository analysis following Single Responsibility Principle
"""

import asyncio
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from loguru import logger

from app.interfaces.github_interface import IRepositoryAnalyzer, RepositoryData, AnalysisResult
from app.services.github.github_repository import GitHubRepositoryService

class RepositoryAnalyzerService(IRepositoryAnalyzer):
    """Repository analyzer service implementation"""
    
    def __init__(self, github_service: GitHubRepositoryService):
        self.github_service = github_service
        self.logger = logger
    
    async def analyze_repository(self, repository: RepositoryData) -> AnalysisResult:
        """Analyze a single repository"""
        try:
            self.logger.info(f"Analyzing repository: {repository.full_name}")
            
            # Get additional data
            username, repo_name = repository.full_name.split('/')
            languages = await self.github_service.get_languages(username, repo_name)
            contributors = await self.github_service.get_contributors(username, repo_name)
            commits = await self.github_service.get_commits(username, repo_name)
            issues = await self.github_service.get_issues(username, repo_name)
            
            # Calculate scores
            technical_score = self._calculate_technical_score(repository, languages)
            quality_score = self._calculate_quality_score(repository, contributors, issues)
            activity_score = self._calculate_activity_score(repository, commits)
            overall_score = (technical_score + quality_score + activity_score) / 3
            
            # Generate insights
            insights = self._generate_insights(repository, languages, contributors, commits, issues)
            recommendations = self._generate_recommendations(repository, technical_score, quality_score, activity_score)
            
            return AnalysisResult(
                repository=repository,
                technical_score=technical_score,
                quality_score=quality_score,
                activity_score=activity_score,
                overall_score=overall_score,
                insights=insights,
                recommendations=recommendations,
                timestamp=datetime.now().isoformat()
            )
            
        except Exception as e:
            self.logger.error(f"Failed to analyze repository: {e}")
            raise
    
    async def analyze_batch(self, repositories: List[RepositoryData]) -> List[AnalysisResult]:
        """Analyze multiple repositories"""
        try:
            self.logger.info(f"Analyzing {len(repositories)} repositories")
            
            # Process repositories in parallel
            tasks = [self.analyze_repository(repo) for repo in repositories]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Filter out exceptions
            valid_results = []
            for result in results:
                if isinstance(result, Exception):
                    self.logger.error(f"Analysis failed: {result}")
                else:
                    valid_results.append(result)
            
            self.logger.info(f"Successfully analyzed {len(valid_results)} repositories")
            return valid_results
            
        except Exception as e:
            self.logger.error(f"Failed to analyze batch: {e}")
            raise
    
    async def get_analysis_metrics(self, repository: RepositoryData) -> Dict[str, Any]:
        """Get detailed analysis metrics"""
        try:
            username, repo_name = repository.full_name.split('/')
            languages = await self.github_service.get_languages(username, repo_name)
            contributors = await self.github_service.get_contributors(username, repo_name)
            commits = await self.github_service.get_commits(username, repo_name)
            issues = await self.github_service.get_issues(username, repo_name)
            
            return {
                "repository": {
                    "name": repository.name,
                    "full_name": repository.full_name,
                    "description": repository.description,
                    "language": repository.language,
                    "stars": repository.stars,
                    "forks": repository.forks,
                    "size": repository.size,
                    "topics": repository.topics
                },
                "languages": languages,
                "contributors": {
                    "count": len(contributors),
                    "top_contributors": contributors[:5]
                },
                "commits": {
                    "count": len(commits),
                    "recent_commits": commits[:10]
                },
                "issues": {
                    "total": len(issues),
                    "open": len([i for i in issues if i["state"] == "open"]),
                    "closed": len([i for i in issues if i["state"] == "closed"])
                },
                "metrics": {
                    "technical_score": self._calculate_technical_score(repository, languages),
                    "quality_score": self._calculate_quality_score(repository, contributors, issues),
                    "activity_score": self._calculate_activity_score(repository, commits)
                }
            }
            
        except Exception as e:
            self.logger.error(f"Failed to get analysis metrics: {e}")
            raise
    
    def _calculate_technical_score(self, repository: RepositoryData, languages: Dict[str, int]) -> float:
        """Calculate technical complexity score"""
        score = 5.0  # Base score
        
        # Language complexity
        if repository.language:
            language_complexity = self._get_language_complexity(repository.language)
            score += (language_complexity - 5) * 0.2
        
        # Repository size
        if repository.size > 10000:
            score += 1.0
        elif repository.size > 1000:
            score += 0.5
        
        # Language diversity
        if len(languages) > 3:
            score += 0.5
        
        # Topics complexity
        if repository.topics:
            complex_topics = ["ai", "ml", "blockchain", "quantum", "distributed"]
            if any(topic in repository.topics for topic in complex_topics):
                score += 1.0
        
        return max(1.0, min(10.0, score))
    
    def _calculate_quality_score(self, repository: RepositoryData, contributors: List[Dict], issues: List[Dict]) -> float:
        """Calculate code quality score"""
        score = 5.0  # Base score
        
        # Documentation
        if repository.description and len(repository.description) > 50:
            score += 1.0
        
        # Contributors
        if len(contributors) > 1:
            score += 1.0
        
        # Issue management
        if issues:
            open_issues = len([i for i in issues if i["state"] == "open"])
            if open_issues < 10:  # Low number of open issues
                score += 1.0
        
        # Repository activity
        if repository.stars > 10:
            score += 0.5
        if repository.forks > 5:
            score += 0.5
        
        return max(1.0, min(10.0, score))
    
    def _calculate_activity_score(self, repository: RepositoryData, commits: List[Dict]) -> float:
        """Calculate activity score"""
        score = 5.0  # Base score
        
        # Recent activity
        if commits:
            recent_commits = 0
            cutoff_date = datetime.now() - timedelta(days=90)
            
            for commit in commits:
                try:
                    commit_date = datetime.fromisoformat(commit["date"].replace('Z', '+00:00'))
                    if commit_date > cutoff_date:
                        recent_commits += 1
                except:
                    # Skip invalid dates
                    continue
            
            if recent_commits > 10:
                score += 2.0
            elif recent_commits > 5:
                score += 1.0
            elif recent_commits > 0:
                score += 0.5
        
        # Repository age
        try:
            created_date = datetime.fromisoformat(repository.created_at.replace('Z', '+00:00'))
            age_days = (datetime.now() - created_date).days
        except:
            age_days = 0
        
        if age_days > 365:  # More than a year old
            score += 0.5
        
        return max(1.0, min(10.0, score))
    
    def _get_language_complexity(self, language: str) -> float:
        """Get language complexity score"""
        complexity_map = {
            'Assembly': 10, 'C++': 9, 'C': 8, 'Rust': 8, 'Go': 7,
            'Java': 6, 'C#': 6, 'Python': 5, 'JavaScript': 4, 'TypeScript': 5,
            'PHP': 4, 'Ruby': 4, 'Swift': 6, 'Kotlin': 6, 'Scala': 7,
            'HTML': 2, 'CSS': 2, 'Markdown': 1, 'Shell': 3
        }
        return complexity_map.get(language, 5.0)
    
    def _generate_insights(self, repository: RepositoryData, languages: Dict, contributors: List, commits: List, issues: List) -> List[str]:
        """Generate insights about the repository"""
        insights = []
        
        # Language insights
        if repository.language:
            insights.append(f"Primary language: {repository.language}")
        
        if len(languages) > 1:
            insights.append(f"Multi-language project with {len(languages)} languages")
        
        # Activity insights
        if commits:
            try:
                recent_commits = len([c for c in commits if 
                                    datetime.fromisoformat(c["date"].replace('Z', '+00:00')) > 
                                    datetime.now() - timedelta(days=30)])
                if recent_commits > 0:
                    insights.append(f"Active development with {recent_commits} recent commits")
            except:
                # Skip if date parsing fails
                pass
        
        # Quality insights
        if repository.stars > 50:
            insights.append("High community interest")
        
        if len(contributors) > 1:
            insights.append("Collaborative development")
        
        # Topic insights
        if repository.topics:
            insights.append(f"Focused on: {', '.join(repository.topics[:3])}")
        
        return insights
    
    def _generate_recommendations(self, repository: RepositoryData, technical_score: float, quality_score: float, activity_score: float) -> List[str]:
        """Generate recommendations for improvement"""
        recommendations = []
        
        if quality_score < 7:
            recommendations.append("Improve documentation and README")
            recommendations.append("Add comprehensive testing")
        
        if activity_score < 6:
            recommendations.append("Maintain regular development activity")
            recommendations.append("Set up automated updates")
        
        if technical_score < 6:
            recommendations.append("Review code complexity")
            recommendations.append("Consider refactoring complex parts")
        
        if not repository.description:
            recommendations.append("Add a clear project description")
        
        if not repository.topics:
            recommendations.append("Add relevant topics to improve discoverability")
        
        return recommendations
