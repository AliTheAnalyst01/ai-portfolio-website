import { Octokit } from '@octokit/rest';
import { 
  Repository, 
  Commit, 
  Contributor, 
  LanguageStats, 
  PullRequest, 
  Issue,
  Project,
  ProjectMetrics,
  ProjectHighlights,
  AIAnalysis
} from '@/types';

// Initialize Octokit client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// GitHub username from environment
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || '';

/**
 * Fetch all repositories for a user
 */
export async function fetchRepositories(): Promise<Repository[]> {
  try {
    const { data } = await octokit.repos.listForUser({
      username: GITHUB_USERNAME,
      type: 'owner',
      sort: 'updated',
      per_page: 100,
    });

    // Filter out archived and disabled repositories
    return data.filter(repo => !repo.archived && !repo.disabled);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw new Error('Failed to fetch repositories');
  }
}

/**
 * Fetch detailed repository data including commits, contributors, etc.
 */
export async function fetchRepositoryDetails(repo: Repository): Promise<ProjectMetrics> {
  try {
    const [commits, contributors, languages, pullRequests, issues] = await Promise.all([
      fetchRepositoryCommits(repo.name),
      fetchRepositoryContributors(repo.name),
      fetchRepositoryLanguages(repo.name),
      fetchRepositoryPullRequests(repo.name),
      fetchRepositoryIssues(repo.name),
    ]);

    // Calculate metrics
    const commitFrequency = calculateCommitFrequency(commits);
    const lastActivity = commits[0]?.commit.author.date || repo.updated_at;
    const linesOfCode = calculateLinesOfCode(languages);

    return {
      linesOfCode,
      languages,
      commitFrequency,
      lastActivity,
      contributors,
      pullRequests,
      issues,
      complexity: [], // Will be populated by AI analysis
    };
  } catch (error) {
    console.error(`Error fetching details for ${repo.name}:`, error);
    throw new Error(`Failed to fetch repository details for ${repo.name}`);
  }
}

/**
 * Fetch repository commits
 */
async function fetchRepositoryCommits(repoName: string): Promise<Commit[]> {
  try {
    const { data } = await octokit.repos.listCommits({
      owner: GITHUB_USERNAME,
      repo: repoName,
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching commits for ${repoName}:`, error);
    return [];
  }
}

/**
 * Fetch repository contributors
 */
async function fetchRepositoryContributors(repoName: string): Promise<Contributor[]> {
  try {
    const { data } = await octokit.repos.listContributors({
      owner: GITHUB_USERNAME,
      repo: repoName,
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching contributors for ${repoName}:`, error);
    return [];
  }
}

/**
 * Fetch repository languages
 */
async function fetchRepositoryLanguages(repoName: string): Promise<LanguageStats[]> {
  try {
    const { data } = await octokit.repos.listLanguages({
      owner: GITHUB_USERNAME,
      repo: repoName,
    });

    const totalBytes = Object.values(data).reduce((sum, bytes) => sum + bytes, 0);
    
    return Object.entries(data).map(([name, bytes]) => ({
      name,
      bytes,
      percentage: (bytes / totalBytes) * 100,
      color: getLanguageColor(name),
    }));
  } catch (error) {
    console.error(`Error fetching languages for ${repoName}:`, error);
    return [];
  }
}

/**
 * Fetch repository pull requests
 */
async function fetchRepositoryPullRequests(repoName: string): Promise<PullRequest[]> {
  try {
    const { data } = await octokit.pulls.list({
      owner: GITHUB_USERNAME,
      repo: repoName,
      state: 'all',
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching pull requests for ${repoName}:`, error);
    return [];
  }
}

/**
 * Fetch repository issues
 */
async function fetchRepositoryIssues(repoName: string): Promise<Issue[]> {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner: GITHUB_USERNAME,
      repo: repoName,
      state: 'all',
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching issues for ${repoName}:`, error);
    return [];
  }
}

/**
 * Calculate commit frequency (commits per month)
 */
function calculateCommitFrequency(commits: Commit[]): number {
  if (commits.length === 0) return 0;
  
  const firstCommit = new Date(commits[commits.length - 1].commit.author.date);
  const lastCommit = new Date(commits[0].commit.author.date);
  const monthsDiff = (lastCommit.getTime() - firstCommit.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  return monthsDiff > 0 ? commits.length / monthsDiff : commits.length;
}

/**
 * Calculate total lines of code from language statistics
 */
function calculateLinesOfCode(languages: LanguageStats[]): number {
  return languages.reduce((total, lang) => total + lang.bytes, 0);
}

/**
 * Get color for programming language (GitHub-like colors)
 */
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Scala': '#c22d40',
    'R': '#198CE7',
    'MATLAB': '#e16737',
    'Shell': '#89e051',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Vue': '#2c3e50',
    'React': '#61dafb',
    'Angular': '#dd0031',
    'Node.js': '#339933',
    'Docker': '#2496ed',
    'Kubernetes': '#326ce5',
  };
  
  return colors[language] || '#8250df';
}

/**
 * Categorize project based on repository data
 */
export function categorizeProject(repo: Repository, languages: LanguageStats[]): string {
  const primaryLanguage = languages[0]?.name.toLowerCase() || '';
  const topics = repo.topics.map(t => t.toLowerCase());
  const description = (repo.description || '').toLowerCase();
  
  // Check for specific technologies
  if (topics.includes('ai') || topics.includes('machine-learning') || topics.includes('ml')) {
    return 'ai-ml';
  }
  
  if (topics.includes('web') || topics.includes('frontend') || topics.includes('react') || topics.includes('vue')) {
    return 'web-development';
  }
  
  if (topics.includes('mobile') || topics.includes('ios') || topics.includes('android')) {
    return 'mobile-development';
  }
  
  if (topics.includes('backend') || topics.includes('api') || topics.includes('server')) {
    return 'backend';
  }
  
  if (topics.includes('data') || topics.includes('analytics') || topics.includes('database')) {
    return 'data-science';
  }
  
  if (topics.includes('devops') || topics.includes('ci-cd') || topics.includes('deployment')) {
    return 'devops';
  }
  
  if (topics.includes('game') || topics.includes('unity') || topics.includes('unreal')) {
    return 'game-development';
  }
  
  // Default categorization based on primary language
  if (['javascript', 'typescript', 'html', 'css'].includes(primaryLanguage)) {
    return 'web-development';
  }
  
  if (['python', 'r', 'matlab'].includes(primaryLanguage)) {
    return 'data-science';
  }
  
  if (['java', 'c++', 'c#', 'go', 'rust'].includes(primaryLanguage)) {
    return 'backend';
  }
  
  return 'other';
}

/**
 * Calculate project priority score
 */
export function calculateProjectPriority(repo: Repository, metrics: ProjectMetrics): number {
  let score = 0;
  
  // Star factor (30%)
  score += Math.min(repo.stargazers_count * 2, 30);
  
  // Activity factor (25%)
  const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(25 - daysSinceUpdate / 10, 0);
  
  // Size factor (20%)
  score += Math.min(metrics.linesOfCode / 1000, 20);
  
  // Community factor (15%)
  score += Math.min(repo.forks_count * 3, 15);
  
  // Language diversity factor (10%)
  score += Math.min(metrics.languages.length * 2, 10);
  
  return Math.round(score);
}

/**
 * Generate project highlights from repository data
 */
export function generateProjectHighlights(repo: Repository, metrics: ProjectMetrics): ProjectHighlights {
  const languages = metrics.languages.map(l => l.name).join(', ');
  const contributors = metrics.contributors.length;
  const isActive = metrics.commitFrequency > 0;
  
  return {
    description: repo.description || `A ${repo.language || 'multi-language'} project showcasing modern development practices.`,
    keyFeatures: [
      `Built with ${languages}`,
      `${contributors} contributor${contributors !== 1 ? 's' : ''}`,
      isActive ? 'Active development' : 'Stable project',
      `${repo.stargazers_count} star${repo.stargazers_count !== 1 ? 's' : ''}`,
    ],
    achievements: [
      `Successfully managed ${metrics.pullRequests.length} pull requests`,
      `Resolved ${metrics.issues.length} issues`,
      `Maintained ${metrics.commitFrequency.toFixed(1)} commits per month`,
    ],
    technicalChallenges: [
      'Multi-language codebase management',
      'Collaborative development workflow',
      'Performance optimization',
    ],
    businessImpact: 'Demonstrates strong technical leadership and project management skills.',
    learningOutcomes: [
      'Advanced Git workflow',
      'Team collaboration',
      'Code quality maintenance',
    ],
  };
}

/**
 * Transform repository to project object
 */
export async function transformRepositoryToProject(repo: Repository): Promise<Project> {
  const metrics = await fetchRepositoryDetails(repo);
  const category = categorizeProject(repo, metrics);
  const priority = calculateProjectPriority(repo, metrics);
  const highlights = generateProjectHighlights(repo, metrics);
  
  return {
    id: repo.id.toString(),
    repository: repo,
    analysis: {} as AIAnalysis, // Will be populated by AI
    metrics,
    highlights,
    tags: [...repo.topics, category, repo.language].filter(Boolean),
    priority,
    featured: priority >= 7 || repo.stargazers_count >= 10,
  };
}
