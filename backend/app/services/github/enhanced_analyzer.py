"""
🚀 Enhanced GitHub Analyzer
Searches for similar repositories and applies best practices
"""

import asyncio
import aiohttp
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from loguru import logger
import re

from app.interfaces.github_interface import RepositoryData, AnalysisResult
from app.services.github.github_repository import GitHubRepositoryService
from app.services.github.repository_analyzer import RepositoryAnalyzerService

class EnhancedGitHubAnalyzer:
    """Enhanced analyzer that searches for similar repos and applies best practices"""
    
    def __init__(self, github_service: GitHubRepositoryService, analyzer_service: RepositoryAnalyzerService):
        self.github_service = github_service
        self.analyzer_service = analyzer_service
        self.logger = logger
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "AI-Portfolio-Backend/2.0.0"
        }
        
        # Load GitHub token from environment
        import os
        github_token = os.getenv('GITHUB_TOKEN')
        if github_token:
            self.headers["Authorization"] = f"token {github_token}"
    
    async def enhance_repository_analysis(self, repository: RepositoryData) -> Dict[str, Any]:
        """Enhanced analysis with similar repository search and best practices"""
        try:
            self.logger.info(f"🔍 Enhanced analysis for: {repository.full_name}")
            
            # Step 1: Basic analysis
            basic_analysis = await self.analyzer_service.analyze_repository(repository)
            
            # Step 2: Search for similar repositories
            similar_repos = await self._search_similar_repositories(repository)
            
            # Step 3: Analyze top-performing similar repositories
            top_repos_analysis = await self._analyze_top_repositories(similar_repos)
            
            # Step 4: Generate improvement recommendations
            improvements = await self._generate_improvement_recommendations(
                repository, basic_analysis, top_repos_analysis
            )
            
            # Step 5: Calculate enhanced scores
            enhanced_scores = await self._calculate_enhanced_scores(
                basic_analysis, top_repos_analysis, improvements
            )
            
            return {
                "repository": repository,
                "basic_analysis": basic_analysis,
                "similar_repositories": similar_repos,
                "top_repos_analysis": top_repos_analysis,
                "improvements": improvements,
                "enhanced_scores": enhanced_scores,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Enhanced analysis failed: {e}")
            raise
    
    async def _search_similar_repositories(self, repository: RepositoryData) -> List[Dict[str, Any]]:
        """Search for similar repositories based on topics, language, and description"""
        try:
            similar_repos = []
            
            # Search by language
            if repository.language:
                language_repos = await self._search_by_language(repository.language)
                similar_repos.extend(language_repos)
            
            # Search by topics
            if repository.topics:
                for topic in repository.topics[:3]:  # Top 3 topics
                    topic_repos = await self._search_by_topic(topic)
                    similar_repos.extend(topic_repos)
            
            # Search by description keywords
            if repository.description:
                keyword_repos = await self._search_by_keywords(repository.description)
                similar_repos.extend(keyword_repos)
            
            # Remove duplicates and sort by stars
            unique_repos = {}
            for repo in similar_repos:
                if repo['full_name'] not in unique_repos:
                    unique_repos[repo['full_name']] = repo
                elif repo['stargazers_count'] > unique_repos[repo['full_name']]['stargazers_count']:
                    unique_repos[repo['full_name']] = repo
            
            # Sort by stars and return top 20
            sorted_repos = sorted(unique_repos.values(), key=lambda x: x['stargazers_count'], reverse=True)
            return sorted_repos[:20]
            
        except Exception as e:
            self.logger.error(f"Similar repository search failed: {e}")
            return []
    
    async def _search_by_language(self, language: str) -> List[Dict[str, Any]]:
        """Search repositories by programming language"""
        try:
            query = f"language:{language} stars:>10"
            return await self._github_search(query, max_results=10)
        except Exception as e:
            self.logger.error(f"Language search failed: {e}")
            return []
    
    async def _search_by_topic(self, topic: str) -> List[Dict[str, Any]]:
        """Search repositories by topic"""
        try:
            query = f"topic:{topic} stars:>5"
            return await self._github_search(query, max_results=10)
        except Exception as e:
            self.logger.error(f"Topic search failed: {e}")
            return []
    
    async def _search_by_keywords(self, description: str) -> List[Dict[str, Any]]:
        """Search repositories by description keywords"""
        try:
            # Extract meaningful keywords from description
            keywords = self._extract_keywords(description)
            if not keywords:
                return []
            
            # Search with first few keywords
            query = " ".join(keywords[:3]) + " stars:>5"
            return await self._github_search(query, max_results=10)
        except Exception as e:
            self.logger.error(f"Keyword search failed: {e}")
            return []
    
    async def _github_search(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Perform GitHub API search"""
        try:
            url = f"{self.base_url}/search/repositories"
            params = {
                "q": query,
                "sort": "stars",
                "order": "desc",
                "per_page": min(max_results, 100)
            }
            
            async with aiohttp.ClientSession(headers=self.headers) as session:
                async with session.get(url, params=params) as response:
                    if response.status != 200:
                        self.logger.warning(f"GitHub search failed: {response.status}")
                        return []
                    
                    data = await response.json()
                    return data.get('items', [])
                    
        except Exception as e:
            self.logger.error(f"GitHub search error: {e}")
            return []
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract meaningful keywords from text"""
        if not text:
            return []
        
        # Remove common words and extract meaningful terms
        common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'}
        
        # Extract words (alphanumeric + some special chars)
        words = re.findall(r'\b[a-zA-Z0-9-]+\b', text.lower())
        
        # Filter out common words and short words
        keywords = [word for word in words if len(word) > 2 and word not in common_words]
        
        return keywords[:10]  # Return top 10 keywords
    
    async def _analyze_top_repositories(self, repositories: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze top-performing similar repositories"""
        try:
            if not repositories:
                return {}
            
            # Analyze top 5 repositories
            top_repos = repositories[:5]
            
            analysis = {
                "total_analyzed": len(top_repos),
                "average_stars": sum(repo['stargazers_count'] for repo in top_repos) / len(top_repos),
                "average_forks": sum(repo['forks_count'] for repo in top_repos) / len(top_repos),
                "common_languages": {},
                "common_topics": {},
                "best_practices": [],
                "readme_patterns": [],
                "file_structure_patterns": []
            }
            
            # Analyze languages
            for repo in top_repos:
                if repo.get('language'):
                    lang = repo['language']
                    analysis['common_languages'][lang] = analysis['common_languages'].get(lang, 0) + 1
            
            # Analyze topics
            for repo in top_repos:
                for topic in repo.get('topics', []):
                    analysis['common_topics'][topic] = analysis['common_topics'].get(topic, 0) + 1
            
            # Extract best practices
            analysis['best_practices'] = await self._extract_best_practices(top_repos)
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Top repositories analysis failed: {e}")
            return {}
    
    async def _extract_best_practices(self, repositories: List[Dict[str, Any]]) -> List[str]:
        """Extract best practices from top repositories"""
        practices = []
        
        for repo in repositories:
            # High stars and forks indicate good practices
            if repo['stargazers_count'] > 100:
                practices.append("High community engagement (100+ stars)")
            
            if repo['forks_count'] > 50:
                practices.append("Active community contribution (50+ forks)")
            
            # Good description
            if repo.get('description') and len(repo['description']) > 50:
                practices.append("Comprehensive project description")
            
            # Multiple topics
            if len(repo.get('topics', [])) > 3:
                practices.append("Well-categorized with multiple topics")
            
            # Recent activity
            updated_at = datetime.fromisoformat(repo['updated_at'].replace('Z', '+00:00'))
            if (datetime.now() - updated_at).days < 30:
                practices.append("Recent development activity")
        
        # Remove duplicates and return unique practices
        return list(set(practices))
    
    async def _generate_improvement_recommendations(
        self, 
        repository: RepositoryData, 
        basic_analysis: AnalysisResult, 
        top_repos_analysis: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate specific improvement recommendations"""
        recommendations = []
        
        # Compare with top repositories
        if top_repos_analysis:
            avg_stars = top_repos_analysis.get('average_stars', 0)
            avg_forks = top_repos_analysis.get('average_forks', 0)
            
            if repository.stars < avg_stars * 0.1:  # Less than 10% of average
                recommendations.append({
                    "category": "Community Engagement",
                    "title": "Increase Repository Visibility",
                    "description": f"Your repository has {repository.stars} stars, while similar top repositories average {avg_stars:.0f} stars. Focus on promoting your project.",
                    "priority": "high",
                    "action_items": [
                        "Add comprehensive README with screenshots",
                        "Create demo videos or live examples",
                        "Share on social media and developer communities",
                        "Write blog posts about your project"
                    ]
                })
            
            if repository.forks < avg_forks * 0.1:
                recommendations.append({
                    "category": "Community Contribution",
                    "title": "Encourage Community Contributions",
                    "description": f"Your repository has {repository.forks} forks, while similar repositories average {avg_forks:.0f} forks. Make it easier for others to contribute.",
                    "priority": "medium",
                    "action_items": [
                        "Add CONTRIBUTING.md file",
                        "Create good first issue labels",
                        "Add code of conduct",
                        "Set up issue templates"
                    ]
                })
        
        # Language-specific recommendations
        if repository.language:
            common_langs = top_repos_analysis.get('common_languages', {})
            if repository.language in common_langs:
                lang_count = common_langs[repository.language]
                if lang_count >= 3:  # Popular language in similar repos
                    recommendations.append({
                        "category": "Technology Stack",
                        "title": f"Leverage {repository.language} Best Practices",
                        "description": f"{repository.language} is used in {lang_count} of the top similar repositories. Ensure you're following {repository.language} best practices.",
                        "priority": "medium",
                        "action_items": [
                            f"Follow {repository.language} style guides",
                            "Add proper linting and formatting",
                            "Use modern {repository.language} features",
                            "Add comprehensive tests"
                        ]
                    })
        
        # Topic recommendations
        if repository.topics:
            common_topics = top_repos_analysis.get('common_topics', {})
            missing_topics = []
            for topic, count in common_topics.items():
                if topic not in repository.topics and count >= 2:
                    missing_topics.append(topic)
            
            if missing_topics:
                recommendations.append({
                    "category": "Repository Organization",
                    "title": "Add Relevant Topics",
                    "description": f"Consider adding these popular topics: {', '.join(missing_topics[:5])}",
                    "priority": "low",
                    "action_items": [
                        "Add relevant topics to improve discoverability",
                        "Research what topics similar repositories use",
                        "Keep topics updated as project evolves"
                    ]
                })
        
        # Quality improvements based on analysis
        if basic_analysis.quality_score < 7:
            recommendations.append({
                "category": "Code Quality",
                "title": "Improve Code Quality",
                "description": f"Your quality score is {basic_analysis.quality_score:.1f}/10. Focus on improving code quality.",
                "priority": "high",
                "action_items": [
                    "Add comprehensive documentation",
                    "Write unit tests",
                    "Improve code comments",
                    "Follow consistent coding standards"
                ]
            })
        
        if basic_analysis.activity_score < 6:
            recommendations.append({
                "category": "Development Activity",
                "title": "Increase Development Activity",
                "description": f"Your activity score is {basic_analysis.activity_score:.1f}/10. Regular commits improve project credibility.",
                "priority": "medium",
                "action_items": [
                    "Make regular commits",
                    "Respond to issues and PRs",
                    "Update dependencies regularly",
                    "Add new features or improvements"
                ]
            })
        
        return recommendations
    
    async def _calculate_enhanced_scores(
        self, 
        basic_analysis: AnalysisResult, 
        top_repos_analysis: Dict[str, Any], 
        improvements: List[Dict[str, Any]]
    ) -> Dict[str, float]:
        """Calculate enhanced scores based on comparison with top repositories"""
        enhanced_scores = {
            "technical_score": basic_analysis.technical_score,
            "quality_score": basic_analysis.quality_score,
            "activity_score": basic_analysis.activity_score,
            "overall_score": basic_analysis.overall_score,
            "market_position_score": 5.0,  # Default
            "improvement_potential_score": 5.0  # Default
        }
        
        # Calculate market position score
        if top_repos_analysis:
            avg_stars = top_repos_analysis.get('average_stars', 0)
            avg_forks = top_repos_analysis.get('average_forks', 0)
            
            if avg_stars > 0:
                star_ratio = basic_analysis.repository.stars / avg_stars
                enhanced_scores["market_position_score"] = min(10.0, star_ratio * 10)
            
            if avg_forks > 0:
                fork_ratio = basic_analysis.repository.forks / avg_forks
                enhanced_scores["market_position_score"] = (enhanced_scores["market_position_score"] + min(10.0, fork_ratio * 10)) / 2
        
        # Calculate improvement potential score
        high_priority_improvements = len([r for r in improvements if r.get('priority') == 'high'])
        medium_priority_improvements = len([r for r in improvements if r.get('priority') == 'medium'])
        
        # More improvements = higher potential
        improvement_potential = (high_priority_improvements * 2 + medium_priority_improvements) / 10
        enhanced_scores["improvement_potential_score"] = min(10.0, 5.0 + improvement_potential)
        
        # Recalculate overall score
        enhanced_scores["overall_score"] = (
            enhanced_scores["technical_score"] + 
            enhanced_scores["quality_score"] + 
            enhanced_scores["activity_score"] + 
            enhanced_scores["market_position_score"] + 
            enhanced_scores["improvement_potential_score"]
        ) / 5
        
        return enhanced_scores
