// GitHub API Types
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: string;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  license: {
    key: string;
    name: string;
    url: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
    type: string;
  };
}

export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
}

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
  type: string;
}

export interface LanguageStats {
  name: string;
  bytes: number;
  percentage: number;
  color?: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}

// AI Analysis Types
export interface AIAnalysis {
  codeQualityScore: number;
  technicalComplexity: 'low' | 'medium' | 'high';
  businessValue: string;
  keyStrengths: string[];
  primaryTechnologies: string[];
  projectCategory: ProjectCategory;
  suitableAudience: VisitorType[];
  complexityScore: number; // 1-10
  maintainabilityScore: number; // 1-10
  scalabilityScore: number; // 1-10
  innovationScore: number; // 1-10
}

export type ProjectCategory = 
  | 'web-development'
  | 'mobile-development'
  | 'ai-ml'
  | 'backend'
  | 'frontend'
  | 'full-stack'
  | 'data-science'
  | 'devops'
  | 'game-development'
  | 'other';

export type VisitorType = 'hr' | 'business' | 'technical' | 'general';

// Project Types
export interface Project {
  id: string;
  repository: Repository;
  analysis: AIAnalysis;
  metrics: ProjectMetrics;
  highlights: ProjectHighlights;
  tags: string[];
  priority: number; // 1-10
  featured: boolean;
}

export interface ProjectMetrics {
  linesOfCode: number;
  languages: LanguageStats[];
  commitFrequency: number;
  lastActivity: string;
  contributors: Contributor[];
  pullRequests: PullRequest[];
  issues: Issue[];
  complexity: ComplexityMetric[];
}

export interface ProjectHighlights {
  description: string;
  keyFeatures: string[];
  achievements: string[];
  technicalChallenges: string[];
  businessImpact: string;
  learningOutcomes: string[];
}

export interface ComplexityMetric {
  type: 'cyclomatic' | 'cognitive' | 'maintainability';
  score: number;
  details: string;
}

// Visitor Personalization Types
export interface VisitorData {
  type: VisitorType;
  interests: string[];
  technicalLevel: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  timeSpent: number;
  sectionsViewed: string[];
  interactions: VisitorInteraction[];
}

export interface VisitorInteraction {
  type: 'view' | 'click' | 'hover' | 'scroll';
  target: string;
  timestamp: string;
  duration?: number;
}

export interface PersonalizationConfig {
  focus: string[];
  highlight: string;
  tone: string;
  priorityProjects: string[];
  customContent: Record<string, string>;
}

// 3D Scene Types
export interface SceneConfig {
  backgroundColor: string;
  ambientLight: {
    intensity: number;
    color: string;
  };
  directionalLight: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
  particles: {
    count: number;
    size: number;
    color: string;
    speed: number;
  };
}

export interface ProjectCard3D {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  project: Project;
  isHovered: boolean;
  isSelected: boolean;
}

// Analytics Types
export interface AnalyticsData {
  visitorStats: {
    totalVisitors: number;
    uniqueVisitors: number;
    averageTimeSpent: number;
    bounceRate: number;
  };
  projectStats: {
    totalViews: number;
    popularProjects: string[];
    engagementRate: number;
  };
  skillStats: {
    mostViewed: string[];
    trendingSkills: string[];
    demandScore: number;
  };
}

// API Response Types
export interface GitHubAPIResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Component Props Types
export interface SceneProps {
  projects: Project[];
  visitorType: VisitorType;
  onProjectSelect: (project: Project) => void;
}

export interface ProjectCardProps {
  project: Project;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export interface AnalyticsDashboardProps {
  projects: Project[];
  visitorData: VisitorData;
  analytics: AnalyticsData;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

export type SortOption = 'name' | 'stars' | 'forks' | 'updated' | 'complexity' | 'priority';

export type FilterOption = {
  category?: ProjectCategory;
  language?: string;
  complexity?: 'low' | 'medium' | 'high';
  featured?: boolean;
};
