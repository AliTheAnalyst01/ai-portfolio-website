"""
🤖 AI Interface
Defines contract for AI operations following Interface Segregation Principle
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class AIInsight:
    """AI insight model"""
    type: str  # technical, business, career
    content: str
    confidence: float
    category: str
    timestamp: str

@dataclass
class AIRecommendation:
    """AI recommendation model"""
    priority: str  # high, medium, low
    category: str  # technical, business, career
    title: str
    description: str
    impact: str
    effort: str

class IAIEngine(ABC):
    """Interface for AI operations"""
    
    @abstractmethod
    async def generate_insights(self, data: Dict[str, Any], context: str) -> List[AIInsight]:
        """Generate AI insights from data"""
        pass
    
    @abstractmethod
    async def generate_recommendations(self, data: Dict[str, Any], context: str) -> List[AIRecommendation]:
        """Generate AI recommendations"""
        pass
    
    @abstractmethod
    async def analyze_text(self, text: str, analysis_type: str) -> Dict[str, Any]:
        """Analyze text content"""
        pass

class IContentGenerator(ABC):
    """Interface for content generation"""
    
    @abstractmethod
    async def generate_description(self, data: Dict[str, Any], audience: str) -> str:
        """Generate project description for specific audience"""
        pass
    
    @abstractmethod
    async def generate_summary(self, data: Dict[str, Any]) -> str:
        """Generate executive summary"""
        pass
    
    @abstractmethod
    async def generate_report(self, data: Dict[str, Any], format: str) -> str:
        """Generate formatted report"""
        pass

