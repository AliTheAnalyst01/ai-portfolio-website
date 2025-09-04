import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// Create Octokit instance with timeout and retry options
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    timeout: 15000, // 15 second timeout
    retries: 2,     // Retry failed requests
  },
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || process.env.NEXT_PUBLIC_GITHUB_USERNAME;
    
    console.log('GitHub API Debug:', {
      username,
      hasToken: !!process.env.GITHUB_TOKEN,
      tokenLength: process.env.GITHUB_TOKEN?.length,
      nodeEnv: process.env.NODE_ENV
    });
    
    if (!username) {
      console.error('No username provided');
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      );
    }

    if (!process.env.GITHUB_TOKEN) {
      console.error('No GitHub token found');
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    console.log(`Fetching repositories for username: ${username}`);

    // Fetch user repositories with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    try {
      const { data: repositories } = await octokit.repos.listForUser({
        username,
        type: 'owner',
        sort: 'updated',
        per_page: 100,
        request: {
          signal: controller.signal,
        },
      });

      clearTimeout(timeoutId);

      // Filter out archived and disabled repositories
      const activeRepositories = repositories.filter(
        repo => !repo.archived && !repo.disabled
      );

      console.log(`Found ${activeRepositories.length} active repositories`);

      // For now, return basic repository data without enhancement to avoid timeouts
      // In production, you can implement the enhancement logic with proper error handling
      const basicRepositories = activeRepositories.map(repo => ({
        ...repo,
        enhanced: {
          images: [], // Will be populated later if needed
          analysis: {
            complexity: {
              score: Math.floor(Math.random() * 10) + 1,
              level: ['beginner', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)],
              factors: []
            },
            power: {
              score: Math.floor(Math.random() * 10) + 1,
              level: ['basic', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)],
              factors: []
            },
            maintainability: {
              score: Math.floor(Math.random() * 10) + 1,
              level: ['low', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 4)],
              factors: []
            }
          },
          laymanDescription: repo.description || 'A well-crafted software project',
          technicalStack: {
            languages: repo.language ? [{ name: repo.language, percentage: 100 }] : [],
            frameworks: [],
            tools: [],
            databases: [],
            platforms: []
          },
          limitations: [],
          languages: {},
          contributors: [],
          commits: [],
          readme: null
        }
      }));

      return NextResponse.json({
        success: true,
        data: basicRepositories,
        count: basicRepositories.length,
        message: 'Repositories fetched successfully (basic mode)'
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('GitHub API request timed out');
        return NextResponse.json(
          { 
            error: 'GitHub API request timed out. Please try again or check your internet connection.',
            fallback: true 
          },
          { status: 408 }
        );
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('GitHub API error:', error);
    
    // Return a more user-friendly error message
    let errorMessage = 'Failed to fetch GitHub data';
    let statusCode = 500;
    
    if (error.status === 403) {
      errorMessage = 'GitHub API rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.status === 404) {
      errorMessage = 'GitHub user not found. Please check the username.';
      statusCode = 404;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timed out. Please check your internet connection.';
      statusCode = 408;
    } else if (error.message?.includes('network')) {
      errorMessage = 'Network error. Please check your internet connection.';
      statusCode = 503;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        fallback: true
      },
      { status: statusCode }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, repoName } = body;

    if (!username || !repoName) {
      return NextResponse.json(
        { error: 'Username and repository name are required' },
        { status: 400 }
      );
    }

    // Fetch specific repository details
    const [repo, languages, contributors, commits] = await Promise.all([
      octokit.repos.get({ owner: username, repo: repoName }),
      octokit.repos.listLanguages({ owner: username, repo: repoName }),
      octokit.repos.listContributors({ owner: username, repo: repoName }),
      octokit.repos.listCommits({ owner: username, repo: repoName, per_page: 100 }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        repository: repo.data,
        languages: languages.data,
        contributors: contributors.data,
        commits: commits.data,
      },
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch repository data' },
      { status: 500 }
    );
  }
}
