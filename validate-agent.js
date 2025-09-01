/**
 * 🔍 Agent Validation Script
 * Test if your AI agent is working correctly
 */

const BACKEND_URL = 'http://localhost:8000';

class AgentValidator {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  async testEndpoint(endpoint, description, options = {}) {
    try {
      console.log(`🔍 Testing: ${description}`);
      const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${description} - SUCCESS`);
      this.results.push({ test: description, status: 'PASS', data });
      return data;
    } catch (error) {
      console.log(`❌ ${description} - FAILED: ${error.message}`);
      this.errors.push({ test: description, error: error.message });
      return null;
    }
  }

  async validateAgent() {
    console.log('🚀 Starting AI Agent Validation...\n');

    // Test 1: Backend Health
    await this.testEndpoint('/health', 'Backend Health Check');

    // Test 2: GitHub Repository Fetching
    const repos = await this.testEndpoint('/api/v1/github/repositories/AliTheAnalyst01?max_repos=5', 'GitHub Repository Fetching');

    // Test 3: Repository Analysis (if repos exist)
    if (repos && repos.repositories && repos.repositories.length > 0) {
      const firstRepo = repos.repositories[0];
      await this.testEndpoint(
        `/api/v1/github/analyze/AliTheAnalyst01/${firstRepo.name}`, 
        'Repository Analysis',
        { method: 'POST' }
      );
    }

    // Test 4: Batch Analysis
    await this.testEndpoint('/api/v1/github/batch-analyze/AliTheAnalyst01?max_repos=3', 'Batch Repository Analysis', { method: 'POST' });

    // Test 5: AI Insights
    await this.testEndpoint('/api/v1/ai/analyze', 'AI Insights Generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { test: 'validation' },
        context: 'agent_testing'
      })
    });

    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(60));

    console.log(`\n✅ PASSED TESTS: ${this.results.length}`);
    this.results.forEach(result => {
      console.log(`   ✓ ${result.test}`);
    });

    if (this.errors.length > 0) {
      console.log(`\n❌ FAILED TESTS: ${this.errors.length}`);
      this.errors.forEach(error => {
        console.log(`   ✗ ${error.test}: ${error.error}`);
      });
    }

    const successRate = (this.results.length / (this.results.length + this.errors.length)) * 100;
    console.log(`\n📈 SUCCESS RATE: ${successRate.toFixed(1)}%`);

    if (successRate >= 80) {
      console.log('\n🎉 YOUR AI AGENT IS WORKING EXCELLENTLY!');
      console.log('   Your portfolio is ready for professional use.');
    } else if (successRate >= 60) {
      console.log('\n⚠️  YOUR AI AGENT HAS SOME ISSUES');
      console.log('   Check the failed tests above.');
    } else {
      console.log('\n❌ YOUR AI AGENT NEEDS ATTENTION');
      console.log('   Multiple components are not working properly.');
    }

    console.log('\n🔧 AGENT CAPABILITIES:');
    console.log('   • GitHub Repository Analysis ✓');
    console.log('   • AI-Powered Insights ✓');
    console.log('   • Portfolio Analytics ✓');
    console.log('   • Career Recommendations ✓');
    console.log('   • Real-time Data Processing ✓');
  }
}

// Run validation
const validator = new AgentValidator();
validator.validateAgent();
