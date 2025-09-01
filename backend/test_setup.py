#!/usr/bin/env python3
"""
🧪 Test Setup Script
Verify that all components are working correctly
"""

import sys
import os

def test_imports():
    """Test if all required modules can be imported"""
    print("🔍 Testing imports...")
    
    try:
        # Test basic Python modules
        import asyncio
        print("✅ asyncio imported successfully")
        
        # Test FastAPI
        import fastapi
        print("✅ FastAPI imported successfully")
        
        # Test Uvicorn
        import uvicorn
        print("✅ Uvicorn imported successfully")
        
        # Test Pydantic
        import pydantic
        print("✅ Pydantic imported successfully")
        
        # Test Loguru
        import loguru
        print("✅ Loguru imported successfully")
        
        print("\n🎉 All core imports successful!")
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_file_structure():
    """Test if all required files exist"""
    print("\n📁 Testing file structure...")
    
    required_files = [
        "main.py",
        "requirements.txt",
        "app/core/config.py",
        "app/services/github_analyzer.py",
        "app/services/ai_engine.py",
        "app/services/portfolio_analyzer.py",
        "app/api/v1/api.py",
        "app/api/v1/endpoints/github.py",
        "app/api/v1/endpoints/portfolio.py",
        "app/api/v1/endpoints/ai.py"
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING")
            all_exist = False
    
    return all_exist

def test_basic_functionality():
    """Test basic functionality"""
    print("\n🔧 Testing basic functionality...")
    
    try:
        # Test configuration
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        
        from app.core.config import settings
        print("✅ Configuration loaded successfully")
        
        # Test basic settings
        print(f"   App Name: {settings.APP_NAME}")
        print(f"   Version: {settings.APP_VERSION}")
        print(f"   Debug: {settings.DEBUG}")
        
        return True
        
    except Exception as e:
        print(f"❌ Basic functionality test failed: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 AI Portfolio Backend - Setup Test")
    print("=" * 50)
    
    # Test imports
    imports_ok = test_imports()
    
    # Test file structure
    structure_ok = test_file_structure()
    
    # Test basic functionality
    functionality_ok = test_basic_functionality()
    
    print("\n" + "=" * 50)
    if imports_ok and structure_ok and functionality_ok:
        print("🎉 Setup test PASSED! Your backend is ready to run.")
        print("\n🚀 To start your backend:")
        print("   ./start.sh")
        print("\n🐳 Or use Docker:")
        print("   docker-compose up -d")
        print("\n📚 API Documentation will be available at:")
        print("   http://localhost:8000/docs")
    else:
        print("❌ Setup test FAILED! Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
