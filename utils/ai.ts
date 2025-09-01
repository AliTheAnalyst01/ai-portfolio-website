import OpenAI from 'openai';
import { Project, AIAnalysis, VisitorData, VisitorType, PersonalizationConfig } from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze a project using AI to generate insights
 */
export async function analyzeProject(project: Project): Promise<AIAnalysis> {
  try {
    const prompt = generateAnalysisPrompt(project);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert software engineer and project analyst. Analyze the given GitHub repository and provide detailed insights in the following JSON format:
          {
            "codeQualityScore": number (1-10),
            "technicalComplexity": "low" | "medium" | "high",
            "businessValue": "string describing business impact",
            "keyStrengths": ["array", "of", "key", "strengths"],
            "primaryTechnologies": ["array", "of", "technologies"],
            "projectCategory": "web-development" | "mobile-development" | "ai-ml" | "backend" | "frontend" | "full-stack" | "data-science" | "devops" | "game-development" | "other",
            "suitableAudience": ["hr" | "business" | "technical" | "general"],
            "complexityScore": number (1-10),
            "maintainabilityScore": number (1-10),
            "scalabilityScore": number (1-10),
            "innovationScore": number (1-10)
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const analysis = JSON.parse(content) as AIAnalysis;
    
    // Validate and sanitize the response
    return validateAndSanitizeAnalysis(analysis);
  } catch (error) {
    console.error('Error analyzing project with AI:', error);
    // Return default analysis if AI fails
    return generateDefaultAnalysis(project);
  }
}

/**
 * Generate analysis prompt for AI
 */
function generateAnalysisPrompt(project: Project): string {
  const { repository, metrics, highlights } = project;
  
  return `Analyze this GitHub repository:

Repository: ${repository.name}
Description: ${repository.description || 'No description'}
Language: ${repository.language || 'Multiple languages'}
Stars: ${repository.stargazers_count}
Forks: ${repository.forks_count}
Size: ${metrics.linesOfCode} bytes
Languages: ${metrics.languages.map(l => `${l.name} (${l.percentage.toFixed(1)}%)`).join(', ')}
Contributors: ${metrics.contributors.length}
Pull Requests: ${metrics.pullRequests.length}
Issues: ${metrics.issues.length}
Commit Frequency: ${metrics.commitFrequency.toFixed(2)} per month
Topics: ${repository.topics.join(', ')}
Created: ${repository.created_at}
Last Updated: ${repository.updated_at}

Key Features: ${highlights.keyFeatures.join(', ')}
Achievements: ${highlights.achievements.join(', ')}

Please provide a comprehensive analysis focusing on:
1. Code quality and technical excellence
2. Business value and real-world impact
3. Technical complexity and innovation
4. Suitable audience types
5. Project categorization

Respond only with valid JSON in the specified format.`;
}

/**
 * Validate and sanitize AI analysis response
 */
function validateAndSanitizeAnalysis(analysis: any): AIAnalysis {
  const defaultAnalysis = {
    codeQualityScore: 5,
    technicalComplexity: 'medium' as const,
    businessValue: 'Demonstrates technical skills and project management',
    keyStrengths: ['Code organization', 'Documentation'],
    primaryTechnologies: ['Multiple technologies'],
    projectCategory: 'other' as const,
    suitableAudience: ['technical'] as VisitorType[],
    complexityScore: 5,
    maintainabilityScore: 5,
    scalabilityScore: 5,
    innovationScore: 5,
  };

  // Validate required fields and types
  if (typeof analysis.codeQualityScore !== 'number' || analysis.codeQualityScore < 1 || analysis.codeQualityScore > 10) {
    analysis.codeQualityScore = defaultAnalysis.codeQualityScore;
  }

  if (!['low', 'medium', 'high'].includes(analysis.technicalComplexity)) {
    analysis.technicalComplexity = defaultAnalysis.technicalComplexity;
  }

  if (typeof analysis.businessValue !== 'string') {
    analysis.businessValue = defaultAnalysis.businessValue;
  }

  if (!Array.isArray(analysis.keyStrengths) || analysis.keyStrengths.length === 0) {
    analysis.keyStrengths = defaultAnalysis.keyStrengths;
  }

  if (!Array.isArray(analysis.primaryTechnologies) || analysis.primaryTechnologies.length === 0) {
    analysis.primaryTechnologies = defaultAnalysis.primaryTechnologies;
  }

  if (!['web-development', 'mobile-development', 'ai-ml', 'backend', 'frontend', 'full-stack', 'data-science', 'devops', 'game-development', 'other'].includes(analysis.projectCategory)) {
    analysis.projectCategory = defaultAnalysis.projectCategory;
  }

  if (!Array.isArray(analysis.suitableAudience) || analysis.suitableAudience.length === 0) {
    analysis.suitableAudience = defaultAnalysis.suitableAudience;
  }

  // Validate score fields
  ['complexityScore', 'maintainabilityScore', 'scalabilityScore', 'innovationScore'].forEach(field => {
    if (typeof analysis[field] !== 'number' || analysis[field] < 1 || analysis[field] > 10) {
      analysis[field] = 5;
    }
  });

  return analysis as AIAnalysis;
}

/**
 * Generate default analysis when AI fails
 */
function generateDefaultAnalysis(project: Project): AIAnalysis {
  const { repository, metrics } = project;
  
  // Simple heuristics for default analysis
  const complexityScore = Math.min(Math.max(metrics.linesOfCode / 1000, 1), 10);
  const maintainabilityScore = Math.min(Math.max(10 - metrics.issues.length / 10, 1), 10);
  const scalabilityScore = Math.min(Math.max(metrics.contributors.length * 2, 1), 10);
  const innovationScore = Math.min(Math.max(repository.stargazers_count / 5, 1), 10);

  return {
    codeQualityScore: Math.round((complexityScore + maintainabilityScore) / 2),
    technicalComplexity: complexityScore > 7 ? 'high' : complexityScore > 4 ? 'medium' : 'low',
    businessValue: 'Demonstrates technical expertise and project management skills',
    keyStrengths: ['Code organization', 'Collaboration', 'Problem solving'],
    primaryTechnologies: metrics.languages.map(l => l.name),
    projectCategory: 'other',
    suitableAudience: ['technical', 'general'],
    complexityScore: Math.round(complexityScore),
    maintainabilityScore: Math.round(maintainabilityScore),
    scalabilityScore: Math.round(scalabilityScore),
    innovationScore: Math.round(innovationScore),
  };
}

/**
 * Analyze visitor behavior and determine visitor type
 */
export async function analyzeVisitorBehavior(visitorData: VisitorData): Promise<VisitorType> {
  try {
    const prompt = generateVisitorAnalysisPrompt(visitorData);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert in user behavior analysis and personalization. Analyze the visitor data and determine their type. Respond with only one of these values: "hr", "business", "technical", or "general".`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 50,
    });

    const content = completion.choices[0]?.message?.content?.toLowerCase().trim();
    
    if (content && ['hr', 'business', 'technical', 'general'].includes(content)) {
      return content as VisitorType;
    }
    
    return 'general';
  } catch (error) {
    console.error('Error analyzing visitor behavior:', error);
    return 'general';
  }
}

/**
 * Generate visitor analysis prompt
 */
function generateVisitorAnalysisPrompt(visitorData: VisitorData): string {
  return `Analyze this visitor data and determine their type:

Interests: ${visitorData.interests.join(', ')}
Technical Level: ${visitorData.technicalLevel}
Focus Areas: ${visitorData.focusAreas.join(', ')}
Time Spent: ${visitorData.timeSpent} seconds
Sections Viewed: ${visitorData.sectionsViewed.join(', ')}
Interactions: ${visitorData.interactions.map(i => `${i.type} on ${i.target}`).join(', ')}

Visitor types:
- "hr": Human resources professionals, recruiters, hiring managers
- "business": Business stakeholders, product managers, executives
- "technical": Developers, engineers, technical leads
- "general": General visitors, students, casual browsers

Based on the data, what type of visitor is this? Respond with only the type.`;
}

/**
 * Generate personalized content recommendations
 */
export async function generatePersonalizedRecommendations(
  projects: Project[], 
  visitorType: VisitorType
): Promise<PersonalizationConfig> {
  try {
    const prompt = generateRecommendationsPrompt(projects, visitorType);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert in personalized content recommendations. Generate a personalization configuration for the given visitor type and projects. Respond with valid JSON in this format:
          {
            "focus": ["array", "of", "focus", "areas"],
            "highlight": "string describing what to highlight",
            "tone": "string describing the tone to use",
            "priorityProjects": ["array", "of", "project", "ids"],
            "customContent": {"key": "value"}
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const config = JSON.parse(content) as PersonalizationConfig;
    return validatePersonalizationConfig(config, projects);
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    return generateDefaultPersonalizationConfig(visitorType, projects);
  }
}

/**
 * Generate recommendations prompt
 */
function generateRecommendationsPrompt(projects: Project[], visitorType: VisitorType): string {
  const projectSummaries = projects.map(p => ({
    id: p.id,
    name: p.repository.name,
    category: p.analysis.projectCategory || 'other',
    priority: p.priority,
    stars: p.repository.stargazers_count,
    language: p.repository.language,
  }));

  return `Generate personalization for a ${visitorType} visitor.

Available projects:
${projectSummaries.map(p => `- ${p.name} (${p.category}, priority: ${p.priority}, stars: ${p.stars})`).join('\n')}

Visitor type characteristics:
- "hr": Focus on soft skills, leadership, collaboration, team projects
- "business": Focus on business impact, ROI, scalability, market value
- "technical": Focus on code quality, architecture, innovation, technical depth
- "general": Focus on overall portfolio, diverse skills, accessibility

Generate a personalization configuration that will best serve this visitor type.`;
}

/**
 * Validate personalization configuration
 */
function validatePersonalizationConfig(config: any, projects: Project[]): PersonalizationConfig {
  const defaultConfig = generateDefaultPersonalizationConfig('general', projects);
  
  if (!Array.isArray(config.focus) || config.focus.length === 0) {
    config.focus = defaultConfig.focus;
  }
  
  if (typeof config.highlight !== 'string') {
    config.highlight = defaultConfig.highlight;
  }
  
  if (typeof config.tone !== 'string') {
    config.tone = defaultConfig.tone;
  }
  
  if (!Array.isArray(config.priorityProjects) || config.priorityProjects.length === 0) {
    config.priorityProjects = defaultConfig.priorityProjects;
  }
  
  if (typeof config.customContent !== 'object' || config.customContent === null) {
    config.customContent = defaultConfig.customContent;
  }
  
  return config as PersonalizationConfig;
}

/**
 * Generate default personalization configuration
 */
function generateDefaultPersonalizationConfig(visitorType: VisitorType, projects: Project[]): PersonalizationConfig {
  const configs = {
    hr: {
      focus: ['team projects', 'leadership', 'communication', 'collaboration'],
      highlight: 'soft skills and team collaboration',
      tone: 'professional and achievement-focused',
      priorityProjects: projects.filter(p => p.metrics.contributors.length > 1).slice(0, 5).map(p => p.id),
      customContent: {
        welcome: 'Welcome! I focus on demonstrating strong leadership and collaboration skills.',
        skills: 'Leadership, Team Management, Communication, Project Coordination'
      }
    },
    business: {
      focus: ['business impact', 'ROI', 'scalability', 'market value'],
      highlight: 'commercial value and business results',
      tone: 'results-oriented and strategic',
      priorityProjects: projects.filter(p => p.priority >= 7).slice(0, 5).map(p => p.id),
      customContent: {
        welcome: 'Welcome! I showcase projects with strong business impact and ROI.',
        skills: 'Business Strategy, ROI Optimization, Scalability, Market Analysis'
      }
    },
    technical: {
      focus: ['code quality', 'architecture', 'innovation', 'technical depth'],
      highlight: 'technical excellence and expertise',
      tone: 'detailed and technically precise',
      priorityProjects: projects.filter(p => p.analysis.complexityScore >= 7).slice(0, 5).map(p => p.id),
      customContent: {
        welcome: 'Welcome! I demonstrate technical excellence and innovative solutions.',
        skills: 'Software Architecture, Code Quality, Innovation, Technical Leadership'
      }
    },
    general: {
      focus: ['overall portfolio', 'diverse skills', 'accessibility'],
      highlight: 'comprehensive skill set and versatility',
      tone: 'friendly and approachable',
      priorityProjects: projects.filter(p => p.featured).slice(0, 5).map(p => p.id),
      customContent: {
        welcome: 'Welcome! I showcase a diverse portfolio of technical projects.',
        skills: 'Full-Stack Development, Problem Solving, Innovation, Collaboration'
      }
    }
  };
  
  return configs[visitorType];
}

/**
 * Generate project description using AI
 */
export async function generateProjectDescription(project: Project, visitorType: VisitorType): Promise<string> {
  try {
    const prompt = `Generate a compelling project description for a ${visitorType} visitor:

Project: ${project.repository.name}
Description: ${project.repository.description || 'No description available'}
Languages: ${project.metrics.languages.map(l => l.name).join(', ')}
Stars: ${project.repository.stargazers_count}
Contributors: ${project.metrics.contributors.length}
Key Features: ${project.highlights.keyFeatures.join(', ')}

Write a 2-3 sentence description that would appeal to a ${visitorType} visitor. Focus on what matters most to them.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in technical project descriptions. Write compelling, concise descriptions tailored to the visitor type."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || project.repository.description || 'A well-crafted software project showcasing technical expertise.';
  } catch (error) {
    console.error('Error generating project description:', error);
    return project.repository.description || 'A well-crafted software project showcasing technical expertise.';
  }
}
