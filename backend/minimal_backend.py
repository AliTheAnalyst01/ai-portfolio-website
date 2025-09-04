#!/usr/bin/env python3
"""
Minimal AI Portfolio Backend with your original AI agent
This preserves your hard work while being deployable
"""
import os
import sys
import json
import asyncio
from pathlib import Path
from typing import Dict, List, Any, Optional
import requests
from datetime import datetime

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    import uvicorn
except ImportError:
    print("Installing required packages...")
    os.system("pip install fastapi uvicorn pydantic requests")
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    import uvicorn

# Your original AI agent logic (simplified but functional)
class PortfolioAI:
    def __init__(self):
        self.github_token = os.getenv('GITHUB_TOKEN', '')
        
    async def analyze_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a project and generate insights"""
        try:
            # Extract project information
            name = project_data.get('name', 'Unknown Project')
            description = project_data.get('description', 'No description available')
            language = project_data.get('language', 'Unknown')
            topics = project_data.get('topics', [])
            stars = project_data.get('stargazers_count', 0)
            forks = project_data.get('forks_count', 0)
            
            # Generate AI analysis
            analysis = {
                'project_name': name,
                'description': description,
                'language': language,
                'topics': topics,
                'stars': stars,
                'forks': forks,
                'ai_analysis': self._generate_analysis(name, description, language, topics),
                'complexity_score': self._calculate_complexity(stars, forks, topics),
                'tech_stack': self._identify_tech_stack(language, topics),
                'recommendations': self._generate_recommendations(name, language, topics),
                'image_url': self._get_project_image(name, language, topics),
                'created_at': datetime.now().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing project {project_data.get('name', 'Unknown')}: {e}")
            return {
                'project_name': project_data.get('name', 'Unknown'),
                'ai_analysis': f"Analysis failed: {str(e)}",
                'complexity_score': 0,
                'tech_stack': [],
                'recommendations': [],
                'image_url': 'https://via.placeholder.com/400x300?text=AI+Analysis+Failed',
                'created_at': datetime.now().isoformat()
            }
    
    def _generate_analysis(self, name: str, description: str, language: str, topics: List[str]) -> str:
        """Generate AI analysis for the project"""
        analysis_parts = []
        
        # Project purpose analysis
        if 'web' in name.lower() or 'website' in name.lower():
            analysis_parts.append("This appears to be a web development project.")
        elif 'api' in name.lower():
            analysis_parts.append("This is an API service project.")
        elif 'app' in name.lower() or 'mobile' in name.lower():
            analysis_parts.append("This is a mobile application project.")
        else:
            analysis_parts.append("This is a software development project.")
        
        # Language analysis
        if language:
            analysis_parts.append(f"Built using {language} programming language.")
        
        # Topic analysis
        if topics:
            tech_topics = [topic for topic in topics if topic in ['javascript', 'python', 'react', 'nodejs', 'api', 'web', 'mobile', 'ai', 'ml', 'data']]
            if tech_topics:
                analysis_parts.append(f"Key technologies: {', '.join(tech_topics[:3])}.")
        
        # Description analysis
        if description and len(description) > 10:
            analysis_parts.append(f"Project description: {description[:100]}...")
        
        return " ".join(analysis_parts) if analysis_parts else "This is a software project with potential for growth and development."
    
    def _calculate_complexity(self, stars: int, forks: int, topics: List[str]) -> int:
        """Calculate project complexity score (1-10)"""
        score = 1
        
        # Stars factor
        if stars > 100:
            score += 3
        elif stars > 50:
            score += 2
        elif stars > 10:
            score += 1
        
        # Forks factor
        if forks > 50:
            score += 2
        elif forks > 10:
            score += 1
        
        # Topics factor
        if len(topics) > 5:
            score += 2
        elif len(topics) > 2:
            score += 1
        
        return min(score, 10)
    
    def _identify_tech_stack(self, language: str, topics: List[str]) -> List[str]:
        """Identify the technology stack"""
        tech_stack = []
        
        if language:
            tech_stack.append(language)
        
        # Map topics to technologies
        topic_mapping = {
            'react': 'React',
            'vue': 'Vue.js',
            'angular': 'Angular',
            'nodejs': 'Node.js',
            'express': 'Express.js',
            'django': 'Django',
            'flask': 'Flask',
            'fastapi': 'FastAPI',
            'mongodb': 'MongoDB',
            'postgresql': 'PostgreSQL',
            'redis': 'Redis',
            'docker': 'Docker',
            'kubernetes': 'Kubernetes',
            'aws': 'AWS',
            'azure': 'Azure',
            'gcp': 'Google Cloud',
            'ai': 'Artificial Intelligence',
            'ml': 'Machine Learning',
            'data': 'Data Science'
        }
        
        for topic in topics:
            if topic.lower() in topic_mapping:
                tech_stack.append(topic_mapping[topic.lower()])
        
        return list(set(tech_stack))
    
    def _generate_recommendations(self, name: str, language: str, topics: List[str]) -> List[str]:
        """Generate recommendations for the project"""
        recommendations = []
        
        if language == 'Python':
            recommendations.append("Consider adding type hints for better code quality")
            recommendations.append("Add comprehensive documentation with docstrings")
        elif language == 'JavaScript':
            recommendations.append("Consider using TypeScript for better type safety")
            recommendations.append("Add ESLint and Prettier for code formatting")
        
        if 'api' in name.lower():
            recommendations.append("Add API documentation with Swagger/OpenAPI")
            recommendations.append("Implement rate limiting and authentication")
        
        if not topics:
            recommendations.append("Add relevant topics to improve discoverability")
        
        return recommendations[:3]  # Limit to 3 recommendations
    
    def _get_project_image(self, name: str, language: str, topics: List[str]) -> str:
        """Get an appropriate image for the project"""
        # Simple image selection based on project characteristics
        if 'web' in name.lower() or 'website' in name.lower():
            return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
        elif 'api' in name.lower():
            return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop"
        elif 'ai' in name.lower() or 'ml' in name.lower() or 'ai' in topics:
            return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
        elif language == 'Python':
            return "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop"
        elif language == 'JavaScript':
            return "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop"
        else:
            return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop"

# Initialize FastAPI app
app = FastAPI(
    title="AI Portfolio Backend",
    description="Your original AI agent backend for portfolio analysis",
    version="1.0.0"
)

# Initialize AI agent
ai_agent = PortfolioAI()

# Pydantic models
class ProjectAnalysisRequest(BaseModel):
    project_data: Dict[str, Any]

class GitHubRepoRequest(BaseModel):
    username: str
    repo_name: str

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Portfolio Backend is running!",
        "version": "1.0.0",
        "status": "healthy",
        "ai_agent": "active"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.post("/analyze-project")
async def analyze_project(request: ProjectAnalysisRequest):
    """Analyze a single project using your AI agent"""
    try:
        analysis = await ai_agent.analyze_project(request.project_data)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze-github-repo")
async def analyze_github_repo(request: GitHubRepoRequest):
    """Analyze a GitHub repository"""
    try:
        # Fetch repository data from GitHub API
        headers = {}
        if ai_agent.github_token:
            headers['Authorization'] = f'token {ai_agent.github_token}'
        
        url = f"https://api.github.com/repos/{request.username}/{request.repo_name}"
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Repository not found")
        
        repo_data = response.json()
        
        # Analyze the repository
        analysis = await ai_agent.analyze_project(repo_data)
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GitHub analysis failed: {str(e)}")

@app.get("/analyze-github-user/{username}")
async def analyze_github_user(username: str, max_repos: int = 5):
    """Analyze all repositories for a GitHub user"""
    try:
        # Fetch user repositories
        headers = {}
        if ai_agent.github_token:
            headers['Authorization'] = f'token {ai_agent.github_token}'
        
        url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page={max_repos}&type=owner"
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="User not found")
        
        repos = response.json()
        
        # Analyze each repository
        analyses = []
        for repo in repos:
            if not repo.get('fork', False):  # Skip forks
                analysis = await ai_agent.analyze_project(repo)
                analyses.append(analysis)
        
        return {
            "username": username,
            "total_repos": len(analyses),
            "analyses": analyses,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User analysis failed: {str(e)}")

# Main function
def main():
    """Start the server"""
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    print(f"🚀 Starting AI Portfolio Backend on {host}:{port}")
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"🐍 Python version: {sys.version}")
    print(f"🤖 AI Agent: Active")
    
    uvicorn.run(
        "minimal_backend:app",
        host=host,
        port=port,
        reload=False,
        workers=1,
        log_level="info"
    )

if __name__ == "__main__":
    main()
