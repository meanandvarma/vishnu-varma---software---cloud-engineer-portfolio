export type EvidenceStatus = 'Verified' | 'Resume-Stated' | 'Planned';

export type ProjectCategory = 'Java Backend' | 'Cloud & DevOps' | 'AI & Flutter';

export type PlaygroundTabId = 'prepai' | 'talktime' | 'quizint' | 'terraform' | 'cicd';

export interface ArchitectureNode {
  id: string;
  label: string;
  role: string;
  layer: 'Client' | 'Security' | 'Service' | 'Data' | 'AI / Cloud';
}

export interface ProjectItem {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  category: ProjectCategory;
  evidenceStatus: EvidenceStatus;
  sourceNote: string;
  featured: boolean;
  thumbnail?: string;
  image?: string;
  imageAlt?: string;
  video?: string;
  videoDuration?: string;
  captionsUrl?: string;
  demoAvailable?: boolean;
  problemSolved: string;
  summary: string;
  contribution: string;
  technologies: string[];
  keyFeatures: string[];
  architectureOverview: string;
  architectureNodes: ArchitectureNode[];
  apiFlow?: string[];
  databaseSchema?: { table: string; columns: string[] }[];
  technicalChallenges: string[];
  engineeringDecisions: string[];
  learnings: string[];
  githubUrls: { label: string; url: string }[];
  playgroundTab?: PlaygroundTabId;
}

export interface SkillItem {
  name: string;
  status: 'Used in Projects' | 'Certified' | 'Coursework' | 'Exploring';
  context: string;
  projectSlugs?: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  code?: string;
  issuer: string;
  date?: string;
  evidenceStatus: EvidenceStatus;
  credentialNote: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  detail: string;
  source: string;
  evidenceStatus: EvidenceStatus;
  link?: string;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  timeframe: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  description: string;
  tags: string[];
}

export interface GitHubRepoSummary {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

export interface GitHubStatsResponse {
  source: 'live' | 'snapshot';
  lastUpdated: string;
  profile: {
    login: string;
    name: string;
    html_url: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  repos: GitHubRepoSummary[];
}

export interface LeetCodeStatsResponse {
  source: 'live' | 'snapshot';
  lastUpdated: string;
  username: string;
  ranking: number;
  totalSolved: number;
  totalSubmissions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: number;
  totalActiveDays: number;
  contestRating: number;
  attendedContests: number;
  topPercentage: number;
  badges: string[];
  languages: { languageName: string; problemsSolved: number }[];
}
