#!/bin/bash

echo "🚀 AI-Powered 3D Portfolio Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    exit 1
fi

echo "📝 Please provide the following information:"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Get GitHub token
echo ""
echo "🔑 For GitHub Token:"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Select scopes: repo, user, read:user"
echo "4. Copy the generated token"
echo ""
read -s -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN

# Get OpenAI API key
echo ""
echo ""
echo "🤖 For OpenAI API Key:"
echo "1. Go to: https://platform.openai.com/api-keys"
echo "2. Sign up/login and add payment method"
echo "3. Generate new API key"
echo "4. Copy the key"
echo ""
read -s -p "Enter your OpenAI API Key: " OPENAI_API_KEY

echo ""
echo ""

# Update .env.local file
echo "📝 Updating .env.local file..."

# Create backup
cp .env.local .env.local.backup

# Update the file
sed -i "s/your_github_username_here/$GITHUB_USERNAME/g" .env.local
sed -i "s/your_github_personal_access_token_here/$GITHUB_TOKEN/g" .env.local
sed -i "s/your_openai_api_key_here/$OPENAI_API_KEY/g" .env.local

echo "✅ Environment variables updated successfully!"
echo "📁 Backup created: .env.local.backup"
echo ""
echo "🔧 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Your portfolio will now fetch GitHub data and use AI features!"
echo ""
echo "🎉 Setup complete! Happy coding!"
