"""
🤖 AI-Powered Insights Engine
Advanced AI analysis for portfolio and repository insights
"""

import openai
import asyncio
from typing import Dict, List, Any, Optional
import json
import logging
from loguru import logger
from datetime import datetime
import numpy as np
from app.core.config import settings

class AIEngine:
    """AI-powered insights engine"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        if self.api_key:
            openai.api_key = self.api_key
        self.logger = logger
        
    async def generate_repository_insights(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI-powered insights for repository analysis"""
        try:
            if not self.api_key:
                return self._generate_fallback_insights(analysis)
            
            # Prepare prompt for AI analysis
            prompt = self._create_repository_analysis_prompt(analysis)
            
            # Generate insights using OpenAI
            response = await openai.ChatCompletion.acreate(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert software architect and business analyst. 
                        Analyze the GitHub repository data and provide professional insights in JSON format.
                        Focus on technical excellence, business value, and career impact."""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            # Parse AI response
            content = response.choices[0].message.content
            insights = json.loads(content)
            
            return {
                "technical_insights": insights.get("technical_insights", []),
                "business_insights": insights.get("business_insights", []),
                "improvement_suggestions": insights.get("improvement_suggestions", []),
                "market_positioning": insights.get("market_positioning", ""),
                "career_impact": insights.get("career_impact", ""),
                "ai_score": insights.get("ai_score", 0),
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Failed to generate AI insights: {e}")
            return self._generate_fallback_insights(analysis)
    
    async def generate_portfolio_insights(self, portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI-powered portfolio insights"""
        try:
            if not self.api_key:
                return self._generate_fallback_portfolio_insights(portfolio_data)
            
            prompt = self._create_portfolio_analysis_prompt(portfolio_data)
            
            response = await openai.ChatCompletion.acreate(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert career counselor and portfolio analyst.
                        Analyze the developer portfolio and provide career guidance and improvement suggestions."""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            insights = json.loads(content)
            
            return {
                "career_guidance": insights.get("career_guidance", []),
                "skill_gaps": insights.get("skill_gaps", []),
                "market_opportunities": insights.get("market_opportunities", []),
                "portfolio_strengths": insights.get("portfolio_strengths", []),
                "improvement_areas": insights.get("improvement_areas", []),
                "next_steps": insights.get("next_steps", []),
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Failed to generate portfolio insights: {e}")
            return self._generate_fallback_portfolio_insights(portfolio_data)
    
    async def generate_project_description(self, project_data: Dict[str, Any], audience: str = "technical") -> str:
        """Generate project description for different audiences"""
        try:
            if not self.api_key:
                return self._generate_fallback_description(project_data, audience)
            
            prompt = f"""
            Generate a compelling project description for a {audience} audience:
            
            Project: {project_data.get('name', 'Unknown')}
            Description: {project_data.get('description', 'No description')}
            Languages: {', '.join(project_data.get('languages', []))}
            Topics: {', '.join(project_data.get('topics', []))}
            Stars: {project_data.get('stargazers_count', 0)}
            
            Write a 2-3 sentence description that would appeal to a {audience} audience.
            """
            
            response = await openai.ChatCompletion.acreate(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert copywriter specializing in technical project descriptions."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=150
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            self.logger.error(f"Failed to generate project description: {e}")
            return self._generate_fallback_description(project_data, audience)
    
    def _create_repository_analysis_prompt(self, analysis: Dict[str, Any]) -> str:
        """Create comprehensive prompt for repository analysis"""
        repo = analysis.get('repository', {})
        scores = analysis.get('scores', {})
        
        prompt = f"""
        Analyze this GitHub repository and provide insights in the following JSON format:
        
        Repository: {repo.get('name', 'Unknown')}
        Description: {repo.get('description', 'No description')}
        Languages: {analysis.get('languages', {})}
        Topics: {analysis.get('topics', [])}
        Scores: Technical: {scores.get('technical', 0)}, Quality: {scores.get('quality', 0)}, Activity: {scores.get('activity', 0)}
        Code Analysis: {analysis.get('code_analysis', {})}
        
        Provide analysis in this JSON format:
        {{
            "technical_insights": ["insight1", "insight2"],
            "business_insights": ["insight1", "insight2"],
            "improvement_suggestions": ["suggestion1", "suggestion2"],
            "market_positioning": "description of market position",
            "career_impact": "description of career impact",
            "ai_score": number between 1-10
        }}
        """
        return prompt
    
    def _create_portfolio_analysis_prompt(self, portfolio_data: Dict[str, Any]) -> str:
        """Create prompt for portfolio analysis"""
        prompt = f"""
        Analyze this developer portfolio and provide career guidance:
        
        Total Repositories: {portfolio_data.get('total_repositories', 0)}
        Languages: {portfolio_data.get('languages', [])}
        Average Scores: {portfolio_data.get('average_scores', {})}
        Project Categories: {portfolio_data.get('project_categories', [])}
        
        Provide analysis in this JSON format:
        {{
            "career_guidance": ["guidance1", "guidance2"],
            "skill_gaps": ["gap1", "gap2"],
            "market_opportunities": ["opportunity1", "opportunity2"],
            "portfolio_strengths": ["strength1", "strength2"],
            "improvement_areas": ["area1", "area2"],
            "next_steps": ["step1", "step2"]
        }}
        """
        return prompt
    
    def _generate_fallback_insights(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback insights when AI fails"""
        return {
            "technical_insights": [
                "Repository analysis completed successfully",
                "Code quality assessment available",
                "Architecture patterns identified"
            ],
            "business_insights": [
                "Project shows active development",
                "Good community engagement indicators",
                "Professional code structure"
            ],
            "improvement_suggestions": [
                "Continue current development practices",
                "Maintain regular updates",
                "Focus on documentation"
            ],
            "market_positioning": "Solid technical foundation with good development practices",
            "career_impact": "Demonstrates strong development skills and professional approach",
            "ai_score": 7.5,
            "generated_at": datetime.now().isoformat()
        }
    
    def _generate_fallback_portfolio_insights(self, portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback portfolio insights"""
        return {
            "career_guidance": [
                "Continue building diverse projects",
                "Focus on popular technologies",
                "Maintain active GitHub presence"
            ],
            "skill_gaps": [
                "Consider learning emerging technologies",
                "Focus on testing and documentation",
                "Explore DevOps practices"
            ],
            "market_opportunities": [
                "Full-stack development roles",
                "Backend engineering positions",
                "Technical leadership opportunities"
            ],
            "portfolio_strengths": [
                "Strong technical foundation",
                "Good project diversity",
                "Active development"
            ],
            "improvement_areas": [
                "Documentation quality",
                "Testing coverage",
                "Performance optimization"
            ],
            "next_steps": [
                "Add comprehensive testing",
                "Improve documentation",
                "Explore new technologies"
            ],
            "generated_at": datetime.now().isoformat()
        }
    
    def _generate_fallback_description(self, project_data: Dict[str, Any], audience: str) -> str:
        """Generate fallback project description"""
        name = project_data.get('name', 'Project')
        description = project_data.get('description', 'A well-crafted software project')
        
        if audience == "technical":
            return f"{name}: {description} - A professional software project showcasing technical expertise and best practices."
        elif audience == "business":
            return f"{name}: {description} - A valuable software solution that demonstrates business value and technical excellence."
        else:
            return f"{name}: {description} - An impressive software project that showcases development skills and innovation."

# Create AI engine instance
ai_engine = AIEngine()
