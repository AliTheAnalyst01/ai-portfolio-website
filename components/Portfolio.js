'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Video, 
  BarChart3, 
  Users, 
  Star, 
  GitBranch,
  Code,
  Target,
  Zap,
  Award,
  Globe,
  TrendingUp,
  Filter,
  Search,
  Grid,
  List,
  Play,
  Download,
  Brain,
  Database,
  Cpu,
  CheckCircle,
  Github
} from 'lucide-react';
// import { portfolioAI } from '@/lib/ai-agent';
import VideoGenerator from './VideoGenerator';
import AnalyticsDashboard from './AnalyticsDashboard';
import VisitorPersonalization from './VisitorPersonalization';
import LoadingSpinner from './LoadingSpinner';
import EnhancedProjectCard from './EnhancedProjectCard';
import GitHubIntegration from './GitHubIntegration';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, 3d
  const [activeTab, setActiveTab] = useState('projects'); // projects, analytics, videos, personalization
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('priority'); // priority, stars, forks, recent
  const [isLoading, setIsLoading] = useState(true);
  const [visitorType, setVisitorType] = useState('general');
  const [generatedVideos, setGeneratedVideos] = useState({});
  const [showContactForm, setShowContactForm] = useState(false);

  // Handle repositories fetched from GitHub
  const handleRepositoriesFetched = (repositories) => {
    setProjects(repositories);
    setFilteredProjects(repositories);
  };

  // Initialize with empty projects - will be populated by GitHub integration
  const [initialProjects] = useState([]);

  useEffect(() => {
    // Portfolio will be initialized by GitHub integration
    setIsLoading(false);
  }, []);

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             project.analysis?.projectCategory === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return b.priority - a.priority;
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'recent':
          return new Date(b.updated_at) - new Date(a.updated_at);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, sortBy]);

  // Handle video generation
  const handleVideoGenerated = (projectId, videoUrl) => {
    setGeneratedVideos(prev => ({
      ...prev,
      [projectId]: videoUrl
    }));
  };

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(p => p.analysis?.projectCategory).filter(Boolean))];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section - Sales Pitch */}
      <HeroSection />
      
      {/* Header */}
      <Header 
        projects={projects}
        visitorType={visitorType}
        setVisitorType={setVisitorType}
      />
      
      {/* Navigation Tabs */}
      <NavigationTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectCount={projects.length}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              data-section="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Value Proposition */}
              <ValueProposition />

              {/* Search and Filters */}
              <SearchAndFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {/* GitHub Integration */}
              <div className="mb-8">
                <GitHubIntegration onRepositoriesFetched={handleRepositoriesFetched} />
              </div>

              {/* Projects Display */}
              <ProjectsDisplay
                projects={filteredProjects}
                viewMode={viewMode}
                onProjectSelect={setSelectedProject}
                generatedVideos={generatedVideos}
              />

              {/* Call to Action */}
              <CallToAction />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnalyticsDashboard 
                projects={projects}
                visitorType={visitorType}
              />
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VideoGenerator 
                selectedProject={selectedProject}
                onVideoGenerated={handleVideoGenerated}
              />
            </motion.div>
          )}

          {activeTab === 'personalization' && (
            <motion.div
              key="personalization"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VisitorPersonalization 
                visitorType={visitorType}
                setVisitorType={setVisitorType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Project Details Modal */}
      <ProjectModal 
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
        generatedVideos={generatedVideos}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Header Component
function Header({ projects, visitorType, setVisitorType }) {
  const totalStars = projects.reduce((sum, p) => sum + p.stargazers_count, 0);
  const totalForks = projects.reduce((sum, p) => sum + p.forks_count, 0);

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Syed Faizan</h1>
              <p className="text-sm text-gray-300">AI Engineer & Data Scientist</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Contact Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/AliTheAnalyst01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/syed-ali-faizan-5131bb194"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="mailto:faizanzaidy78@gmail.com"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </a>
            </div>

            {/* Portfolio Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4" />
                <span>{totalStars}</span>
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <GitBranch className="w-4 h-4" />
                <span>{totalForks}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Code className="w-4 h-4" />
                <span>{projects.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Navigation Tabs Component
function NavigationTabs({ activeTab, setActiveTab, projectCount }) {
  const tabs = [
    { id: 'projects', label: 'Projects', icon: <Code className="w-4 h-4" />, count: projectCount },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'personalization', label: 'Personalization', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
                             className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                 activeTab === tab.id
                   ? 'text-blue-400 border-b-2 border-blue-400'
                   : 'text-gray-300 hover:text-white'
               }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count && (
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Search and Filters Component
function SearchAndFilters({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy, 
  categories, 
  viewMode, 
  setViewMode 
}) {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                             className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Category Filter */}
                     <select
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
             className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
           >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.replace('-', ' ')}
              </option>
            ))}
          </select>

          {/* Sort By */}
                     <select
             value={sortBy}
             onChange={(e) => setSortBy(e.target.value)}
             className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
           >
            <option value="priority">Priority</option>
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
            <option value="recent">Recent</option>
          </select>

          {/* View Mode */}
                     <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Display Component
function ProjectsDisplay({ projects, viewMode, onProjectSelect, generatedVideos }) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => onProjectSelect(project)}
            hasVideo={!!generatedVideos[project.id]}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectListItem 
          key={project.id} 
          project={project} 
          onClick={() => onProjectSelect(project)}
          hasVideo={!!generatedVideos[project.id]}
        />
      ))}
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, onClick, hasVideo }) {
  const { analysis, colorScheme, icon } = project;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
              className="card cursor-pointer group hover:border-blue-500 transition-all duration-300"
        style={{
          borderColor: hasVideo ? colorScheme?.[0] : undefined,
          borderWidth: hasVideo ? '2px' : '1px'
        }}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: colorScheme?.[0] + '20' }}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-400">{analysis?.projectCategory?.replace('-', ' ')}</p>
          </div>
        </div>
        
        {hasVideo && (
          <div className="flex items-center gap-1 text-blue-400">
            <Video className="w-4 h-4" />
            <span className="text-xs">Video</span>
          </div>
        )}
      </div>
      
      {/* Project Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>
      
      {/* Project Stats */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3 h-3" />
            {project.stargazers_count}
          </span>
          <span className="flex items-center gap-1 text-green-400">
            <GitBranch className="w-3 h-3" />
            {project.forks_count}
          </span>
        </div>
        <span className="text-gray-400">{project.language}</span>
      </div>
      
      {/* AI Analysis Scores */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-xs text-gray-400">Complexity</div>
          <div className="text-sm font-semibold text-blue-400">
            {analysis?.complexityScore}/10
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Priority</div>
          <div className="text-sm font-semibold text-purple-400">
            {analysis?.priority}/10
          </div>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {analysis?.tags?.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Project List Item Component
function ProjectListItem({ project, onClick, hasVideo }) {
  const { analysis, colorScheme, icon } = project;

  return (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="card cursor-pointer group hover:border-blue-500 transition-all duration-300 flex items-center gap-4"
      style={{
        borderColor: hasVideo ? colorScheme?.[0] : undefined,
        borderWidth: hasVideo ? '2px' : '1px'
      }}
    >
      {/* Project Icon */}
      <div 
        className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
        style={{ backgroundColor: colorScheme?.[0] + '20' }}
      >
        {icon}
      </div>
      
      {/* Project Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
            {project.name}
          </h3>
          {hasVideo && (
            <div className="flex items-center gap-1 text-blue-400">
              <Video className="w-4 h-4" />
              <span className="text-xs">Video</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-2">
          {project.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {project.stargazers_count} stars
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            {project.forks_count} forks
          </span>
          <span>{project.language}</span>
          <span>{analysis?.projectCategory?.replace('-', ' ')}</span>
        </div>
      </div>
      
      {/* Scores */}
      <div className="text-right flex-shrink-0">
        <div className="text-sm text-gray-400 mb-1">Priority</div>
        <div className="text-2xl font-bold text-blue-400">
          {analysis?.priority}
        </div>
        <div className="text-xs text-gray-500">/10</div>
      </div>
    </motion.div>
  );
}

// Project Modal Component
function ProjectModal({ selectedProject, onClose, generatedVideos }) {
  if (!selectedProject) return null;

  const { analysis, colorScheme, icon } = selectedProject;
  const hasVideo = !!generatedVideos[selectedProject.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                 className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-700">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: colorScheme?.[0] + '20' }}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
              <p className="text-secondary-300">{selectedProject.description}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
                         className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-2xl text-gray-400 hover:text-white">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Project Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                               <div className="bg-gray-700 rounded-lg p-3">
                 <div className="text-sm text-gray-400">Language</div>
                 <div className="font-medium text-white">{selectedProject.language}</div>
               </div>
                                 <div className="bg-gray-700 rounded-lg p-3">
                   <div className="text-sm text-gray-400">Category</div>
                   <div className="font-medium text-white capitalize">
                     {analysis?.projectCategory?.replace('-', ' ')}
                   </div>
                 </div>
                                 <div className="bg-gray-700 rounded-lg p-3">
                   <div className="text-sm text-gray-400">Stars</div>
                   <div className="font-medium text-white">{selectedProject.stargazers_count}</div>
               </div>
                                 <div className="bg-gray-700 rounded-lg p-3">
                   <div className="text-sm text-gray-400">Forks</div>
                   <div className="font-medium text-white">{selectedProject.forks_count}</div>
                 </div>
              </div>
              
                             <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">AI Analysis</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Complexity:</span>
                    <span className="text-blue-400 ml-2">{analysis?.complexityScore}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Priority:</span>
                    <span className="text-purple-400 ml-2">{analysis?.priority}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Innovation:</span>
                    <span className="text-green-400 ml-2">{analysis?.innovationScore}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Maintainability:</span>
                    <span className="text-orange-400 ml-2">{analysis?.maintainabilityScore}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Project Showcase</h3>
              
              {hasVideo ? (
                <div className="bg-black rounded-lg overflow-hidden">
                  <video
                    src={generatedVideos[selectedProject.id]}
                    controls
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                                 <div className="bg-gray-700 rounded-lg p-8 text-center">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No video generated yet</p>
                  <p className="text-sm text-gray-500">
                    Go to the Videos tab to create an AI-generated showcase video
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <a
                  href={selectedProject.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  View on GitHub
                </a>
                {hasVideo && (
                  <button className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Video
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Hero Section - Sales Pitch
function HeroSection() {
  const handleViewWork = () => {
    // Scroll to projects section
    const projectsSection = document.querySelector('[data-section="projects"]');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetInTouch = () => {
    // Open email client with pre-filled message
    const subject = encodeURIComponent('AI Engineering & Data Science Project Inquiry');
    const body = encodeURIComponent(`Hi Syed Faizan,

I'm interested in discussing a potential AI/Data Science project with you. 

Project Details:
- Project Type: 
- Timeline: 
- Budget Range: 
- Description: 

Please let me know your availability for a call.

Best regards,
[Your Name]`);
    
    window.open(`mailto:faizanzaidy78@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Syed Faizan
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            AI Engineer & Data Scientist
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transforming businesses with cutting-edge AI solutions. 
            I build intelligent systems that drive real results and competitive advantage.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300">Machine Learning</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300">Data Science</span>
            </div>
            <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2">
              <Cpu className="w-5 h-5 text-green-400" />
              <span className="text-green-300">AI Engineering</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleViewWork}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              View My Work
            </button>
            <button 
              onClick={handleGetInTouch}
              className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
            >
              Get In Touch
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Value Proposition Component
function ValueProposition() {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-8 border border-gray-600">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Results-Driven</h3>
          <p className="text-gray-300">
            I don't just build AI systems—I deliver measurable business outcomes. 
            Every project is designed to solve real problems and drive ROI.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Cutting-Edge Tech</h3>
          <p className="text-gray-300">
            Leveraging the latest AI/ML technologies including TensorFlow, PyTorch, 
            and advanced NLP to create innovative solutions that give you the edge.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Proven Expertise</h3>
          <p className="text-gray-300">
            With years of experience in AI engineering and data science, 
            I bring deep technical knowledge and practical implementation skills.
          </p>
        </div>
      </div>
    </div>
  );
}

// Call to Action Component
function CallToAction() {
  const handleStartProject = () => {
    // Open project inquiry form
    const subject = encodeURIComponent('New AI Project Request');
    const body = encodeURIComponent(`Hi Syed Faizan,

I'd like to start a new AI/Data Science project with you.

Project Requirements:
- Project Type: [AI/ML, Data Analysis, Computer Vision, NLP, etc.]
- Timeline: [Expected completion date]
- Budget: [Budget range]
- Description: [Detailed project description]
- Current Challenges: [What problems are you trying to solve?]
- Expected Outcomes: [What results are you looking for?]

Please provide:
1. Initial consultation availability
2. Project timeline estimate
3. Cost breakdown
4. Technical approach

Looking forward to working with you!

Best regards,
[Your Name]
[Company/Organization]
[Contact Number]`);
    
    window.open(`mailto:faizanzaidy78@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleScheduleCall = () => {
    // Open calendar scheduling
    const subject = encodeURIComponent('Schedule AI Project Consultation Call');
    const body = encodeURIComponent(`Hi Syed Faizan,

I'd like to schedule a consultation call to discuss my AI/Data Science project.

Preferred Meeting Details:
- Date: [Your preferred date]
- Time: [Your preferred time]
- Duration: [30 min / 1 hour]
- Meeting Type: [Video call / Phone call]

Project Overview:
[Brief description of your project]

Please let me know your availability and preferred meeting platform.

Best regards,
[Your Name]
[Company/Organization]
[Contact Number]`);
    
    window.open(`mailto:faizanzaidy78@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8 border border-blue-500/30">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Business with AI?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Let's discuss how my AI engineering and data science expertise can help you 
          achieve your goals. From concept to deployment, I'm here to make it happen.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button 
            onClick={handleStartProject}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Start a Project
          </button>
          <button 
            onClick={handleScheduleCall}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Schedule a Call
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Free Consultation
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Fast Turnaround
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Ongoing Support
          </span>
        </div>
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-300">
          © 2024 Syed Faizan - AI Engineer & Data Scientist. Built with Next.js and AI.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Transforming businesses with intelligent AI solutions
        </p>
      </div>
    </footer>
  );
}
