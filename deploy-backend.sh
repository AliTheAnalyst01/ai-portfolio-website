#!/bin/bash

# Backend Deployment Script
echo "🚀 BACKEND DEPLOYMENT GUIDE"
echo "=========================="
echo ""

echo "Current Status:"
echo "✅ Frontend: Deployed on Vercel"
echo "❌ Backend: Needs deployment"
echo ""

echo "Choose your backend deployment option:"
echo "1. Railway (Recommended - Free tier with database)"
echo "2. Render (Alternative - Free tier)"
echo "3. Manual deployment guide"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to Railway..."
        echo ""
        echo "Steps:"
        echo "1. Go to https://railway.app"
        echo "2. Sign in with GitHub"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select your repository"
        echo "5. Add PostgreSQL database (free)"
        echo "6. Add Redis cache (free)"
        echo "7. Add environment variables:"
        echo "   - DATABASE_URL = (auto-generated)"
        echo "   - REDIS_URL = (auto-generated)"
        echo "   - GITHUB_TOKEN = your_github_token_here"
        echo "   - OPENAI_API_KEY = (your key if available)"
        echo "8. Deploy!"
        echo ""
        echo "After deployment, update your frontend to use the new backend URL."
        ;;
    2)
        echo "🚀 Deploying to Render..."
        echo ""
        echo "Steps:"
        echo "1. Go to https://render.com"
        echo "2. Sign in with GitHub"
        echo "3. Click 'New' → 'Web Service'"
        echo "4. Connect your repository"
        echo "5. Use render.yaml configuration"
        echo "6. Add environment variables"
        echo "7. Deploy!"
        ;;
    3)
        echo "📖 Manual Deployment Guide"
        echo ""
        echo "Your backend includes:"
        echo "✅ FastAPI application"
        echo "✅ PostgreSQL database support"
        echo "✅ Redis caching"
        echo "✅ GitHub API integration"
        echo "✅ AI analysis features"
        echo ""
        echo "Required environment variables:"
        echo "- DATABASE_URL"
        echo "- REDIS_URL"
        echo "- GITHUB_TOKEN"
        echo "- OPENAI_API_KEY (optional)"
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Backend deployment guide provided!"
echo "📝 After deploying, update your frontend to use the new backend URL."
