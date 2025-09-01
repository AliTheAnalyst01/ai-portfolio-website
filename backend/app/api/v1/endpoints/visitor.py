"""
👥 Visitor API Endpoints
API endpoints for visitor tracking and personalization
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from datetime import datetime
import uuid

from app.database.database import get_db
from app.models.visitor import Visitor, AgentActivity, PersonalizedContent
from app.services.personalization_engine import PersonalizationEngine
from app.services.ai.ai_engine import AIEngineService
from app.core.config.settings import get_settings

router = APIRouter()
settings = get_settings()

# Initialize services
ai_engine = AIEngineService()
personalization_engine = PersonalizationEngine(ai_engine)

@router.post("/track-visit")
async def track_visit(
    request: Request,
    visitor_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Track visitor activity"""
    try:
        # Get or create visitor
        session_id = visitor_data.get("session_id", str(uuid.uuid4()))
        visitor_type = visitor_data.get("visitor_type", "general")
        
        visitor = db.query(Visitor).filter(Visitor.session_id == session_id).first()
        
        if not visitor:
            visitor = Visitor(
                session_id=session_id,
                visitor_type=visitor_type,
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent", ""),
                preferences=visitor_data.get("preferences", {})
            )
            db.add(visitor)
        else:
            visitor.last_visit = datetime.now()
            visitor.visit_count += 1
            visitor.visitor_type = visitor_type
        
        db.commit()
        db.refresh(visitor)
        
        return {
            "success": True,
            "visitor_id": visitor.id,
            "session_id": session_id,
            "message": "Visit tracked successfully"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to track visit: {str(e)}")

@router.post("/track-activity")
async def track_activity(
    activity_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Track specific agent activity"""
    try:
        activity = AgentActivity(
            visitor_id=activity_data.get("visitor_id"),
            session_id=activity_data.get("session_id"),
            activity_type=activity_data.get("activity_type"),
            repository_name=activity_data.get("repository_name"),
            visitor_type=activity_data.get("visitor_type"),
            content_generated=activity_data.get("content_generated"),
            analysis_data=activity_data.get("analysis_data"),
            response_time=activity_data.get("response_time"),
            success=activity_data.get("success", True)
        )
        
        db.add(activity)
        db.commit()
        db.refresh(activity)
        
        return {
            "success": True,
            "activity_id": activity.id,
            "message": "Activity tracked successfully"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to track activity: {str(e)}")

@router.post("/personalize-repository")
async def personalize_repository(
    repository_data: Dict[str, Any],
    visitor_type: str,
    db: Session = Depends(get_db)
):
    """Generate personalized content for a repository"""
    try:
        repository = repository_data.get("repository")
        analysis = repository_data.get("analysis")
        
        if not repository:
            raise HTTPException(status_code=400, detail="Repository data is required")
        
        # Check if personalized content already exists
        existing_content = db.query(PersonalizedContent).filter(
            PersonalizedContent.repository_name == repository.get("name"),
            PersonalizedContent.visitor_type == visitor_type
        ).first()
        
        if existing_content:
            return {
                "success": True,
                "content": {
                    "personalized_description": existing_content.content,
                    "visitor_type": visitor_type,
                    "cached": True,
                    "generated_at": existing_content.created_at.isoformat()
                }
            }
        
        # Generate new personalized content
        personalized_content = await personalization_engine.generate_personalized_repository_content(
            repository, visitor_type, analysis
        )
        
        # Cache the content
        cache_entry = PersonalizedContent(
            repository_name=repository.get("name"),
            visitor_type=visitor_type,
            content_type="full_content",
            content=personalized_content.get("personalized_description", ""),
            metadata=personalized_content
        )
        
        db.add(cache_entry)
        db.commit()
        
        return {
            "success": True,
            "content": personalized_content
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Personalization failed: {str(e)}")

@router.get("/visitor-types")
async def get_visitor_types():
    """Get available visitor types and their configurations"""
    try:
        visitor_types = personalization_engine.get_visitor_types()
        return {
            "success": True,
            "visitor_types": visitor_types
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get visitor types: {str(e)}")

@router.get("/visitor-stats")
async def get_visitor_stats(db: Session = Depends(get_db)):
    """Get visitor statistics"""
    try:
        # Total visitors
        total_visitors = db.query(Visitor).count()
        
        # Visitors by type
        visitors_by_type = {}
        for visitor_type in ["business", "hr", "technical", "general"]:
            count = db.query(Visitor).filter(Visitor.visitor_type == visitor_type).count()
            visitors_by_type[visitor_type] = count
        
        # Recent activity
        recent_activities = db.query(AgentActivity).order_by(
            AgentActivity.created_at.desc()
        ).limit(10).all()
        
        return {
            "success": True,
            "stats": {
                "total_visitors": total_visitors,
                "visitors_by_type": visitors_by_type,
                "recent_activities": [
                    {
                        "activity_type": activity.activity_type,
                        "repository_name": activity.repository_name,
                        "visitor_type": activity.visitor_type,
                        "created_at": activity.created_at.isoformat()
                    }
                    for activity in recent_activities
                ]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get visitor stats: {str(e)}")

@router.get("/visitor/{session_id}")
async def get_visitor_info(session_id: str, db: Session = Depends(get_db)):
    """Get visitor information by session ID"""
    try:
        visitor = db.query(Visitor).filter(Visitor.session_id == session_id).first()
        
        if not visitor:
            raise HTTPException(status_code=404, detail="Visitor not found")
        
        # Get visitor's activities
        activities = db.query(AgentActivity).filter(
            AgentActivity.session_id == session_id
        ).order_by(AgentActivity.created_at.desc()).all()
        
        return {
            "success": True,
            "visitor": {
                "id": visitor.id,
                "session_id": visitor.session_id,
                "visitor_type": visitor.visitor_type,
                "first_visit": visitor.first_visit.isoformat(),
                "last_visit": visitor.last_visit.isoformat(),
                "visit_count": visitor.visit_count,
                "time_spent": visitor.time_spent,
                "preferences": visitor.preferences,
                "activities": [
                    {
                        "activity_type": activity.activity_type,
                        "repository_name": activity.repository_name,
                        "created_at": activity.created_at.isoformat(),
                        "success": activity.success
                    }
                    for activity in activities
                ]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get visitor info: {str(e)}")

@router.put("/visitor/{session_id}/preferences")
async def update_visitor_preferences(
    session_id: str,
    preferences: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Update visitor preferences"""
    try:
        visitor = db.query(Visitor).filter(Visitor.session_id == session_id).first()
        
        if not visitor:
            raise HTTPException(status_code=404, detail="Visitor not found")
        
        visitor.preferences = preferences
        db.commit()
        
        return {
            "success": True,
            "message": "Preferences updated successfully"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update preferences: {str(e)}")
