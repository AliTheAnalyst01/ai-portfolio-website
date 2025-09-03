"""
🔌 GitHub Interface
Defines contract for GitHub operations following Interface Segregation Principle
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class RepositoryData:
    """Repository data model"""
    id: int
    name: str
    full_name: str
    description: Optional[str]
    language: Optional[str]
    stars: int
    forks: int
    created_at: str
    updated_at: str
    topics: List[str]
    size: int
    url: str

@dataclass
class AnalysisResult:
    """Analysis result model"""
    repository: RepositoryData
    technical_score: float
    quality_score: float
    activity_score: float
    overall_score: float
    insights: List[str]
    recommendations: List[str]
    timestamp: str

class IGitHubRepository(ABC):
    """Interface for GitHub repository operations"""
    
    @abstractmethod
    async def get_repositories(self, username: str, max_repos: int = 50) -> List[RepositoryData]:
        """Get user repositories"""
        pass
    
    @abstractmethod
    async def get_repository(self, username: str, repo_name: str) -> RepositoryData:
        """Get single repository"""
        pass
    
    @abstractmethod
    async def get_languages(self, username: str, repo_name: str) -> Dict[str, int]:
        """Get repository languages"""
        pass
    
    @abstractmethod
    async def get_contributors(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Get repository contributors"""
        pass

class IRepositoryAnalyzer(ABC):
    """Interface for repository analysis operations"""
    
    @abstractmethod
    async def analyze_repository(self, repository: RepositoryData) -> AnalysisResult:
        """Analyze a single repository"""
        pass
    
    @abstractmethod
    async def analyze_batch(self, repositories: List[RepositoryData]) -> List[AnalysisResult]:
        """Analyze multiple repositories"""
        pass
    
    @abstractmethod
    async def get_analysis_metrics(self, repository: RepositoryData) -> Dict[str, Any]:
        """Get detailed analysis metrics"""
        pass

