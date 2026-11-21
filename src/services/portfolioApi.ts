import { GitHubStatsResponse, LeetCodeStatsResponse } from '../types/portfolio';

export async function fetchGitHubStats(): Promise<GitHubStatsResponse> {
  const res = await fetch('/api/github');
  if (!res.ok) {
    throw new Error('Failed to load GitHub repositories');
  }
  return res.json();
}

export async function fetchLeetCodeStats(): Promise<LeetCodeStatsResponse> {
  const res = await fetch('/api/leetcode');
  if (!res.ok) {
    throw new Error('Failed to load LeetCode statistics');
  }
  return res.json();
}
