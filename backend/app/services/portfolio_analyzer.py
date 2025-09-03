"""
📊 Portfolio Analysis Engine
Comprehensive portfolio analysis and insights generation
"""

import asyncio
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging
from loguru import logger
from app.services.github_analyzer import github_analyzer
from app.services.ai_engine import ai_engine

class PortfolioAnalyzer:
    """Portfolio analysis engine"""
    
    def __init__(self):
        self.logger = logger
        self.cache = {}
        
    async def analyze_portfolio(self, username: str, max_repos: int = 50) -> Dict[str, Any]:
        """Analyze complete portfolio"""
        try:
            self.logger.info(f"🚀 Starting portfolio analysis for {username}")
            
            # Get user repositories
            repositories = await self._get_user_repositories(username, max_repos)
            
            # Analyze each repository
            analyses = []
            for repo in repositories:
                try:
                    analysis = await github_analyzer.analyze_repository(username, repo['name'])
                    analyses.append(analysis)
                except Exception as e:
                    self.logger.error(f"Failed to analyze {repo['name']}: {e}")
                    continue
            
            # Generate portfolio insights
            portfolio_data = self._process_portfolio_data(analyses)
            ai_insights = await ai_engine.generate_portfolio_insights(portfolio_data)
            
            # Combine results
            portfolio_analysis = {
                "username": username,
                "analysis_date": datetime.now().isoformat(),
                "total_repositories": len(repositories),
                "analyzed_repositories": len(analyses),
                "portfolio_data": portfolio_data,
                "ai_insights": ai_insights,
                "recommendations": self._generate_portfolio_recommendations(portfolio_data),
                "market_position": self._assess_market_position(portfolio_data),
                "career_guidance": self._generate_career_guidance(portfolio_data)
            }
            
            self.logger.info(f"✅ Portfolio analysis completed for {username}")
            return portfolio_analysis
            
        except Exception as e:
            self.logger.error(f"❌ Portfolio analysis failed for {username}: {e}")
            raise
    
    async def _get_user_repositories(self, username: str, max_repos: int) -> List[Dict[str, Any]]:
        """Get user repositories from GitHub"""
        try:
            # This would use the GitHub API to get repositories
            # For now, return mock data
            return [
                {"name": "portfolio-backend", "description": "AI-powered portfolio backend"},
                {"name": "data-analysis-tool", "description": "Advanced data analysis tool"},
                {"name": "web-app", "description": "Modern web application"}
            ][:max_repos]
        except Exception as e:
            self.logger.error(f"Failed to get repositories: {e}")
            return []
    
    def _process_portfolio_data(self, analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Process portfolio data and calculate metrics"""
        try:
            if not analyses:
                return {}
            
            # Extract key metrics
            languages = {}
            topics = []
            scores = []
            project_categories = []
            
            for analysis in analyses:
                # Languages
                repo_languages = analysis.get('languages', {})
                for lang, bytes_count in repo_languages.items():
                    if lang not in languages:
                        languages[lang] = 0
                    languages[lang] += bytes_count
                
                # Topics
                repo_topics = analysis.get('topics', [])
                topics.extend(repo_topics)
                
                # Scores
                repo_scores = analysis.get('scores', {})
                if repo_scores:
                    scores.append(repo_scores)
                
                # Categories
                category = self._categorize_project(analysis)
                project_categories.append(category)
            
            # Calculate portfolio metrics
            portfolio_data = {
                "languages": self._rank_languages(languages),
                "topics": self._get_top_topics(topics),
                "average_scores": self._calculate_average_scores(scores),
                "project_categories": self._count_categories(project_categories),
                "total_projects": len(analyses),
                "active_projects": len([a for a in analyses if a.get('scores', {}).get('activity', 0) > 5]),
                "high_quality_projects": len([a for a in analyses if a.get('scores', {}).get('quality', 0) > 7])
            }
            
            return portfolio_data
            
        except Exception as e:
            self.logger.error(f"Failed to process portfolio data: {e}")
            return {}
    
    def _rank_languages(self, languages: Dict[str, int]) -> List[Dict[str, Any]]:
        """Rank languages by usage"""
        try:
            total_bytes = sum(languages.values())
            if total_bytes == 0:
                return []
            
            ranked = []
            for lang, bytes_count in languages.items():
                percentage = (bytes_count / total_bytes) * 100
                ranked.append({
                    "language": lang,
                    "bytes": bytes_count,
                    "percentage": round(percentage, 2),
                    "rank": 0
                })
            
            # Sort by bytes and add rank
            ranked.sort(key=lambda x: x['bytes'], reverse=True)
            for i, lang in enumerate(ranked):
                lang['rank'] = i + 1
            
            return ranked[:10]  # Top 10 languages
            
        except Exception as e:
            self.logger.error(f"Failed to rank languages: {e}")
            return []
    
    def _get_top_topics(self, topics: List[str]) -> List[Dict[str, Any]]:
        """Get top topics"""
        try:
            topic_counts = {}
            for topic in topics:
                topic_counts[topic] = topic_counts.get(topic, 0) + 1
            
            ranked_topics = [
                {"topic": topic, "count": count}
                for topic, count in topic_counts.items()
            ]
            ranked_topics.sort(key=lambda x: x['count'], reverse=True)
            
            return ranked_topics[:15]  # Top 15 topics
            
        except Exception as e:
            self.logger.error(f"Failed to get top topics: {e}")
            return []
    
    def _calculate_average_scores(self, scores: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate average scores across projects"""
        try:
            if not scores:
                return {}
            
            avg_scores = {}
            score_keys = ['technical', 'quality', 'activity', 'overall']
            
            for key in score_keys:
                values = [s.get(key, 0) for s in scores if s.get(key) is not None]
                if values:
                    avg_scores[key] = round(np.mean(values), 2)
                else:
                    avg_scores[key] = 0.0
            
            return avg_scores
            
        except Exception as e:
            self.logger.error(f"Failed to calculate average scores: {e}")
            return {}
    
    def _categorize_project(self, analysis: Dict[str, Any]) -> str:
        """Categorize project based on analysis"""
        try:
            topics = analysis.get('topics', [])
            languages = analysis.get('languages', {})
            
            # Define categories
            categories = {
                'web-development': ['web', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular'],
                'mobile-development': ['mobile', 'ios', 'android', 'react-native', 'flutter'],
                'ai-ml': ['ai', 'ml', 'machine-learning', 'deep-learning', 'nlp', 'computer-vision'],
                'data-science': ['data', 'analytics', 'visualization', 'pandas', 'numpy', 'matplotlib'],
                'devops': ['devops', 'docker', 'kubernetes', 'ci-cd', 'aws', 'azure'],
                'backend': ['api', 'server', 'database', 'postgresql', 'mongodb', 'redis'],
                'frontend': ['ui', 'ux', 'design', 'css', 'html', 'javascript'],
                'game-development': ['game', 'unity', 'unreal', 'gaming'],
                'blockchain': ['blockchain', 'crypto', 'web3', 'solidity'],
                'other': []
            }
            
            # Check topics first
            for category, keywords in categories.items():
                if any(keyword in topics for keyword in keywords):
                    return category
            
            # Check languages
            for category, keywords in categories.items():
                if any(keyword in languages for keyword in keywords):
                    return category
            
            return 'other'
            
        except Exception as e:
            self.logger.error(f"Failed to categorize project: {e}")
            return 'other'
    
    def _count_categories(self, categories: List[str]) -> Dict[str, int]:
        """Count projects by category"""
        try:
            category_counts = {}
            for category in categories:
                category_counts[category] = category_counts.get(category, 0) + 1
            
            return category_counts
            
        except Exception as e:
            self.logger.error(f"Failed to count categories: {e}")
            return {}
    
    def _generate_portfolio_recommendations(self, portfolio_data: Dict[str, Any]) -> List[str]:
        """Generate portfolio recommendations"""
        recommendations = []
        
        try:
            avg_scores = portfolio_data.get('average_scores', {})
            languages = portfolio_data.get('languages', [])
            categories = portfolio_data.get('project_categories', {})
            
            # Score-based recommendations
            if avg_scores.get('quality', 0) < 7:
                recommendations.append("Focus on improving code quality and documentation")
            
            if avg_scores.get('activity', 0) < 6:
                recommendations.append("Maintain more active development on projects")
            
            # Language-based recommendations
            if len(languages) > 8:
                recommendations.append("Consider focusing on fewer core technologies for depth")
            elif len(languages) < 3:
                recommendations.append("Explore more programming languages for versatility")
            
            # Category-based recommendations
            if 'ai-ml' not in categories:
                recommendations.append("Consider adding AI/ML projects to stay current")
            
            if 'devops' not in categories:
                recommendations.append("Add DevOps projects to show deployment skills")
            
            # General recommendations
            recommendations.extend([
                "Regularly update project documentation",
                "Add comprehensive testing to projects",
                "Showcase problem-solving approaches",
                "Highlight business value of projects"
            ])
            
        except Exception as e:
            self.logger.error(f"Failed to generate recommendations: {e}")
            recommendations = ["Continue building and improving projects"]
        
        return recommendations
    
    def _assess_market_position(self, portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Assess market position and opportunities"""
        try:
            avg_scores = portfolio_data.get('average_scores', {})
            languages = portfolio_data.get('languages', [])
            categories = portfolio_data.get('project_categories', {})
            
            # Market demand analysis
            high_demand_languages = ['python', 'javascript', 'typescript', 'go', 'rust']
            emerging_technologies = ['ai-ml', 'blockchain', 'devops', 'cloud']
            
            market_score = 0
            market_insights = []
            
            # Language demand
            for lang in languages[:5]:  # Top 5 languages
                if lang['language'].lower() in high_demand_languages:
                    market_score += 2
                    market_insights.append(f"Strong demand for {lang['language']}")
            
            # Technology trends
            for tech in emerging_technologies:
                if tech in categories:
                    market_score += 1
                    market_insights.append(f"Trending technology: {tech}")
            
            # Overall assessment
            if market_score >= 6:
                market_position = "High Market Demand"
            elif market_score >= 4:
                market_position = "Good Market Position"
            else:
                market_position = "Growing Market Presence"
            
            return {
                "position": market_position,
                "score": min(10, market_score),
                "insights": market_insights,
                "opportunities": self._identify_market_opportunities(portfolio_data)
            }
            
        except Exception as e:
            self.logger.error(f"Failed to assess market position: {e}")
            return {"position": "Unknown", "score": 0, "insights": [], "opportunities": []}
    
    def _identify_market_opportunities(self, portfolio_data: Dict[str, Any]) -> List[str]:
        """Identify market opportunities"""
        opportunities = []
        
        try:
            categories = portfolio_data.get('project_categories', {})
            languages = portfolio_data.get('languages', [])
            
            # Technology opportunities
            if 'ai-ml' not in categories:
                opportunities.append("AI/ML Engineering roles")
            
            if 'devops' not in categories:
                opportunities.append("DevOps Engineering positions")
            
            if 'backend' not in categories:
                opportunities.append("Backend Development roles")
            
            # Language opportunities
            top_languages = [lang['language'].lower() for lang in languages[:3]]
            
            if 'python' in top_languages:
                opportunities.append("Python-focused roles")
            
            if 'javascript' in top_languages:
                opportunities.append("Full-stack development")
            
            if 'go' in top_languages or 'rust' in top_languages:
                opportunities.append("Systems programming roles")
            
            # General opportunities
            opportunities.extend([
                "Software Engineering positions",
                "Technical Leadership roles",
                "Startup technical roles",
                "Open source contributions"
            ])
            
        except Exception as e:
            self.logger.error(f"Failed to identify opportunities: {e}")
            opportunities = ["Software development roles"]
        
        return opportunities
    
    def _generate_career_guidance(self, portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate career guidance"""
        try:
            avg_scores = portfolio_data.get('average_scores', {})
            categories = portfolio_data.get('project_categories', {})
            
            guidance = {
                "short_term": [],
                "medium_term": [],
                "long_term": [],
                "skill_development": [],
                "networking": []
            }
            
            # Short-term goals (3-6 months)
            if avg_scores.get('quality', 0) < 7:
                guidance["short_term"].append("Improve code quality and testing")
            
            if len(categories) < 4:
                guidance["short_term"].append("Diversify project types")
            
            guidance["short_term"].extend([
                "Update project documentation",
                "Add performance metrics to projects"
            ])
            
            # Medium-term goals (6-12 months)
            guidance["medium_term"].extend([
                "Build a flagship project",
                "Contribute to open source",
                "Learn emerging technologies",
                "Create technical blog content"
            ])
            
            # Long-term goals (1-2 years)
            guidance["long_term"].extend([
                "Establish technical leadership",
                "Build industry connections",
                "Consider specialization areas",
                "Explore entrepreneurship"
            ])
            
            # Skill development
            guidance["skill_development"].extend([
                "Advanced testing strategies",
                "Performance optimization",
                "System design principles",
                "Cloud architecture"
            ])
            
            # Networking
            guidance["networking"].extend([
                "Attend tech conferences",
                "Join developer communities",
                "Participate in hackathons",
                "Connect with industry leaders"
            ])
            
            return guidance
            
        except Exception as e:
            self.logger.error(f"Failed to generate career guidance: {e}")
            return {
                "short_term": ["Continue learning and building"],
                "medium_term": ["Focus on skill development"],
                "long_term": ["Build industry presence"],
                "skill_development": ["Learn new technologies"],
                "networking": ["Connect with developers"]
            }

# Create portfolio analyzer instance
portfolio_analyzer = PortfolioAnalyzer()
