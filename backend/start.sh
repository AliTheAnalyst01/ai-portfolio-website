#!/bin/bash

echo "�� Starting AI Portfolio Backend..."

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

# Start the backend
echo "🚀 Starting FastAPI server..."
python3 main.py
