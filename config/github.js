// GitHub Configuration
// Replace these values with your actual GitHub information

export const githubConfig = {
  // Your GitHub username
  username: 'your-github-username',
  
  // Your GitHub personal access token (optional, for private repos)
  // Generate at: https://github.com/settings/tokens
  token: process.env.GITHUB_TOKEN || '',
  
  // Repository settings
  maxRepos: 100,
  includePrivate: false,
  excludeArchived: true,
  excludeForks: false,
  
  // Image extraction settings
  imagePaths: [
    'images/', 'img/', 'assets/', 'screenshots/', 'docs/', 'examples/',
    'screenshots/', 'preview/', 'demo/', 'media/', 'static/'
  ],
  
  // Supported image formats
  imageFormats: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
  
  // Analysis settings
  complexityWeights: {
    language: 0.3,
    size: 0.2,
    contributors: 0.2,
    activity: 0.2,
    topics: 0.1
  }
};

// Instructions for setup:
// 1. Replace 'your-github-username' with your actual GitHub username
// 2. (Optional) Set GITHUB_TOKEN environment variable for private repos
// 3. Restart the development server
// 4. Your repositories will be automatically fetched and analyzed



