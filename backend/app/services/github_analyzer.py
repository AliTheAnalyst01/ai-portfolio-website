"""
🚀 Advanced GitHub Repository Analyzer
Comprehensive analysis of GitHub repositories with AI insights
"""

import asyncio
import aiohttp
from github import Github
from git import Repo
from pydriller import Repository
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime, timedelta
import ast
import re
import os
import tempfile
import shutil
from loguru import logger

class GitHubAnalyzer:
    """Advanced GitHub repository analyzer"""
    
    def __init__(self, token: str = None):
        self.github = Github(token) if token else Github()
        self.session = None
        self.cache = {}
        self.logger = logger
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def analyze_repository(self, username: str, repo_name: str) -> Dict[str, Any]:
        """Comprehensive repository analysis"""
        cache_key = f"{username}/{repo_name}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]
            
        try:
            self.logger.info(f"🔍 Starting analysis of {username}/{repo_name}")
            
            # Parallel data collection
            tasks = [
                self._get_repo_info(username, repo_name),
                self._get_languages(username, repo_name),
                self._get_contributors(username, repo_name),
                self._get_commits(username, repo_name),
                self._get_issues(username, repo_name),
                self._get_pull_requests(username, repo_name),
                self._get_topics(username, repo_name),
                self._get_releases(username, repo_name),
                self._get_workflows(username, repo_name),
                self._clone_and_analyze(username, repo_name)
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            analysis = self._process_analysis_results(results, username, repo_name)
            
            # Cache results
            self.cache[cache_key] = analysis
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"❌ Analysis failed for {username}/{repo_name}: {e}")
            raise
    
    async def _get_repo_info(self, username: str, repo_name: str) -> Dict[str, Any]:
        """Get basic repository information"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            return {
                "id": repo.id,
                "name": repo.name,
                "full_name": repo.full_name,
                "description": repo.description,
                "homepage": repo.homepage,
                "url": repo.html_url,
                "clone_url": repo.clone_url,
                "created_at": repo.created_at.isoformat(),
                "updated_at": repo.updated_at.isoformat(),
                "pushed_at": repo.pushed_at.isoformat(),
                "size": repo.size,
                "language": repo.language,
                "license": repo.license.name if repo.license else None,
                "default_branch": repo.default_branch,
                "archived": repo.archived,
                "disabled": repo.disabled,
                "fork": repo.fork,
                "forks_count": repo.forks_count,
                "stargazers_count": repo.stargazers_count,
                "watchers_count": repo.watchers_count,
                "open_issues_count": repo.open_issues_count,
                "visibility": repo.visibility,
                "has_wiki": repo.has_wiki,
                "has_pages": repo.has_pages,
                "has_projects": repo.has_projects
            }
        except Exception as e:
            self.logger.error(f"Failed to get repo info: {e}")
            return {}
    
    async def _get_languages(self, username: str, repo_name: str) -> Dict[str, int]:
        """Get repository languages"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            return repo.get_languages()
        except Exception as e:
            self.logger.error(f"Failed to get languages: {e}")
            return {}
    
    async def _get_contributors(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Get repository contributors"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            contributors = repo.get_contributors()
            return [
                {
                    "login": c.login,
                    "id": c.id,
                    "contributions": c.contributions,
                    "avatar_url": c.avatar_url,
                    "type": c.type
                }
                for c in contributors
            ]
        except Exception as e:
            self.logger.error(f"Failed to get contributors: {e}")
            return []
    
    async def _get_commits(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Get repository commits"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            commits = repo.get_commits()
            return [
                {
                    "sha": c.sha,
                    "message": c.commit.message,
                    "author": c.commit.author.name,
                    "date": c.commit.author.date.isoformat(),
                    "stats": c.stats.total
                }
                for c in commits[:100]  # Last 100 commits
            ]
        except Exception as e:
            self.logger.error(f"Failed to get commits: {e}")
            return []
    
    async def _get_issues(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Get repository issues"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            issues = repo.get_issues(state="all")
            return [
                {
                    "number": i.number,
                    "title": i.title,
                    "state": i.state,
                    "created_at": i.created_at.isoformat(),
                    "closed_at": i.closed_at.isoformat() if i.closed_at else None,
                    "labels": [l.name for l in i.labels]
                }
                for i in issues[:100]  # Last 100 issues
            ]
        except Exception as e:
            self.logger.error(f"Failed to get issues: {e}")
            return []
    
    async def _get_pull_requests(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Get repository pull requests"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            pulls = repo.get_pulls(state="all")
            return [
                {
                    "number": p.number,
                    "title": p.title,
                    "state": p.state,
                    "created_at": p.created_at.isoformat(),
                    "merged_at": p.merged_at.isoformat() if p.merged_at else None,
                    "additions": p.additions,
                    "deletions": p.deletions
                }
                for p in pulls[:100]  # Last 100 PRs
            ]
        except Exception as e:
            self.logger.error(f"Failed to get PRs: {e}")
            return []
    
    async def _get_topics(self, username: str, repo_name: str) -> List[str]:
        """Get repository topics"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            return repo.get_topics()
        except Exception as e:
            self.logger.error(f"Failed to get topics: {e}")
            return []
    
    async def _get_releases(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Get repository releases"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            releases = repo.get_releases()
            return [
                {
                    "tag_name": r.tag_name,
                    "name": r.name,
                    "body": r.body,
                    "created_at": r.created_at.isoformat(),
                    "published_at": r.published_at.isoformat() if r.published_at else None
                }
                for r in releases[:10]  # Last 10 releases
            ]
        except Exception as e:
            self.logger.error(f"Failed to get releases: {e}")
            return []
    
    async def _get_workflows(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Get repository workflows"""
        try:
            repo = self.github.get_repo(f"{username}/{repo_name}")
            workflows = repo.get_workflows()
            return [
                {
                    "id": w.id,
                    "name": w.name,
                    "state": w.state,
                    "created_at": w.created_at.isoformat(),
                    "updated_at": w.updated_at.isoformat()
                }
                for w in workflows
            ]
        except Exception as e:
            self.logger.error(f"Failed to get workflows: {e}")
            return []
    
    async def _clone_and_analyze(self, username: str, repo_name: str) -> Dict[str, Any]:
        """Clone repository and perform deep analysis"""
        temp_dir = None
        try:
            # Clone repository
            clone_url = f"https://github.com/{username}/{repo_name}.git"
            temp_dir = tempfile.mkdtemp(prefix=f"{username}_{repo_name}_")
            
            repo = Repo.clone_from(clone_url, temp_dir)
            
            # Analyze code structure
            code_analysis = self._analyze_code_structure(temp_dir)
            
            # Analyze commit patterns
            commit_analysis = self._analyze_commit_patterns(repo)
            
            # Analyze code complexity
            complexity_analysis = self._analyze_code_complexity(temp_dir)
            
            return {
                "code_structure": code_analysis,
                "commit_patterns": commit_analysis,
                "complexity": complexity_analysis
            }
            
        except Exception as e:
            self.logger.error(f"Failed to clone and analyze: {e}")
            return {}
        finally:
            # Cleanup
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
    
    def _analyze_code_structure(self, repo_path: str) -> Dict[str, Any]:
        """Analyze repository code structure"""
        try:
            structure = {
                "files": [],
                "directories": [],
                "file_types": {},
                "total_lines": 0,
                "architecture_patterns": []
            }
            
            for root, dirs, files in os.walk(repo_path):
                # Skip hidden directories
                dirs[:] = [d for d in dirs if not d.startswith('.')]
                
                for file in files:
                    if file.startswith('.'):
                        continue
                        
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, repo_path)
                    
                    # Get file info
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            lines = len(content.splitlines())
                            structure["total_lines"] += lines
                    except:
                        lines = 0
                    
                    # Categorize file types
                    ext = os.path.splitext(file)[1].lower()
                    if ext not in structure["file_types"]:
                        structure["file_types"][ext] = {"count": 0, "lines": 0}
                    structure["file_types"][ext]["count"] += 1
                    structure["file_types"][ext]["lines"] += lines
                    
                    structure["files"].append({
                        "path": rel_path,
                        "lines": lines,
                        "extension": ext
                    })
                
                structure["directories"].extend([os.path.relpath(os.path.join(root, d), repo_path) for d in dirs])
            
            # Detect architecture patterns
            structure["architecture_patterns"] = self._detect_architecture_patterns(structure)
            
            return structure
            
        except Exception as e:
            self.logger.error(f"Failed to analyze code structure: {e}")
            return {}
    
    def _detect_architecture_patterns(self, structure: Dict[str, Any]) -> List[str]:
        """Detect common architecture patterns"""
        patterns = []
        
        # Check for common patterns
        if any("src" in d for d in structure["directories"]):
            patterns.append("src-based-structure")
        
        if any("tests" in d for d in structure["directories"]):
            patterns.append("test-driven-development")
            
        if any("docs" in d for d in structure["directories"]):
            patterns.append("documentation-focused")
            
        if any("api" in d for d in structure["directories"]):
            patterns.append("api-first-design")
            
        if any("frontend" in d or "backend" in d for d in structure["directories"]):
            patterns.append("separation-of-concerns")
            
        return patterns
    
    def _analyze_commit_patterns(self, repo: Repo) -> Dict[str, Any]:
        """Analyze commit patterns and developer behavior"""
        try:
            commits = list(repo.iter_commits('main', max_count=100))
            
            analysis = {
                "total_commits": len(commits),
                "commit_frequency": {},
                "commit_sizes": [],
                "commit_messages": [],
                "developer_patterns": {}
            }
            
            for commit in commits:
                # Analyze commit size
                stats = commit.stats
                total_changes = stats.total['lines']
                analysis["commit_sizes"].append(total_changes)
                
                # Analyze commit message
                message = commit.message.strip()
                analysis["commit_messages"].append({
                    "hash": commit.hexsha[:8],
                    "message": message,
                    "length": len(message),
                    "has_issue_ref": bool(re.search(r'#\d+', message)),
                    "has_emoji": bool(re.search(r'[-🌀-🗿]', message))
                })
                
                # Analyze author patterns
                author = commit.author.name
                if author not in analysis["developer_patterns"]:
                    analysis["developer_patterns"][author] = {
                        "commits": 0,
                        "total_changes": 0,
                        "avg_message_length": 0
                    }
                
                analysis["developer_patterns"][author]["commits"] += 1
                analysis["developer_patterns"][author]["total_changes"] += total_changes
            
            # Calculate averages and patterns
            if analysis["commit_sizes"]:
                analysis["avg_commit_size"] = np.mean(analysis["commit_sizes"])
                analysis["commit_size_distribution"] = {
                    "small": len([s for s in analysis["commit_sizes"] if s < 10]),
                    "medium": len([s for s in analysis["commit_sizes"] if 10 <= s < 100]),
                    "large": len([s for s in analysis["commit_sizes"] if s >= 100])
                }
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Failed to analyze commit patterns: {e}")
            return {}
    
    def _analyze_code_complexity(self, repo_path: str) -> Dict[str, Any]:
        """Analyze code complexity using AST"""
        try:
            complexity_metrics = {
                "cyclomatic_complexity": {},
                "cognitive_complexity": {},
                "nesting_depth": {},
                "function_lengths": [],
                "class_complexity": {}
            }
            
            for root, dirs, files in os.walk(repo_path):
                for file in files:
                    if file.endswith('.py'):
                        file_path = os.path.join(root, file)
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                                
                            tree = ast.parse(content)
                            file_complexity = self._analyze_python_file(tree)
                            
                            rel_path = os.path.relpath(file_path, repo_path)
                            complexity_metrics["cyclomatic_complexity"][rel_path] = file_complexity["cyclomatic"]
                            complexity_metrics["cognitive_complexity"][rel_path] = file_complexity["cognitive"]
                            
                        except Exception as e:
                            self.logger.warning(f"Failed to analyze {file_path}: {e}")
            
            # Calculate overall metrics
            if complexity_metrics["cyclomatic_complexity"]:
                complexity_metrics["overall"] = {
                    "avg_cyclomatic": np.mean(list(complexity_metrics["cyclomatic_complexity"].values())),
                    "max_cyclomatic": max(complexity_metrics["cyclomatic_complexity"].values()),
                    "complex_files": len([v for v in complexity_metrics["cyclomatic_complexity"].values() if v > 10])
                }
            
            return complexity_metrics
            
        except Exception as e:
            self.logger.error(f"Failed to analyze code complexity: {e}")
            return {}
    
    def _analyze_python_file(self, tree: ast.AST) -> Dict[str, int]:
        """Analyze complexity of a Python file"""
        complexity = {"cyclomatic": 1, "cognitive": 0}
        
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.While, ast.For, ast.AsyncFor)):
                complexity["cyclomatic"] += 1
                complexity["cognitive"] += 1
            elif isinstance(node, ast.ExceptHandler):
                complexity["cyclomatic"] += 1
            elif isinstance(node, ast.BoolOp):
                complexity["cyclomatic"] += len(node.values) - 1
            elif isinstance(node, ast.Compare):
                complexity["cyclomatic"] += len(node.ops)
        
        return complexity
    
    def _process_analysis_results(self, results: List[Any], username: str, repo_name: str) -> Dict[str, Any]:
        """Process and combine all analysis results"""
        try:
            # Extract results (handle exceptions)
            repo_info = results[0] if not isinstance(results[0], Exception) else {}
            languages = results[1] if not isinstance(results[1], Exception) else {}
            contributors = results[2] if not isinstance(results[2], Exception) else []
            commits = results[3] if not isinstance(results[3], Exception) else []
            issues = results[4] if not isinstance(results[4], Exception) else []
            pull_requests = results[5] if not isinstance(results[5], Exception) else []
            topics = results[6] if not isinstance(results[6], Exception) else []
            releases = results[7] if not isinstance(results[7], Exception) else []
            workflows = results[8] if not isinstance(results[8], Exception) else []
            code_analysis = results[9] if not isinstance(results[9], Exception) else {}
            
            # Combine into comprehensive analysis
            analysis = {
                "repository": repo_info,
                "languages": languages,
                "contributors": contributors,
                "commits": commits,
                "issues": issues,
                "pull_requests": pull_requests,
                "topics": topics,
                "releases": releases,
                "workflows": workflows,
                "code_analysis": code_analysis,
                "timestamp": datetime.now().isoformat(),
                "analysis_version": "2.0.0"
            }
            
            # Calculate scores
            analysis["scores"] = self._calculate_scores(analysis)
            analysis["insights"] = self._generate_insights(analysis)
            analysis["recommendations"] = self._generate_recommendations(analysis)
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Failed to process analysis results: {e}")
            raise
    
    def _calculate_scores(self, analysis: Dict[str, Any]) -> Dict[str, float]:
        """Calculate various quality scores"""
        scores = {}
        
        try:
            # Technical complexity score
            if analysis.get("code_analysis", {}).get("complexity", {}).get("overall"):
                complexity = analysis["code_analysis"]["complexity"]["overall"]
                scores["technical"] = max(1, min(10, 10 - (complexity.get("avg_cyclomatic", 0) / 2)))
            else:
                scores["technical"] = 5.0
            
            # Code quality score
            if analysis.get("code_analysis", {}).get("structure"):
                structure = analysis["code_analysis"]["structure"]
                quality_factors = [
                    1 if structure.get("architecture_patterns") else 0.5,
                    1 if structure.get("file_types", {}).get(".md") else 0.5,
                    1 if structure.get("file_types", {}).get(".test") or structure.get("file_types", {}).get("_test") else 0.5
                ]
                scores["quality"] = sum(quality_factors) / len(quality_factors) * 10
            else:
                scores["quality"] = 5.0
            
            # Activity score
            if analysis.get("commits"):
                commits = analysis["commits"]
                recent_commits = [c for c in commits if c.get("date") and 
                                datetime.fromisoformat(c["date"]) > datetime.now() - timedelta(days=90)]
                scores["activity"] = min(10, len(recent_commits) / 10)
            else:
                scores["activity"] = 5.0
            
            # Overall score
            scores["overall"] = (scores["technical"] + scores["quality"] + scores["activity"]) / 3
            
        except Exception as e:
            self.logger.error(f"Failed to calculate scores: {e}")
            scores = {"technical": 5.0, "quality": 5.0, "activity": 5.0, "overall": 5.0}
        
        return scores
    
    def _generate_insights(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate actionable insights"""
        insights = []
        
        try:
            # Code quality insights
            if analysis.get("scores", {}).get("quality", 0) < 7:
                insights.append("Consider adding more comprehensive documentation and tests")
            
            # Activity insights
            if analysis.get("scores", {}).get("activity", 0) < 5:
                insights.append("Repository shows low recent activity - consider regular updates")
            
            # Architecture insights
            if analysis.get("code_analysis", {}).get("structure", {}).get("architecture_patterns"):
                patterns = analysis["code_analysis"]["structure"]["architecture_patterns"]
                if "separation-of-concerns" in patterns:
                    insights.append("Good architectural separation detected")
                if not patterns:
                    insights.append("Consider implementing clear architectural patterns")
            
            # Language insights
            if analysis.get("languages"):
                languages = analysis["languages"]
                if len(languages) > 5:
                    insights.append("High language diversity - consider focusing on core technologies")
                elif len(languages) == 1:
                    insights.append("Single language project - good for focused development")
            
        except Exception as e:
            self.logger.error(f"Failed to generate insights: {e}")
            insights = ["Analysis completed successfully"]
        
        return insights
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate improvement recommendations"""
        recommendations = []
        
        try:
            scores = analysis.get("scores", {})
            
            if scores.get("quality", 0) < 7:
                recommendations.extend([
                    "Add comprehensive README documentation",
                    "Implement automated testing",
                    "Add code style guidelines"
                ])
            
            if scores.get("activity", 0) < 5:
                recommendations.extend([
                    "Schedule regular maintenance updates",
                    "Set up automated dependency updates",
                    "Create development roadmap"
                ])
            
            if scores.get("technical", 0) < 6:
                recommendations.extend([
                    "Review code complexity",
                    "Consider refactoring complex functions",
                    "Add code review guidelines"
                ])
            
        except Exception as e:
            self.logger.error(f"Failed to generate recommendations: {e}")
            recommendations = ["Continue current development practices"]
        
        return recommendations

# Create analyzer instance
github_analyzer = GitHubAnalyzer()
