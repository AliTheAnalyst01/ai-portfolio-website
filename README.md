# 🚀 AI-Powered Portfolio Website

The **BEST EVER portfolio website** that automatically fetches your GitHub repositories, extracts images and graphs, creates AI-generated videos, and showcases your projects with intelligent analysis for both technical and non-technical audiences.

## ✨ Features

### 🧠 **AI Intelligence**
- **Automatic GitHub Integration**: Fetches and analyzes your repositories
- **Smart Project Analysis**: Complexity, power, and maintainability scoring
- **Intelligent Content Generation**: Creates layman-friendly descriptions
- **Limitation Detection**: Identifies areas for improvement

### 🖼️ **Visual Content**
- **Image Extraction**: Automatically finds images, screenshots, and graphs from repos
- **Repository Visuals**: Shows project screenshots, diagrams, and examples
- **Smart Categorization**: Groups projects by type and complexity

### 🎥 **Video Generation**
- **AI Video Creator**: Generates beautiful project showcase videos
- **Multiple Styles**: Modern, Futuristic, Professional, Creative
- **Customizable**: Duration, music, transitions, quality settings
- **Upload Support**: Add your own videos too

### 🎨 **Beautiful Interface**
- **4 Main Sections**: Projects, Analytics, Videos, Personalization
- **Multiple View Modes**: Grid and List layouts
- **Advanced Filtering**: Search, categories, sorting
- **Responsive Design**: Works perfectly on all devices

###  - **Portfolio Statistics**: Stars, forks, contributors, lines of code
- **Language Distribution**: Visual tech stack charts
- **Project Categories**: Beautiful data visualization
- **Visitor Insights**: Personalized analytics

## 🚀 Quick Start

### 1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd portfolio
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure GitHub Integration**
Edit `config/github.js`:
```javascript
export const githubConfig = {
  username: 'your-actual-github-username', // Replace with your username
  token: process.env.GITHUB_TOKEN || '',   // Optional: for private repos
  // ... other settings
};
```

### 4. **Set Environment Variables** (Optional)
Create `.env.local`:
```bash
GITHUB_TOKEN=your-github-personal-access-token
```

### 5. **Run the Development Server**
```bash
npm run dev
```

### 6. **Open Your Portfolio**
Navigate to `http://localhost:3000`

## 🔧 Configuration

### **GitHub Setup**
1. **Username**: Set your GitHub username in `config/github.js`
2. **Token** (Optional): Generate a personal access token at [GitHub Settings](https://github.com/settings/tokens)
3. **Permissions**: For private repos, ensure the token has `repo` access

### **Customization**
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Analysis**: Adjust complexity weights in `config/github.js`
- **Image Paths**: Customize where the system looks for images
- **Video Styles**: Modify video generation templates

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── github/        # GitHub integration API
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/             # React components
│   ├── 3d/                # 3D components
│   ├── EnhancedProjectCard.js  # Enhanced project display
│   ├── VideoGenerator.js       # AI video generation
│   ├── AnalyticsDashboard.js   # Analytics and charts
│   ├── Portfolio.js            # Main portfolio component
│   └── ...                 # Other components
├── lib/                    # Utility libraries
│   └── ai-agent.js        # AI analysis engine
├── config/                 # Configuration files
│   └── github.js          # GitHub settings
└── README.md               # This file
```

## 🎯 How It Works

### **1. Repository Fetching**
- Connects to GitHub API
- Fetches your repositories
- Filters out archived/disabled repos

### **2. Image Extraction**
- Searches common image directories
- Extracts images from README files
- Converts relative URLs to absolute

### **3. AI Analysis**
- Analyzes code complexity
- Calculates developer power score
- Identifies maintainability factors
- Detects potential limitations

### **4. Content Generation**
- Creates layman-friendly descriptions
- Generates technical stack analysis
- Identifies improvement areas

### **5. Video Creation**
- Uses AI-generated content
- Applies customizable templates
- Creates professional showcase videos

## 🌟 Key Components

### **EnhancedProjectCard**
- Displays repository images
- Shows technical stack
- Highlights limitations
- Provides detailed analysis

### **VideoGenerator**
- AI-powered video creation
- Multiple style templates
- Customizable settings
- Download functionality

### **AnalyticsDashboard**
- Portfolio statistics
- Language distribution
- Project categories
- Activity timeline

### **AI Agent**
- Project complexity analysis
- Power scoring algorithm
- Limitation detection
- Content generation

## 🔍 Troubleshooting

### **Common Issues**

1. **GitHub API Rate Limits**
   - Solution: Add GitHub token to environment variables
   - Check: `config/github.js` username is correct

2. **Images Not Loading**
   - Check: Repository has images in common directories
   - Verify: Image URLs are accessible

3. **Analysis Not Working**
   - Ensure: GitHub API is responding
   - Check: Console for error messages

4. **Video Generation Fails**
   - Verify: All dependencies are installed
   - Check: Browser supports required APIs

### **Debug Mode**
Enable debug logging in `config/github.js`:
```javascript
export const githubConfig = {
  debug: true,  // Enable detailed logging
  // ... other settings
};
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### **Other Platforms**
- **Netlify**: Build command: `npm run build`
- **AWS**: Use Next.js static export
- **Docker**: Build container image

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Next.js** for the amazing framework
- **Framer Motion** for smooth animations
- **Tailwind CSS** for beautiful styling
- **GitHub API** for repository data

## 📞 Support

- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub discussions
- **Email**: Contact maintainer

---

**Made with ❤️ and AI** - The future of portfolio websites is here! 🚀✨
