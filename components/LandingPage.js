/**
 * 🏠 Landing Page
 * Professional landing page with visitor type selection
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LandingPage = ({ onVisitorTypeSelect }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const visitorTypes = [
    {
      key: "business",
      title: "Business Professional",
      icon: "💼",
      description: "Focus on ROI, business value, and market impact",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      key: "hr",
      title: "HR Professional", 
      icon: "👥",
      description: "Focus on skills, experience, and team collaboration",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      key: "technical",
      title: "Technical Professional",
      icon: "⚙️",
      description: "Focus on code quality, architecture, and best practices",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      key: "general",
      title: "General Visitor",
      icon: "👋",
      description: "Focus on overview, impact, and user experience",
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setIsAnimating(true);
    
    // Store visitor type in localStorage
    localStorage.setItem('visitorType', type.key);
    localStorage.setItem('visitorTypeLabel', type.title);
    
    setTimeout(() => {
      onVisitorTypeSelect(type);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
            🚀 Welcome to My Portfolio
          </h1>
          <p className="text-xl text-blue-200 mb-8 animate-fade-in-delay">
            AI-Powered Professional Portfolio with Personalized Experience
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto animate-fade-in-delay-2"></div>
        </div>

        {/* Introduction */}
        <div className="mb-16 animate-fade-in-delay-3">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
            <h2 className="text-2xl font-semibold text-white mb-4">Hi, I'm Ali The Analyst</h2>
            <p className="text-lg text-blue-100 mb-6">
              A passionate developer and data analyst with expertise in AI, machine learning, and full-stack development. 
              I create innovative solutions that drive business value and technical excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">🤖 AI/ML Expert</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">💻 Full-Stack Developer</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">📊 Data Analyst</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">🚀 Innovation Focused</span>
            </div>
          </div>
        </div>

        {/* Visitor Type Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 animate-fade-in-delay-4">
            How would you like to explore my work?
          </h2>
          <p className="text-lg text-blue-200 mb-12 animate-fade-in-delay-5">
            Select your role to get a personalized experience tailored to your interests
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visitorTypes.map((type, index) => (
              <div
                key={type.key}
                className={`transform transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in-delay-${index + 6}`}
                onClick={() => handleTypeSelect(type)}
              >
                <div className={`bg-gradient-to-br ${type.color} ${type.hoverColor} rounded-2xl p-8 shadow-2xl border border-white border-opacity-20 hover:shadow-3xl transition-all duration-300`}>
                  <div className="text-6xl mb-4">{type.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="animate-fade-in-delay-10">
          <h3 className="text-2xl font-bold text-white mb-8">What you'll discover:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-lg font-semibold text-white mb-2">Beautiful Repository Gallery</h4>
              <p className="text-blue-200 text-sm">Interactive image carousels showcasing each project</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Analysis</h4>
              <p className="text-blue-200 text-sm">Intelligent insights and personalized recommendations</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-lg font-semibold text-white mb-2">Professional Dashboard</h4>
              <p className="text-blue-200 text-sm">Comprehensive analytics and career insights</p>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        {isAnimating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-xl">Preparing your personalized experience...</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.4s both;
        }
        .animate-fade-in-delay-3 {
          animation: fadeIn 1s ease-out 0.6s both;
        }
        .animate-fade-in-delay-4 {
          animation: fadeIn 1s ease-out 0.8s both;
        }
        .animate-fade-in-delay-5 {
          animation: fadeIn 1s ease-out 1s both;
        }
        .animate-fade-in-delay-6 {
          animation: fadeIn 1s ease-out 1.2s both;
        }
        .animate-fade-in-delay-7 {
          animation: fadeIn 1s ease-out 1.4s both;
        }
        .animate-fade-in-delay-8 {
          animation: fadeIn 1s ease-out 1.6s both;
        }
        .animate-fade-in-delay-9 {
          animation: fadeIn 1s ease-out 1.8s both;
        }
        .animate-fade-in-delay-10 {
          animation: fadeIn 1s ease-out 2s both;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
