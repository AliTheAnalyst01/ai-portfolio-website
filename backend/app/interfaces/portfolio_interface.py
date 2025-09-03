"""
📊 Portfolio Interface
Defines contract for portfolio operations following Interface Segregation Principle
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class SkillMetric:
    """Skill metric model"""
    skill: str
    level: str  # beginner, intermediate, advanced, expert
    score: float
    projects_count: int
    experience_years: float

@dataclass
class PortfolioMetrics:
    """Portfolio metrics model"""
    total_repositories: int
    total_stars: int
    total_forks: int
    primary_language: str
    top_languages: List[Dict[str, Any]]
    skill_matrix: List[SkillMetric]
    activity_score: float
    quality_score: float
    market_position: str

@dataclass
class CareerGuidance:
    """Career guidance model"""
    current_level: str
    target_level: str
    skill_gaps: List[str]
    opportunities: List[str]
    next_steps: List[str]
    timeline: str

class IPortfolioAnalyzer(ABC):
    """Interface for portfolio analysis operations"""
    
    @abstractmethod
    async def analyze_portfolio(self, username: str) -> PortfolioMetrics:
        """Analyze complete portfolio"""
        pass
    
    @abstractmethod
    async def get_skill_matrix(self, username: str) -> List[SkillMetric]:
        """Get skill matrix for user"""
        pass
    
    @abstractmethod
    async def get_career_guidance(self, username: str) -> CareerGuidance:
        """Get career guidance recommendations"""
        pass

class IAnalyticsService(ABC):
    """Interface for analytics operations"""
    
    @abstractmethod
    async def track_visitor(self, visitor_data: Dict[str, Any]) -> None:
        """Track visitor analytics"""
        pass
    
    @abstractmethod
    async def get_analytics(self, username: str) -> Dict[str, Any]:
        """Get analytics data"""
        pass
    
    @abstractmethod
    async def generate_insights(self, analytics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate analytics insights"""
        pass

