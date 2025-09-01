# 🚀 Database Setup Guide

## MongoDB Integration for AI Portfolio

### Step 1: Install Dependencies

```bash
npm install mongoose
npm install --save-dev @types/mongoose
```

### Step 2: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster (free tier)
4. Create database user
5. Get connection string

### Step 3: Environment Variables

Add to your `.env.local`:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

### Step 4: Database Schema

```javascript
// lib/models/Visitor.js
const visitorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  visitorType: {
    type: String,
    enum: ["hr", "business", "technical", "general"],
  },
  interests: [String],
  technicalLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },
  timeSpent: { type: Number, default: 0 },
  sectionsViewed: [String],
  interactions: [
    {
      type: { type: String, enum: ["view", "click", "hover", "scroll"] },
      target: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// lib/models/Project.js
const projectAnalysisSchema = new mongoose.Schema({
  githubId: { type: Number, required: true, unique: true },
  name: String,
  analysis: {
    codeQualityScore: Number,
    technicalComplexity: String,
    businessValue: String,
    keyStrengths: [String],
    primaryTechnologies: [String],
    projectCategory: String,
    complexityScore: Number,
    maintainabilityScore: Number,
    scalabilityScore: Number,
    innovationScore: Number,
  },
  metrics: {
    totalViews: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    avgTimeSpent: { type: Number, default: 0 },
    ratings: [
      {
        visitorType: String,
        rating: Number,
        comment: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  lastAnalyzed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// lib/models/Analytics.js
const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  visitors: {
    total: { type: Number, default: 0 },
    unique: { type: Number, default: 0 },
    byType: {
      hr: { type: Number, default: 0 },
      business: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      general: { type: Number, default: 0 },
    },
  },
  projects: {
    totalViews: { type: Number, default: 0 },
    mostViewed: [{ projectId: String, views: Number }],
    avgRating: { type: Number, default: 0 },
  },
  performance: {
    avgLoadTime: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 },
  },
});
```

### Step 5: Database Connection

```javascript
// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

### Step 6: API Routes

```javascript
// app/api/visitors/route.js
import connectDB from "@/lib/mongodb";
import Visitor from "@/lib/models/Visitor";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const visitor = new Visitor(data);
    await visitor.save();

    return Response.json({ success: true, visitor });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const visitor = await Visitor.findOne({ sessionId });
    return Response.json({ visitor });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Step 7: Integration with Components

```javascript
// hooks/useVisitorTracking.js
import { useState, useEffect } from "react";

export function useVisitorTracking() {
  const [sessionId, setSessionId] = useState(null);
  const [visitorData, setVisitorData] = useState(null);

  useEffect(() => {
    // Generate or retrieve session ID
    let id = localStorage.getItem("portfolioSessionId");
    if (!id) {
      id = generateSessionId();
      localStorage.setItem("portfolioSessionId", id);
    }
    setSessionId(id);

    // Load visitor data
    loadVisitorData(id);
  }, []);

  const trackInteraction = async (type, target) => {
    if (!sessionId) return;

    try {
      await fetch("/api/visitors/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, type, target }),
      });
    } catch (error) {
      console.error("Failed to track interaction:", error);
    }
  };

  const updateVisitorType = async (type) => {
    if (!sessionId) return;

    try {
      await fetch("/api/visitors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, visitorType: type }),
      });
      setVisitorData((prev) => ({ ...prev, visitorType: type }));
    } catch (error) {
      console.error("Failed to update visitor type:", error);
    }
  };

  return {
    sessionId,
    visitorData,
    trackInteraction,
    updateVisitorType,
  };
}
```

## 🎯 Benefits You'll Get

### 1. **Persistent User Experience**

- Visitors maintain their preferences across sessions
- Personalized content based on previous visits
- Progressive profiling of visitor interests

### 2. **Real Analytics Dashboard**

- Track which projects are most popular
- Understand visitor behavior patterns
- Optimize portfolio based on real data

### 3. **Performance Improvements**

- Cache GitHub API responses
- Reduce API rate limiting issues
- Faster page loads with pre-analyzed data

### 4. **Professional Features**

- Visitor feedback and ratings
- Project popularity metrics
- Admin dashboard for insights

### 5. **SEO & Marketing**

- Track conversion from different visitor types
- A/B test different layouts
- Understand which content works best

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install mongoose

# 2. Set up environment variables
echo "MONGODB_URI=your_connection_string" >> .env.local

# 3. Create the database models and connection files
# (Copy the code examples above)

# 4. Test the setup
npm run dev
```

## 📊 Expected Results

After implementation, you'll have:

- **Persistent visitor tracking** across sessions
- **Real-time analytics** dashboard
- **Improved performance** with caching
- **Professional portfolio** with visitor insights
- **Data-driven optimization** capabilities

## 🔧 Troubleshooting

### Common Issues:

1. **Connection Error**: Check MONGODB_URI format
2. **Schema Validation**: Ensure model definitions match data
3. **API Routes**: Verify API endpoint paths
4. **Environment Variables**: Restart dev server after changes

### Debug Mode:

```javascript
// Add to your MongoDB connection
mongoose.set("debug", true);
```

---

**Next Steps**: After setting up the database, you can add features like visitor comments, project ratings, and advanced analytics!


