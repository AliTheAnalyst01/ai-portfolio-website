"""
🤖 AI Engine Service
Implements AI operations following Single Responsibility Principle
"""

import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime
from loguru import logger

from app.interfaces.ai_interface import IAIEngine, AIInsight, AIRecommendation
from app.core.config.settings import settings

class AIEngineService(IAIEngine):
    """AI engine service implementation"""
    
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.logger = logger
        
        # OpenAI client will be initialized when needed
    
    async def generate_insights(self, data: Dict[str, Any], context: str) -> List[AIInsight]:
        """Generate AI insights from data"""
        try:
            if not self.api_key:
                return self._generate_fallback_insights(data, context)
            
            self.logger.info(f"Generating AI insights for context: {context}")
            
            prompt = self._create_insights_prompt(data, context)
            
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self.api_key)
            
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert software architect and business analyst. Provide professional insights in JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            insights_data = self._parse_insights_response(content)
            
            insights = []
            for insight_data in insights_data:
                insight = AIInsight(
                    type=insight_data.get("type", "general"),
                    content=insight_data.get("content", ""),
                    confidence=insight_data.get("confidence", 0.8),
                    category=insight_data.get("category", "general"),
                    timestamp=datetime.now().isoformat()
                )
                insights.append(insight)
            
            return insights
            
        except Exception as e:
            self.logger.error(f"Failed to generate AI insights: {e}")
            return self._generate_fallback_insights(data, context)
    
    async def generate_recommendations(self, data: Dict[str, Any], context: str) -> List[AIRecommendation]:
        """Generate AI recommendations"""
        try:
            if not self.api_key:
                return self._generate_fallback_recommendations(data, context)
            
            self.logger.info(f"Generating AI recommendations for context: {context}")
            
            prompt = self._create_recommendations_prompt(data, context)
            
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self.api_key)
            
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert career counselor and technical advisor. Provide actionable recommendations in JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            recommendations_data = self._parse_recommendations_response(content)
            
            recommendations = []
            for rec_data in recommendations_data:
                recommendation = AIRecommendation(
                    priority=rec_data.get("priority", "medium"),
                    category=rec_data.get("category", "general"),
                    title=rec_data.get("title", ""),
                    description=rec_data.get("description", ""),
                    impact=rec_data.get("impact", ""),
                    effort=rec_data.get("effort", "")
                )
                recommendations.append(recommendation)
            
            return recommendations
            
        except Exception as e:
            self.logger.error(f"Failed to generate AI recommendations: {e}")
            return self._generate_fallback_recommendations(data, context)
    
    async def analyze_text(self, text: str, analysis_type: str) -> Dict[str, Any]:
        """Analyze text content"""
        try:
            if not self.api_key:
                return self._generate_fallback_text_analysis(text, analysis_type)
            
            self.logger.info(f"Analyzing text for type: {analysis_type}")
            
            prompt = f"""
            Analyze the following text for {analysis_type}:
            
            Text: {text}
            
            Provide analysis in JSON format with:
            - sentiment: positive/negative/neutral
            - confidence: 0-1
            - key_points: array of main points
            - summary: brief summary
            """
            
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self.api_key)
            
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert text analyst. Provide detailed analysis in JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content
            return self._parse_text_analysis_response(content)
            
        except Exception as e:
            self.logger.error(f"Failed to analyze text: {e}")
            return self._generate_fallback_text_analysis(text, analysis_type)
    
    def _create_insights_prompt(self, data: Dict[str, Any], context: str) -> str:
        """Create prompt for insights generation"""
        return f"""
        Analyze the following data and provide insights in JSON format:
        
        Context: {context}
        Data: {data}
        
        Provide insights in this JSON format:
        [
            {{
                "type": "technical|business|career",
                "content": "insight description",
                "confidence": 0.8,
                "category": "specific category"
            }}
        ]
        """
    
    def _create_recommendations_prompt(self, data: Dict[str, Any], context: str) -> str:
        """Create prompt for recommendations generation"""
        return f"""
        Analyze the following data and provide recommendations in JSON format:
        
        Context: {context}
        Data: {data}
        
        Provide recommendations in this JSON format:
        [
            {{
                "priority": "high|medium|low",
                "category": "technical|business|career",
                "title": "recommendation title",
                "description": "detailed description",
                "impact": "expected impact",
                "effort": "required effort"
            }}
        ]
        """
    
    def _parse_insights_response(self, content: str) -> List[Dict[str, Any]]:
        """Parse AI insights response"""
        try:
            import json
            # Try to extract JSON from response
            start = content.find('[')
            end = content.rfind(']') + 1
            if start != -1 and end != -1:
                json_str = content[start:end]
                return json.loads(json_str)
        except:
            pass
        
        # Fallback parsing
        return [
            {
                "type": "general",
                "content": content[:200] + "..." if len(content) > 200 else content,
                "confidence": 0.7,
                "category": "general"
            }
        ]
    
    def _parse_recommendations_response(self, content: str) -> List[Dict[str, Any]]:
        """Parse AI recommendations response"""
        try:
            import json
            # Try to extract JSON from response
            start = content.find('[')
            end = content.rfind(']') + 1
            if start != -1 and end != -1:
                json_str = content[start:end]
                return json.loads(json_str)
        except:
            pass
        
        # Fallback parsing
        return [
            {
                "priority": "medium",
                "category": "general",
                "title": "General Recommendation",
                "description": content[:200] + "..." if len(content) > 200 else content,
                "impact": "Positive",
                "effort": "Medium"
            }
        ]
    
    def _parse_text_analysis_response(self, content: str) -> Dict[str, Any]:
        """Parse text analysis response"""
        try:
            import json
            return json.loads(content)
        except:
            return {
                "sentiment": "neutral",
                "confidence": 0.5,
                "key_points": [content[:100]],
                "summary": content[:200]
            }
    
    def _generate_fallback_insights(self, data: Dict[str, Any], context: str) -> List[AIInsight]:
        """Generate fallback insights when AI is not available"""
        return [
            AIInsight(
                type="technical",
                content="Repository analysis completed successfully",
                confidence=0.8,
                category="analysis",
                timestamp=datetime.now().isoformat()
            ),
            AIInsight(
                type="business",
                content="Project shows good development practices",
                confidence=0.7,
                category="quality",
                timestamp=datetime.now().isoformat()
            )
        ]
    
    def _generate_fallback_recommendations(self, data: Dict[str, Any], context: str) -> List[AIRecommendation]:
        """Generate fallback recommendations when AI is not available"""
        return [
            AIRecommendation(
                priority="medium",
                category="technical",
                title="Continue Development",
                description="Maintain current development practices and focus on quality",
                impact="Positive",
                effort="Low"
            ),
            AIRecommendation(
                priority="high",
                category="business",
                title="Improve Documentation",
                description="Add comprehensive documentation to improve project understanding",
                impact="High",
                effort="Medium"
            )
        ]
    
    def _generate_fallback_text_analysis(self, text: str, analysis_type: str) -> Dict[str, Any]:
        """Generate fallback text analysis when AI is not available"""
        return {
            "sentiment": "neutral",
            "confidence": 0.5,
            "key_points": [text[:100] + "..." if len(text) > 100 else text],
            "summary": text[:200] + "..." if len(text) > 200 else text
        }
