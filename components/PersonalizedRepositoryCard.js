/**
 * 🎯 Personalized Repository Card
 * Repository card that adapts content based on visitor type
 */

import { useState, useEffect } from 'react';
import { generateRepositoryImages } from '../lib/image-generator';

const PersonalizedRepositoryCard = ({ repository, analysis = null, visitorType = 'general' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [personalizedContent, setPersonalizedContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalizedContent();
  }, [repository, visitorType]);

  const loadPersonalizedContent = async () => {
    try {
      setLoading(true);
      
      // Generate images
      const generatedImages = generateRepositoryImages(repository);
      setImages(generatedImages);
      
      // Generate personalized content
      const content = await generatePersonalizedContent(repository, visitorType, analysis);
      setPersonalizedContent(content);
      
    } catch (error) {
      console.error('Failed to load personalized content:', error);
      setPersonalizedContent(getFallbackContent(repository, visitorType));
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedContent = async (repo, type, analysis) => {
    // This would normally call the backend personalization engine
    // For now, we'll generate content based on visitor type
    return generateContentByType(repo, type, analysis);
  };

  const generateContentByType = (repo, type, analysis) => {
    const configs = {
      business: {
        description: `A professional ${repo.language || 'software'} solution designed for scalability and business impact. This project demonstrates strong technical execution with ${repo.stars} community endorsements.`,
        focus: "Business Value & ROI",
        highlights: [
          "Production-ready solution",
          "Scalable architecture", 
          "Community validation",
          "Technical excellence"
        ],
        recommendations: [
          "Consider enterprise deployment",
          "Evaluate market expansion opportunities",
          "Assess integration capabilities"
        ]
      },
      hr: {
        description: `This project showcases strong ${repo.language || 'technical'} skills and collaborative development practices. With ${repo.forks} community contributions, it demonstrates excellent teamwork and code quality.`,
        focus: "Skills & Collaboration",
        highlights: [
          "Team collaboration skills",
          "Code quality standards",
          "Community engagement",
          "Professional development"
        ],
        recommendations: [
          "Strong technical communication",
          "Excellent code documentation",
          "Active community participation"
        ]
      },
      technical: {
        description: `A well-architected ${repo.language || 'software'} project featuring modern development practices. Technical analysis shows ${analysis?.overall_score?.toFixed(1) || 'high'} quality score with focus on maintainability and performance.`,
        focus: "Technical Excellence",
        highlights: [
          "Modern architecture",
          "Best practices implementation",
          "Performance optimization",
          "Code maintainability"
        ],
        recommendations: [
          "Consider microservices architecture",
          "Implement comprehensive testing",
          "Add performance monitoring"
        ]
      },
      general: {
        description: `An innovative ${repo.language || 'software'} project that creates real-world impact. This solution demonstrates creativity and technical skill while maintaining user-friendly design principles.`,
        focus: "Innovation & Impact",
        highlights: [
          "User-friendly design",
          "Innovative approach",
          "Community impact",
          "Accessible technology"
        ],
        recommendations: [
          "Great user experience focus",
          "Innovative problem solving",
          "Community-driven development"
        ]
      }
    };

    return configs[type] || configs.general;
  };

  const getFallbackContent = (repo, type) => {
    return {
      description: repo.description || 'A professional software project',
      focus: 'Project Overview',
      highlights: ['Professional development', 'Quality implementation'],
      recommendations: ['Continue development', 'Maintain quality standards']
    };
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getVisitorTypeColor = (type) => {
    const colors = {
      business: 'border-blue-500 bg-blue-50',
      hr: 'border-green-500 bg-green-50',
      technical: 'border-purple-500 bg-purple-50',
      general: 'border-orange-500 bg-orange-50'
    };
    return colors[type] || colors.general;
  };

  const getVisitorTypeIcon = (type) => {
    const icons = {
      business: '💼',
      hr: '👥',
      technical: '⚙️',
      general: '👋'
    };
    return icons[type] || icons.general;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${getVisitorTypeColor(visitorType)}`}>
      
      {/* Visitor Type Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getVisitorTypeColor(visitorType)}`}>
          {getVisitorTypeIcon(visitorType)} {visitorType.charAt(0).toUpperCase() + visitorType.slice(1)} View
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
        {images.length > 0 && (
          <>
            <img
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alt}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Repository Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {repository.name}
          </h3>
          <div className="flex space-x-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
              ⭐ {repository.stars}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              🍴 {repository.forks}
            </span>
          </div>
        </div>

        {/* Personalized Description */}
        {personalizedContent && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Focus: {personalizedContent.focus}</div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {personalizedContent.description}
            </p>
          </div>
        )}

        {/* Language and Topics */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {repository.language && (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {repository.language}
              </span>
            )}
            {repository.topics.slice(0, 2).map((topic) => (
              <span key={topic} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {topic}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {new Date(repository.updated_at).toLocaleDateString()}
          </span>
        </div>

        {/* Personalized Highlights */}
        {personalizedContent && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Key Highlights:</div>
            <div className="flex flex-wrap gap-1">
              {personalizedContent.highlights.slice(0, 3).map((highlight, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Scores */}
        {analysis && (
          <div className="border-t pt-4 mb-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className={`text-lg font-bold ${getScoreColor(analysis.technical_score)}`}>
                  {analysis.technical_score.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">Technical</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${getScoreColor(analysis.quality_score)}`}>
                  {analysis.quality_score.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">Quality</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${getScoreColor(analysis.activity_score)}`}>
                  {analysis.activity_score.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">Activity</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            View on GitHub
          </a>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            Deep Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRepositoryCard;
