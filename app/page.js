'use client';

import { useState, useEffect } from 'react';
import Portfolio from '@/components/Portfolio';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import EnhancedAnalysisDashboard from '@/components/EnhancedAnalysisDashboard';
import RepositoryGallery from '@/components/RepositoryGallery';
import LandingPage from '@/components/LandingPage';
import backendAPI from '@/lib/backend-api';

export default function HomePage() {
  const [activeView, setActiveView] = useState('landing'); // landing, portfolio, dashboard, enhanced, gallery
  const [backendStatus, setBackendStatus] = useState('checking');
  const [visitorType, setVisitorType] = useState(null);

  useEffect(() => {
    checkBackendStatus();
    // Check if visitor type is already set
    const savedVisitorType = localStorage.getItem('visitorType');
    if (savedVisitorType) {
      setVisitorType(savedVisitorType);
      setActiveView('portfolio');
    }
  }, []);

  const checkBackendStatus = async () => {
    try {
      await backendAPI.healthCheck();
      setBackendStatus('connected');
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendStatus('disconnected');
    }
  };

  const handleVisitorTypeSelect = (type) => {
    setVisitorType(type.key);
    setActiveView('portfolio');
  };

  return (
    <div className="min-h-screen">
      {/* Backend Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-4 py-2 rounded-lg shadow-lg ${
          backendStatus === 'connected' 
            ? 'bg-green-500 text-white' 
            : backendStatus === 'disconnected'
            ? 'bg-red-500 text-white'
            : 'bg-yellow-500 text-white'
        }`}>
          {backendStatus === 'connected' && '🚀 Backend Connected'}
          {backendStatus === 'disconnected' && '⚠️ Backend Disconnected'}
          {backendStatus === 'checking' && '🔄 Checking Backend...'}
        </div>
      </div>

      {/* Navigation - Only show if not on landing page */}
      {activeView !== 'landing' && (
        <div className="fixed top-4 left-4 z-50">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('portfolio')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'portfolio'
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              AI Dashboard
            </button>
            <button
              onClick={() => setActiveView('enhanced')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'enhanced'
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Enhanced Analysis
            </button>
            <button
              onClick={() => setActiveView('gallery')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'gallery'
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Repository Gallery
            </button>
            {/* Visitor Type Indicator */}
            {visitorType && (
              <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                {visitorType.charAt(0).toUpperCase() + visitorType.slice(1)} View
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeView === 'landing' && <LandingPage onVisitorTypeSelect={handleVisitorTypeSelect} />}
      {activeView === 'portfolio' && <Portfolio visitorType={visitorType} />}
      {activeView === 'dashboard' && <PortfolioDashboard username="AliTheAnalyst01" visitorType={visitorType} />}
      {activeView === 'enhanced' && <EnhancedAnalysisDashboard username="AliTheAnalyst01" visitorType={visitorType} />}
      {activeView === 'gallery' && <RepositoryGallery username="AliTheAnalyst01" visitorType={visitorType} />}
    </div>
  );
}
