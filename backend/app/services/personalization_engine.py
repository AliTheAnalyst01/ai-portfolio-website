"""
🎯 Personalization Engine
Creates personalized content based on visitor type
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from loguru import logger

from app.models.visitor import Visitor, AgentActivity, PersonalizedContent
from app.services.ai.ai_engine import AIEngineService

class PersonalizationEngine:
    """Engine for creating personalized content based on visitor type"""
    
    def __init__(self, ai_engine: AIEngineService):
        self.ai_engine = ai_engine
        self.logger = logger
        
        # Visitor type configurations
        self.visitor_configs = {
            "business": {
                "focus": "ROI, business value, market impact, scalability",
                "language": "business-focused, results-oriented",
                "metrics": ["business_value", "market_potential", "scalability", "cost_effectiveness"],
                "tone": "professional, executive-level"
            },
            "hr": {
                "focus": "skills, experience, team collaboration, cultural fit",
                "language": "HR-focused, skill assessment",
                "metrics": ["technical_skills", "collaboration", "communication", "leadership"],
                "tone": "professional, assessment-oriented"
            },
            "technical": {
                "focus": "code quality, architecture, technical complexity, best practices",
                "language": "technical, detailed, code-focused",
                "metrics": ["code_quality", "architecture", "performance", "security"],
                "tone": "technical, detailed"
            },
            "general": {
                "focus": "overview, impact, user experience, accessibility",
                "language": "accessible, user-friendly",
                "metrics": ["user_experience", "accessibility", "impact", "innovation"],
                "tone": "friendly, accessible"
            }
        }
    
    async def generate_personalized_repository_content(
        self, 
        repository: Dict[str, Any], 
        visitor_type: str,
        analysis: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate personalized content for a repository based on visitor type"""
        try:
            self.logger.info(f"Generating personalized content for {repository['name']} for {visitor_type} visitor")
            
            config = self.visitor_configs.get(visitor_type, self.visitor_configs["general"])
            
            # Generate personalized description
            description = await self._generate_personalized_description(repository, config)
            
            # Generate personalized analysis
            personalized_analysis = await self._generate_personalized_analysis(repository, analysis, config)
            
            # Generate personalized recommendations
            recommendations = await self._generate_personalized_recommendations(repository, analysis, config)
            
            # Generate key highlights
            highlights = await self._generate_key_highlights(repository, analysis, config)
            
            return {
                "repository": repository,
                "visitor_type": visitor_type,
                "personalized_description": description,
                "personalized_analysis": personalized_analysis,
                "personalized_recommendations": recommendations,
                "key_highlights": highlights,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Personalized content generation failed: {e}")
            return self._get_fallback_content(repository, visitor_type)
    
    async def _generate_personalized_description(self, repository: Dict[str, Any], config: Dict[str, Any]) -> str:
        """Generate personalized repository description"""
        try:
            prompt = f"""
            Create a {config['tone']} description for this repository that focuses on {config['focus']}:
            
            Repository: {repository['name']}
            Description: {repository.get('description', 'No description available')}
            Language: {repository.get('language', 'Unknown')}
            Stars: {repository.get('stars', 0)}
            Forks: {repository.get('forks', 0)}
            Topics: {', '.join(repository.get('topics', []))}
            
            Write a compelling description in {config['language']} style that highlights:
            - {config['focus']}
            - Key value propositions
            - Technical achievements
            - Business impact
            
            Keep it concise but engaging (2-3 sentences).
            """
            
            response = await self.ai_engine.analyze_text(prompt, "description_generation")
            return response.get('summary', repository.get('description', 'A professional software project'))
            
        except Exception as e:
            self.logger.error(f"Description generation failed: {e}")
            return repository.get('description', 'A professional software project')
    
    async def _generate_personalized_analysis(self, repository: Dict[str, Any], analysis: Optional[Dict[str, Any]], config: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized analysis based on visitor type"""
        if not analysis:
            return {"message": "Analysis not available"}
        
        try:
            prompt = f"""
            Analyze this repository from a {config['tone']} perspective focusing on {config['focus']}:
            
            Repository: {repository['name']}
            Technical Score: {analysis.get('technical_score', 0)}
            Quality Score: {analysis.get('quality_score', 0)}
            Activity Score: {analysis.get('activity_score', 0)}
            Overall Score: {analysis.get('overall_score', 0)}
            
            Provide analysis in JSON format with:
            - strengths: array of key strengths
            - areas_for_improvement: array of improvement areas
            - business_impact: assessment of business value
            - technical_excellence: assessment of technical quality
            - recommendation: overall recommendation
            
            Focus on {config['focus']} and use {config['language']} language.
            """
            
            response = await self.ai_engine.analyze_text(prompt, "analysis_generation")
            
            return {
                "strengths": response.get('key_points', [])[:3],
                "areas_for_improvement": response.get('key_points', [])[3:6] if len(response.get('key_points', [])) > 3 else [],
                "business_impact": response.get('summary', 'Good technical implementation'),
                "technical_excellence": f"Score: {analysis.get('overall_score', 0):.1f}/10",
                "recommendation": response.get('summary', 'Continue development')
            }
            
        except Exception as e:
            self.logger.error(f"Analysis generation failed: {e}")
            return {"message": "Analysis generation failed"}
    
    async def _generate_personalized_recommendations(self, repository: Dict[str, Any], analysis: Optional[Dict[str, Any]], config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate personalized recommendations"""
        try:
            prompt = f"""
            Generate {config['tone']} recommendations for this repository focusing on {config['focus']}:
            
            Repository: {repository['name']}
            Language: {repository.get('language', 'Unknown')}
            Stars: {repository.get('stars', 0)}
            Forks: {repository.get('forks', 0)}
            
            Provide 3-5 actionable recommendations in JSON format:
            [
                {{
                    "title": "recommendation title",
                    "description": "detailed description",
                    "priority": "high/medium/low",
                    "category": "category name",
                    "impact": "expected impact"
                }}
            ]
            
            Focus on {config['focus']} and use {config['language']} language.
            """
            
            response = await self.ai_engine.analyze_text(prompt, "recommendations_generation")
            
            # Parse recommendations from response
            recommendations = []
            if isinstance(response, dict) and 'key_points' in response:
                for i, point in enumerate(response['key_points'][:5]):
                    recommendations.append({
                        "title": f"Recommendation {i+1}",
                        "description": point,
                        "priority": "medium",
                        "category": config['focus'].split(',')[0],
                        "impact": "Positive"
                    })
            
            return recommendations
            
        except Exception as e:
            self.logger.error(f"Recommendations generation failed: {e}")
            return []
    
    async def _generate_key_highlights(self, repository: Dict[str, Any], analysis: Optional[Dict[str, Any]], config: Dict[str, Any]) -> List[str]:
        """Generate key highlights based on visitor type"""
        highlights = []
        
        # Technical highlights
        if repository.get('language'):
            highlights.append(f"Built with {repository['language']}")
        
        if repository.get('stars', 0) > 0:
            highlights.append(f"{repository['stars']} GitHub stars")
        
        if repository.get('forks', 0) > 0:
            highlights.append(f"{repository['forks']} community forks")
        
        # Analysis-based highlights
        if analysis:
            if analysis.get('technical_score', 0) >= 7:
                highlights.append("High technical quality")
            if analysis.get('quality_score', 0) >= 7:
                highlights.append("Excellent code quality")
            if analysis.get('activity_score', 0) >= 6:
                highlights.append("Active development")
        
        # Visitor-type specific highlights
        if config['focus'] == "ROI, business value, market impact, scalability":
            highlights.extend([
                "Production-ready solution",
                "Scalable architecture",
                "Business value focused"
            ])
        elif config['focus'] == "skills, experience, team collaboration, cultural fit":
            highlights.extend([
                "Team collaboration skills",
                "Professional development",
                "Code quality standards"
            ])
        elif config['focus'] == "code quality, architecture, technical complexity, best practices":
            highlights.extend([
                "Modern architecture",
                "Best practices implementation",
                "Technical excellence"
            ])
        else:  # general
            highlights.extend([
                "User-friendly design",
                "Innovative approach",
                "Community impact"
            ])
        
        return highlights[:6]  # Return top 6 highlights
    
    def _get_fallback_content(self, repository: Dict[str, Any], visitor_type: str) -> Dict[str, Any]:
        """Fallback content when AI generation fails"""
        return {
            "repository": repository,
            "visitor_type": visitor_type,
            "personalized_description": repository.get('description', 'A professional software project'),
            "personalized_analysis": {"message": "Analysis not available"},
            "personalized_recommendations": [],
            "key_highlights": [
                f"Built with {repository.get('language', 'modern technologies')}",
                f"{repository.get('stars', 0)} GitHub stars",
                "Professional development"
            ],
            "generated_at": datetime.now().isoformat()
        }
    
    def get_visitor_type_config(self, visitor_type: str) -> Dict[str, Any]:
        """Get configuration for visitor type"""
        return self.visitor_configs.get(visitor_type, self.visitor_configs["general"])
    
    def get_visitor_types(self) -> List[Dict[str, str]]:
        """Get available visitor types"""
        return [
            {"key": "business", "label": "Business Professional", "icon": "💼", "description": "Focus on ROI, business value, and market impact"},
            {"key": "hr", "label": "HR Professional", "icon": "👥", "description": "Focus on skills, experience, and team collaboration"},
            {"key": "technical", "label": "Technical Professional", "icon": "⚙️", "description": "Focus on code quality, architecture, and best practices"},
            {"key": "general", "label": "General Visitor", "icon": "👋", "description": "Focus on overview, impact, and user experience"}
        ]
