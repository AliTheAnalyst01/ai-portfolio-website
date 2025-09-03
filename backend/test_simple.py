#!/usr/bin/env python3
"""
🧪 Simple Test Script
Test basic functionality without complex imports
"""

import sys
import os

def test_basic_imports():
    """Test basic Python functionality"""
    print("🔍 Testing basic imports...")
    
    try:
        import asyncio
        print("✅ asyncio imported successfully")
        
        import uvicorn
        print("✅ uvicorn imported successfully")
        
        import fastapi
        print("✅ fastapi imported successfully")
        
        import loguru
        print("✅ loguru imported successfully")
        
        print("\n🎉 All basic imports successful!")
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
        "start.sh",
        "README.md",
        "Dockerfile",
        "docker-compose.yml"
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING")
            all_exist = False
    
    return all_exist

def test_virtual_environment():
    """Test virtual environment"""
    print("\n🐍 Testing virtual environment...")
    
    try:
        # Check if we're in a virtual environment
        if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
            print("✅ Virtual environment is active")
            print(f"   Python: {sys.executable}")
            print(f"   Version: {sys.version}")
        else:
            print("⚠️  Virtual environment not detected")
            print("   Run: source venv/bin/activate")
        
        return True
        
    except Exception as e:
        print(f"❌ Virtual environment test failed: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 AI Portfolio Backend - Simple Test")
    print("=" * 50)
    
    # Test imports
    imports_ok = test_basic_imports()
    
    # Test file structure
    structure_ok = test_file_structure()
    
    # Test virtual environment
    venv_ok = test_virtual_environment()
    
    print("\n" + "=" * 50)
    if imports_ok and structure_ok:
        print("🎉 Basic test PASSED! Your backend is ready to run.")
        print("\n🚀 To start your backend:")
        print("   python3 main.py")
        print("\n🐳 Or use Docker:")
        print("   docker-compose up -d")
        print("\n📚 API Documentation will be available at:")
        print("   http://localhost:8000/docs")
        print("\n🔍 Test endpoints:")
        print("   http://localhost:8000/health")
        print("   http://localhost:8000/api/v1/test")
    else:
        print("❌ Basic test FAILED! Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
