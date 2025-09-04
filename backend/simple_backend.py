from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from typing import List, Dict, Any

app = FastAPI(title="AI Portfolio Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Portfolio Backend is running!"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "ai-portfolio-backend"}

@app.get("/api/v1/ai/analyze-project")
async def analyze_project(project_name: str, description: str = "", language: str = ""):
    """Simple AI analysis for projects"""
    
    # Basic analysis based on project characteristics
    analysis = {
        "projectName": project_name,
        "complexity": {
            "score": min(10, len(project_name) + len(description) // 10),
            "level": "intermediate" if len(project_name) > 10 else "beginner"
        },
        "category": "web-development" if "web" in description.lower() else "data-science",
        "technologies": [language] if language else ["Python"],
        "useCase": f"Perfect for {description[:50]}..." if description else f"Great {project_name} project",
        "recommendations": [
            "Add comprehensive documentation",
            "Implement error handling",
            "Add unit tests"
        ]
    }
    
    return analysis

@app.get("/api/v1/ai/generate-image-prompt")
async def generate_image_prompt(project_name: str, description: str = ""):
    """Generate image prompt for project"""
    
    prompts = {
        "ai": "AI neural network visualization with glowing nodes and data flow",
        "web": "Modern web application interface with clean design",
        "data": "Data visualization dashboard with charts and graphs",
        "ml": "Machine learning model training visualization",
        "portfolio": "Professional portfolio website with modern design"
    }
    
    # Find best matching prompt
    best_prompt = "Professional software development workspace"
    for key, prompt in prompts.items():
        if key in project_name.lower() or key in description.lower():
            best_prompt = prompt
            break
    
    return {
        "prompt": best_prompt,
        "imageUrl": f"https://picsum.photos/400/300?random={hash(project_name) % 1000}"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
