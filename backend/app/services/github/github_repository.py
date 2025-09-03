"""
🔍 GitHub Repository Service
Implements GitHub operations following Single Responsibility Principle
"""

import asyncio
import aiohttp
from typing import Dict, List, Any, Optional
from datetime import datetime
from loguru import logger

from app.interfaces.github_interface import IGitHubRepository, RepositoryData
from app.core.config.settings import settings

class GitHubRepositoryService(IGitHubRepository):
    """GitHub repository service implementation"""
    
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "AI-Portfolio-Backend/2.0.0"
        }
        
        if settings.GITHUB_TOKEN:
            self.headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"
        
        self.session = None
        self.logger = logger
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(headers=self.headers)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    async def get_repositories(self, username: str, max_repos: int = 50) -> List[RepositoryData]:
        """Get user repositories"""
        try:
            self.logger.info(f"Fetching repositories for user: {username}")
            
            url = f"{self.base_url}/users/{username}/repos"
            params = {
                "sort": "updated",
                "per_page": min(max_repos, 100),
                "type": "owner"
            }
            
            async with self.session.get(url, params=params) as response:
                if response.status == 404:
                    raise ValueError(f"User '{username}' not found")
                elif response.status == 403:
                    raise ValueError("GitHub API rate limit exceeded")
                elif response.status != 200:
                    raise ValueError(f"GitHub API error: {response.status}")
                
                data = await response.json()
                
                repositories = []
                for repo in data:
                    # Skip archived and disabled repositories
                    if repo.get("archived") or repo.get("disabled"):
                        continue
                    
                    repository = RepositoryData(
                        id=repo["id"],
                        name=repo["name"],
                        full_name=repo["full_name"],
                        description=repo.get("description"),
                        language=repo.get("language"),
                        stars=repo["stargazers_count"],
                        forks=repo["forks_count"],
                        created_at=repo["created_at"],
                        updated_at=repo["updated_at"],
                        topics=repo.get("topics", []),
                        size=repo["size"],
                        url=repo["html_url"]
                    )
                    repositories.append(repository)
                
                self.logger.info(f"Found {len(repositories)} active repositories for {username}")
                return repositories
                
        except Exception as e:
            self.logger.error(f"Failed to fetch repositories: {e}")
            raise
    
    async def get_repository(self, username: str, repo_name: str) -> RepositoryData:
        """Get single repository"""
        try:
            self.logger.info(f"Fetching repository: {username}/{repo_name}")
            
            url = f"{self.base_url}/repos/{username}/{repo_name}"
            
            async with self.session.get(url) as response:
                if response.status == 404:
                    raise ValueError(f"Repository '{username}/{repo_name}' not found")
                elif response.status != 200:
                    raise ValueError(f"GitHub API error: {response.status}")
                
                repo = await response.json()
                
                repository = RepositoryData(
                    id=repo["id"],
                    name=repo["name"],
                    full_name=repo["full_name"],
                    description=repo.get("description"),
                    language=repo.get("language"),
                    stars=repo["stargazers_count"],
                    forks=repo["forks_count"],
                    created_at=repo["created_at"],
                    updated_at=repo["updated_at"],
                    topics=repo.get("topics", []),
                    size=repo["size"],
                    url=repo["html_url"]
                )
                
                return repository
                
        except Exception as e:
            self.logger.error(f"Failed to fetch repository: {e}")
            raise
    
    async def get_languages(self, username: str, repo_name: str) -> Dict[str, int]:
        """Get repository languages"""
        try:
            url = f"{self.base_url}/repos/{username}/{repo_name}/languages"
            
            async with self.session.get(url) as response:
                if response.status != 200:
                    return {}
                
                return await response.json()
                
        except Exception as e:
            self.logger.error(f"Failed to fetch languages: {e}")
            return {}
    
    async def get_contributors(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Get repository contributors"""
        try:
            url = f"{self.base_url}/repos/{username}/{repo_name}/contributors"
            params = {"per_page": 100}
            
            async with self.session.get(url, params=params) as response:
                if response.status != 200:
                    return []
                
                contributors = await response.json()
                
                return [
                    {
                        "login": c["login"],
                        "id": c["id"],
                        "contributions": c["contributions"],
                        "avatar_url": c["avatar_url"],
                        "type": c["type"]
                    }
                    for c in contributors
                ]
                
        except Exception as e:
            self.logger.error(f"Failed to fetch contributors: {e}")
            return []
    
    async def get_commits(self, username: str, repo_name: str, max_commits: int = 100) -> List[Dict[str, Any]]:
        """Get repository commits"""
        try:
            url = f"{self.base_url}/repos/{username}/{repo_name}/commits"
            params = {"per_page": min(max_commits, 100)}
            
            async with self.session.get(url, params=params) as response:
                if response.status != 200:
                    return []
                
                commits = await response.json()
                
                return [
                    {
                        "sha": c["sha"],
                        "message": c["commit"]["message"],
                        "author": c["commit"]["author"]["name"],
                        "date": c["commit"]["author"]["date"],
                        "url": c["html_url"]
                    }
                    for c in commits
                ]
                
        except Exception as e:
            self.logger.error(f"Failed to fetch commits: {e}")
            return []
    
    async def get_issues(self, username: str, repo_name: str, state: str = "all") -> List[Dict[str, Any]]:
        """Get repository issues"""
        try:
            url = f"{self.base_url}/repos/{username}/{repo_name}/issues"
            params = {"state": state, "per_page": 100}
            
            async with self.session.get(url, params=params) as response:
                if response.status != 200:
                    return []
                
                issues = await response.json()
                
                return [
                    {
                        "number": i["number"],
                        "title": i["title"],
                        "state": i["state"],
                        "created_at": i["created_at"],
                        "closed_at": i.get("closed_at"),
                        "labels": [l["name"] for l in i.get("labels", [])]
                    }
                    for i in issues
                ]
                
        except Exception as e:
            self.logger.error(f"Failed to fetch issues: {e}")
            return []
