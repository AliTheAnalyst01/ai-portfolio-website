// AI Agent for Portfolio Enhancement
export class PortfolioAI {
  constructor() {
    this.analysisCache = new Map();
    this.videoTemplates = this.getVideoTemplates();
  }

  // Analyze project and generate comprehensive insights
  async analyzeProject(projectData) {
    const cacheKey = `${projectData.id}-${projectData.updated_at}`;
    
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey);
    }

    const analysis = {
      // Technical Analysis
      technicalComplexity: this.assessTechnicalComplexity(projectData),
      complexityScore: this.calculateComplexityScore(projectData),
      maintainabilityScore: this.calculateMaintainabilityScore(projectData),
      scalabilityScore: this.calculateScalabilityScore(projectData),
      innovationScore: this.calculateInnovationScore(projectData),
      
      // Business Analysis
      businessValue: this.generateBusinessValue(projectData),
      projectCategory: this.categorizeProject(projectData),
      suitableAudience: this.identifySuitableAudience(projectData),
      
      // Content Generation
      highlights: this.generateHighlights(projectData),
      description: this.generateDescription(projectData),
      tags: this.generateTags(projectData),
      
      // Video Script
      videoScript: this.generateVideoScript(projectData),
      
      // Priority Assessment
      priority: this.calculatePriority(projectData),
      
      // Visual Elements
      colorScheme: this.generateColorScheme(projectData),
      icon: this.selectIcon(projectData),
      
      timestamp: new Date().toISOString()
    };

    this.analysisCache.set(cacheKey, analysis);
    return analysis;
  }

  // Assess technical complexity based on multiple factors
  assessTechnicalComplexity(project) {
    const factors = {
      languageComplexity: this.getLanguageComplexity(project.language),
      sizeComplexity: this.getSizeComplexity(project.size),
      dependencyComplexity: this.getDependencyComplexity(project.dependencies),
      architectureComplexity: this.getArchitectureComplexity(project.topics)
    };

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / Object.keys(factors).length;

    if (averageScore >= 8) return 'expert';
    if (averageScore >= 6) return 'advanced';
    if (averageScore >= 4) return 'intermediate';
    return 'beginner';
  }

  // Calculate complexity score (1-10)
  calculateComplexityScore(project) {
    const baseScore = 5;
    const adjustments = {
      language: this.getLanguageComplexity(project.language) - 5,
      size: this.getSizeComplexity(project.size) - 5,
      topics: this.getTopicComplexity(project.topics) - 5,
      forks: Math.min(project.forks_count / 10, 2),
      stars: Math.min(project.stargazers_count / 50, 2)
    };

    const totalAdjustment = Object.values(adjustments).reduce((sum, adj) => sum + adj, 0);
    return Math.max(1, Math.min(10, Math.round(baseScore + totalAdjustment)));
  }

  // Calculate maintainability score
  calculateMaintainabilityScore(project) {
    const factors = {
      documentation: project.has_wiki ? 2 : 0,
      issues: project.open_issues_count > 0 ? 2 : 0,
      recentActivity: this.getRecentActivityScore(project.updated_at),
      contributors: Math.min(project.contributors?.length || 1, 3),
      tests: this.hasTests(project.topics) ? 2 : 0
    };

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    return Math.max(1, Math.min(10, Math.round(totalScore + 3)));
  }

  // Calculate scalability score
  calculateScalabilityScore(project) {
    const factors = {
      architecture: this.getArchitectureScore(project.topics),
      performance: this.getPerformanceScore(project.topics),
      modularity: this.getModularityScore(project.topics),
      documentation: project.has_wiki ? 2 : 0
    };

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    return Math.max(1, Math.min(10, Math.round(totalScore + 2)));
  }

  // Calculate innovation score
  calculateInnovationScore(project) {
    const factors = {
      novelty: this.getNoveltyScore(project.topics),
      technology: this.getTechnologyScore(project.language),
      approach: this.getApproachScore(project.description),
      impact: Math.min(project.stargazers_count / 100, 3)
    };

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    return Math.max(1, Math.min(10, Math.round(totalScore + 2)));
  }

  // Generate business value description
  generateBusinessValue(project) {
    const templates = [
      "This project demonstrates {skill} capabilities with {impact} potential, showcasing {strength} in {domain}.",
      "A {type} solution that addresses {problem} through {approach}, resulting in {benefit}.",
      "Innovative {category} project that leverages {technology} to deliver {value} for {audience}."
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return template
      .replace('{skill}', this.getSkillDescription(project.language))
      .replace('{impact}', this.getImpactDescription(project.stargazers_count))
      .replace('{strength}', this.getStrengthDescription(project.topics))
      .replace('{domain}', this.getDomainDescription(project.topics))
      .replace('{type}', this.getTypeDescription(project.topics))
      .replace('{problem}', this.getProblemDescription(project.description))
      .replace('{approach}', this.getApproachDescription(project.topics))
      .replace('{benefit}', this.getBenefitDescription(project.topics))
      .replace('{category}', this.getCategoryDescription(project.topics))
      .replace('{technology}', project.language || 'modern technologies')
      .replace('{value}', this.getValueDescription(project.topics))
      .replace('{audience}', this.getAudienceDescription(project.topics));
  }

  // Categorize project based on topics and description
  categorizeProject(project) {
    const categories = {
      'web-development': ['web', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular'],
      'mobile-development': ['mobile', 'ios', 'android', 'react-native', 'flutter'],
      'ai-ml': ['ai', 'machine-learning', 'ml', 'neural', 'deep-learning', 'nlp'],
      'backend': ['api', 'server', 'database', 'backend', 'microservices'],
      'frontend': ['ui', 'ux', 'frontend', 'design', 'css', 'html'],
      'full-stack': ['fullstack', 'full-stack', 'web', 'api'],
      'data-science': ['data', 'analytics', 'visualization', 'statistics'],
      'devops': ['devops', 'ci-cd', 'docker', 'kubernetes', 'infrastructure'],
      'game-development': ['game', 'gaming', 'unity', 'unreal', '3d'],
      'other': []
    };

    const projectText = `${project.description || ''} ${(project.topics || []).join(' ')}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => projectText.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  }

  // Identify suitable audience for the project
  identifySuitableAudience(project) {
    const audiences = [];
    const category = this.categorizeProject(project);
    const complexity = this.assessTechnicalComplexity(project);

    // Technical audiences
    if (complexity === 'expert') audiences.push('senior-developers', 'tech-leads', 'architects');
    if (complexity === 'advanced') audiences.push('mid-level-developers', 'senior-developers');
    if (complexity === 'intermediate') audiences.push('junior-developers', 'mid-level-developers');
    if (complexity === 'beginner') audiences.push('junior-developers', 'students');

    // Business audiences
    if (project.stargazers_count > 100) audiences.push('business-stakeholders', 'product-managers');
    if (category === 'ai-ml') audiences.push('data-scientists', 'researchers');
    if (category === 'web-development') audiences.push('startups', 'enterprises');

    return [...new Set(audiences)];
  }

  // Generate project highlights
  generateHighlights(project) {
    const highlights = {
      keyFeatures: this.extractKeyFeatures(project),
      technicalAchievements: this.extractTechnicalAchievements(project),
      businessImpact: this.extractBusinessImpact(project),
      innovationPoints: this.extractInnovationPoints(project)
    };

    return highlights;
  }

  // Generate enhanced description
  generateDescription(project) {
    const baseDescription = project.description || 'A well-crafted software project';
    const enhancements = [
      `Built with ${project.language || 'modern technologies'}`,
      `Achieved ${project.stargazers_count} stars on GitHub`,
      `Features ${project.forks_count} forks and active community`,
      `Demonstrates ${this.assessTechnicalComplexity(project)} level expertise`
    ];

    return `${baseDescription}. ${enhancements.join('. ')}.`;
  }

  // Generate relevant tags
  generateTags(project) {
    const tags = new Set();
    
    // Language tags
    if (project.language) tags.add(project.language);
    
    // Topic tags
    if (project.topics) {
      project.topics.forEach(topic => tags.add(topic));
    }
    
    // Category tags
    const category = this.categorizeProject(project);
    tags.add(category.replace('-', ' '));
    
    // Complexity tags
    const complexity = this.assessTechnicalComplexity(project);
    tags.add(complexity);
    
    // Impact tags
    if (project.stargazers_count > 100) tags.add('popular');
    if (project.forks_count > 10) tags.add('community');
    if (project.open_issues_count > 0) tags.add('active');
    
    return Array.from(tags).slice(0, 8);
  }

  // Generate video script for project showcase
  generateVideoScript(project) {
    const analysis = this.analyzeProject(project);
    
    return {
      intro: `Welcome to ${project.name}, a ${analysis.technicalComplexity} level ${this.categorizeProject(project)} project.`,
      overview: `This project demonstrates ${analysis.highlights.keyFeatures.join(', ')} with a focus on ${analysis.businessValue}.`,
      technical: `Built using ${project.language}, it showcases ${analysis.highlights.technicalAchievements.join(', ')}.`,
      impact: `With ${project.stargazers_count} stars and ${project.forks_count} forks, this project has made a significant impact in the ${this.categorizeProject(project)} community.`,
      conclusion: `This project represents ${analysis.innovationScore}/10 innovation and ${analysis.complexityScore}/10 technical complexity, making it suitable for ${analysis.suitableAudience.join(', ')}.`
    };
  }

  // Calculate overall project priority
  calculatePriority(project) {
    const factors = {
      stars: Math.min(project.stargazers_count / 20, 3),
      forks: Math.min(project.forks_count / 5, 2),
      activity: this.getRecentActivityScore(project.updated_at),
      complexity: this.calculateComplexityScore(project) / 2,
      innovation: this.calculateInnovationScore(project) / 2
    };

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    return Math.max(1, Math.min(10, Math.round(totalScore)));
  }

  // Generate color scheme based on project characteristics
  generateColorScheme(project) {
    const schemes = {
      'web-development': ['#3b82f6', '#1d4ed8', '#60a5fa'],
      'mobile-development': ['#10b981', '#059669', '#34d399'],
      'ai-ml': ['#8b5cf6', '#7c3aed', '#a78bfa'],
      'backend': ['#f59e0b', '#d97706', '#fbbf24'],
      'frontend': ['#06b6d4', '#0891b2', '#22d3ee'],
      'data-science': ['#84cc16', '#65a30d', '#a3e635'],
      'devops': ['#f97316', '#ea580c', '#fb923c'],
      'game-development': ['#ef4444', '#dc2626', '#f87171'],
      'other': ['#6b7280', '#4b5563', '#9ca3af']
    };

    const category = this.categorizeProject(project);
    return schemes[category] || schemes.other;
  }

  // Select appropriate icon for project
  selectIcon(project) {
    const icons = {
      'web-development': '🌐',
      'mobile-development': '📱',
      'ai-ml': '🤖',
      'backend': '⚙️',
      'frontend': '🎨',
      'data-science': '📊',
      'devops': '🚀',
      'game-development': '🎮',
      'other': '💻'
    };

    const category = this.categorizeProject(project);
    return icons[category] || icons.other;
  }

  // Helper methods for scoring
  getLanguageComplexity(language) {
    const complexityMap = {
      'Assembly': 10, 'C++': 9, 'Rust': 9, 'Go': 8,
      'Java': 7, 'C#': 7, 'Python': 6, 'JavaScript': 5,
      'TypeScript': 6, 'PHP': 4, 'HTML': 2, 'CSS': 3
    };
    return complexityMap[language] || 5;
  }

  getSizeComplexity(size) {
    if (size > 1000000) return 10;
    if (size > 100000) return 8;
    if (size > 10000) return 6;
    if (size > 1000) return 4;
    return 2;
  }

  getDependencyComplexity(dependencies) {
    if (!dependencies) return 5;
    if (dependencies.length > 50) return 10;
    if (dependencies.length > 20) return 8;
    if (dependencies.length > 10) return 6;
    if (dependencies.length > 5) return 4;
    return 2;
  }

  getArchitectureComplexity(topics) {
    if (!topics) return 5;
    const architectureKeywords = ['microservices', 'distributed', 'scalable', 'enterprise'];
    const matches = topics.filter(topic => architectureKeywords.includes(topic));
    return Math.min(5 + matches.length * 2, 10);
  }

  getTopicComplexity(topics) {
    if (!topics) return 5;
    const advancedTopics = ['ai', 'ml', 'blockchain', 'quantum', 'distributed'];
    const matches = topics.filter(topic => advancedTopics.includes(topic));
    return Math.min(5 + matches.length * 2, 10);
  }

  getRecentActivityScore(updatedAt) {
    const daysSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) return 3;
    if (daysSinceUpdate < 30) return 2;
    if (daysSinceUpdate < 90) return 1;
    return 0;
  }

  hasTests(topics) {
    if (!topics) return false;
    const testKeywords = ['test', 'testing', 'tdd', 'bdd', 'jest', 'mocha'];
    return topics.some(topic => testKeywords.includes(topic));
  }

  getArchitectureScore(topics) {
    if (!topics) return 5;
    const architectureKeywords = ['microservices', 'distributed', 'scalable', 'enterprise', 'clean-architecture'];
    const matches = topics.filter(topic => architectureKeywords.includes(topic));
    return Math.min(5 + matches.length * 2, 10);
  }

  getPerformanceScore(topics) {
    if (!topics) return 5;
    const performanceKeywords = ['performance', 'optimization', 'caching', 'load-balancing'];
    const matches = topics.filter(topic => performanceKeywords.includes(topic));
    return Math.min(5 + matches.length * 2, 10);
  }

  getModularityScore(topics) {
    if (!topics) return 5;
    const modularityKeywords = ['modular', 'plugin', 'extensible', 'component-based'];
    const matches = topics.filter(topic => modularityKeywords.includes(topic));
    return Math.min(5 + matches.length * 2, 10);
  }

  getNoveltyScore(topics) {
    if (!topics) return 5;
    const noveltyKeywords = ['innovative', 'novel', 'experimental', 'research', 'cutting-edge'];
    const matches = topics.filter(topic => noveltyKeywords.includes(topic));
    return Math.min(5 + matches.length * 2, 10);
  }

  getTechnologyScore(language) {
    const modernLanguages = ['Rust', 'Go', 'TypeScript', 'Kotlin', 'Swift'];
    return modernLanguages.includes(language) ? 8 : 5;
  }

  getApproachScore(description) {
    if (!description) return 5;
    const approachKeywords = ['novel', 'innovative', 'unique', 'revolutionary', 'breakthrough'];
    const matches = approachKeywords.filter(keyword => description.toLowerCase().includes(keyword));
    return Math.min(5 + matches.length * 2, 10);
  }

  // Helper methods for content generation
  getSkillDescription(language) {
    const skillMap = {
      'JavaScript': 'modern JavaScript',
      'TypeScript': 'TypeScript and type safety',
      'Python': 'Python programming',
      'Java': 'Java development',
      'C++': 'C++ programming',
      'Rust': 'Rust systems programming',
      'Go': 'Go development'
    };
    return skillMap[language] || 'software development';
  }

  getImpactDescription(stars) {
    if (stars > 1000) return 'significant industry impact';
    if (stars > 100) return 'notable community impact';
    if (stars > 10) return 'growing community interest';
    return 'emerging potential';
  }

  getStrengthDescription(topics) {
    if (!topics) return 'technical expertise';
    const strengths = topics.slice(0, 3).join(', ');
    return strengths || 'technical expertise';
  }

  getDomainDescription(topics) {
    if (!topics) return 'software development';
    const domains = ['web development', 'mobile development', 'data science', 'AI/ML', 'backend systems'];
    const matches = domains.filter(domain => topics.some(topic => domain.includes(topic)));
    return matches[0] || 'software development';
  }

  getTypeDescription(topics) {
    if (!topics) return 'software solution';
    if (topics.includes('api')) return 'API solution';
    if (topics.includes('library')) return 'library';
    if (topics.includes('framework')) return 'framework';
    if (topics.includes('tool')) return 'development tool';
    return 'software solution';
  }

  getProblemDescription(description) {
    if (!description) return 'common development challenges';
    return description.split(' ').slice(0, 5).join(' ') + '...';
  }

  getApproachDescription(topics) {
    if (!topics) return 'modern development practices';
    const approaches = topics.filter(topic => 
      ['clean-architecture', 'tdd', 'bdd', 'agile', 'devops'].includes(topic)
    );
    return approaches.length > 0 ? approaches.join(', ') : 'modern development practices';
  }

  getBenefitDescription(topics) {
    if (!topics) return 'improved development experience';
    const benefits = topics.filter(topic => 
      ['performance', 'scalability', 'maintainability', 'security'].includes(topic)
    );
    return benefits.length > 0 ? benefits.join(', ') : 'improved development experience';
  }

  getCategoryDescription(topics) {
    if (!topics) return 'software development';
    const category = this.categorizeProject({ topics });
    return category.replace('-', ' ');
  }

  getValueDescription(topics) {
    if (!topics) return 'value to developers';
    const values = topics.filter(topic => 
      ['productivity', 'efficiency', 'quality', 'innovation'].includes(topic)
    );
    return values.length > 0 ? values.join(', ') : 'value to developers';
  }

  getAudienceDescription(topics) {
    if (!topics) return 'developers';
    const audiences = topics.filter(topic => 
      ['enterprise', 'startup', 'developer', 'researcher'].includes(topic)
    );
    return audiences.length > 0 ? audiences.join(', ') : 'developers';
  }

  // Extract specific content for highlights
  extractKeyFeatures(project) {
    const features = [];
    if (project.language) features.push(`${project.language} implementation`);
    if (project.topics) features.push(...project.topics.slice(0, 3));
    if (project.has_wiki) features.push('comprehensive documentation');
    if (project.open_issues_count > 0) features.push('active maintenance');
    return features.length > 0 ? features : ['modern architecture', 'clean code', 'best practices'];
  }

  extractTechnicalAchievements(project) {
    const achievements = [];
    if (project.stargazers_count > 50) achievements.push('community recognition');
    if (project.forks_count > 10) achievements.push('active collaboration');
    if (project.language) achievements.push(`${project.language} expertise`);
    if (project.size > 10000) achievements.push('substantial codebase');
    return achievements.length > 0 ? achievements : ['technical excellence', 'code quality', 'architecture design'];
  }

  extractBusinessImpact(project) {
    const impacts = [];
    if (project.stargazers_count > 100) impacts.push('high community adoption');
    if (project.forks_count > 20) impacts.push('widespread usage');
    if (project.open_issues_count > 0) impacts.push('ongoing development');
    return impacts.length > 0 ? impacts : ['business value', 'market relevance', 'scalability'];
  }

  extractInnovationPoints(project) {
    const innovations = [];
    if (project.topics) {
      const innovativeTopics = project.topics.filter(topic => 
        ['ai', 'ml', 'blockchain', 'quantum', 'experimental'].includes(topic)
      );
      innovations.push(...innovativeTopics);
    }
    if (project.description && project.description.includes('novel')) innovations.push('novel approach');
    if (project.description && project.description.includes('innovative')) innovations.push('innovative solution');
    return innovations.length > 0 ? innovations : ['creative problem-solving', 'modern technologies', 'best practices'];
  }

  // Get video templates for different project types
  getVideoTemplates() {
    return {
      'web-development': {
        style: 'modern-web',
        transitions: ['slide', 'fade', 'zoom'],
        music: 'upbeat-tech',
        duration: '30-45 seconds'
      },
      'mobile-development': {
        style: 'mobile-app',
        transitions: ['swipe', 'slide', 'bounce'],
        music: 'mobile-friendly',
        duration: '25-40 seconds'
      },
      'ai-ml': {
        style: 'futuristic',
        transitions: ['matrix', 'glow', 'particle'],
        music: 'sci-fi-tech',
        duration: '35-50 seconds'
      },
      'backend': {
        style: 'professional',
        transitions: ['fade', 'slide', 'grow'],
        music: 'corporate-tech',
        duration: '30-45 seconds'
      }
    };
  }
}

// Export singleton instance
export const portfolioAI = new PortfolioAI();



