#!/bin/bash

echo "🚀 Starting AI Portfolio Backend (SOLID Architecture)"
echo "=================================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create logs directory
mkdir -p logs

# Validate environment
echo "⚙️ Validating environment..."
python3 -c "
from app.core.config.settings import validate_settings
if validate_settings():
    print('✅ Environment validation passed')
else:
    print('⚠️  Environment validation failed - some settings missing')
    print('📝 Please check your .env file')
"

# Test SOLID architecture
echo "🧪 Testing SOLID architecture..."
python3 test_solid.py

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SOLID Architecture test passed!"
    echo ""
    echo "🚀 Starting FastAPI server..."
    echo "📚 API Documentation: http://localhost:8000/docs"
    echo "🔍 Health Check: http://localhost:8000/health"
    echo ""
    python3 main_solid.py
else
    echo "❌ SOLID Architecture test failed!"
    echo "Please fix the issues before starting the server."
    exit 1
fi

