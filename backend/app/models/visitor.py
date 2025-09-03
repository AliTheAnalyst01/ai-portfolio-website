"""
👥 Visitor Models
Database models for tracking visitor activity and preferences
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class Visitor(Base):
    """Visitor model for tracking portfolio visitors"""
    __tablename__ = "visitors"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, index=True)
    visitor_type = Column(String(50), nullable=False)  # business, hr, technical, general
    ip_address = Column(String(45))
    user_agent = Column(Text)
    first_visit = Column(DateTime, default=func.now())
    last_visit = Column(DateTime, default=func.now(), onupdate=func.now())
    visit_count = Column(Integer, default=1)
    time_spent = Column(Integer, default=0)  # in seconds
    pages_visited = Column(JSON, default=list)
    preferences = Column(JSON, default=dict)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class AgentActivity(Base):
    """Agent activity tracking"""
    __tablename__ = "agent_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    visitor_id = Column(Integer, index=True)
    session_id = Column(String(255), index=True)
    activity_type = Column(String(100), nullable=False)  # repository_view, analysis_request, etc.
    repository_name = Column(String(255))
    visitor_type = Column(String(50))
    content_generated = Column(Text)
    analysis_data = Column(JSON)
    response_time = Column(Integer)  # in milliseconds
    success = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

class PersonalizedContent(Base):
    """Personalized content cache"""
    __tablename__ = "personalized_content"
    
    id = Column(Integer, primary_key=True, index=True)
    repository_name = Column(String(255), index=True)
    visitor_type = Column(String(50), index=True)
    content_type = Column(String(100))  # description, analysis, recommendations
    content = Column(Text)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
