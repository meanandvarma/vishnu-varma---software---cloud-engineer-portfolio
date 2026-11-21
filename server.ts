import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '100kb' }));

// Security headers without blocking iframe preview
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple sliding-window rate limiter for API routes
const rateLimits = new Map<string, { count: number; resetAt: number }>();
function rateLimit(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const record = rateLimits.get(key);
    if (!record || now > record.resetAt) {
      rateLimits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a moment before trying again.',
      });
    }
    record.count += 1;
    next();
  };
}

// In-memory TTL cache
interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
let githubCache: CacheEntry<unknown> | null = null;
let leetcodeCache: CacheEntry<unknown> | null = null;

// Verified GitHub & LeetCode fallback snapshots (captured directly from public APIs)
const VERIFIED_GITHUB_FALLBACK = {
  source: 'snapshot',
  lastUpdated: '2026-11-21T00:14:00Z',
  profile: {
    login: 'vishnuvarma681',
    name: 'Vishnu Varma',
    html_url: 'https://github.com/vishnuvarma681',
    public_repos: 31,
    followers: 2,
    following: 4,
  },
  repos: [
    {
      name: 'PrepAI',
      description: 'AI powered Resume Inteliigence Application',
      language: 'Dart',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-09-22T14:07:48Z',
      html_url: 'https://github.com/vishnuvarma681/PrepAI',
    },
    {
      name: 'TalkTimeBackend',
      description: 'Created TalkTime Backend using SpringBoot, WebSockets and JPA Hibernate',
      language: 'Java',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-07-21T16:57:38Z',
      html_url: 'https://github.com/vishnuvarma681/TalkTimeBackend',
    },
    {
      name: 'TalkTime',
      description: 'A Real Time 1 vs 1 Chatting Application',
      language: 'Dart',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-07-10T05:18:36Z',
      html_url: 'https://github.com/vishnuvarma681/TalkTime',
    },
    {
      name: 'QuizInt_Backend',
      description: 'Created QuizInt Backend',
      language: 'Java',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-07-21T17:06:47Z',
      html_url: 'https://github.com/vishnuvarma681/QuizInt_Backend',
    },
    {
      name: 'QuizInt',
      description: 'Domain Specific Quiz Application for Interview Prep.',
      language: 'Dart',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-08-10T16:50:17Z',
      html_url: 'https://github.com/vishnuvarma681/QuizInt',
    },
    {
      name: 'devops-assessment',
      description: 'Full-stack Django + React Vite app containerized with Docker Compose & GitHub Actions CI/CD to Azure VM',
      language: 'Python',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-01-26T15:27:43Z',
      html_url: 'https://github.com/vishnuvarma681/devops-assessment',
    },
    {
      name: 'SkillFirst',
      description: 'Student Preparation Platform built with Flutter & Firebase',
      language: 'Dart',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-08-10T15:22:58Z',
      html_url: 'https://github.com/vishnuvarma681/SkillFirst',
    },
    {
      name: 'NotesBackend',
      description: 'Spring Boot REST backend for NotesApp with MySQL persistence',
      language: 'Java',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-06-28T07:21:11Z',
      html_url: 'https://github.com/vishnuvarma681/NotesBackend',
    },
    {
      name: 'NotesApp',
      description: 'Created Notes Flutter Application, Saves notes in the database using MySQL, by handling API request using SpringBoot',
      language: 'Dart',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-06-28T11:09:49Z',
      html_url: 'https://github.com/vishnuvarma681/NotesApp',
    },
    {
      name: 'User_Authenticate_Profile_Management',
      description: 'An User Authentication and Profile Mnagaement Application.',
      language: 'Kotlin',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-07-21T16:23:32Z',
      html_url: 'https://github.com/vishnuvarma681/User_Authenticate_Profile_Management',
    },
    {
      name: 'TripGo',
      description: 'An Trip Planning Application',
      language: 'Kotlin',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-07-21T15:38:13Z',
      html_url: 'https://github.com/vishnuvarma681/TripGo',
    },
    {
      name: 'OIBSIP',
      description: 'A Collection of Android Internships Projects built in Kotlin',
      language: 'Kotlin',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-04-13T16:05:38Z',
      html_url: 'https://github.com/vishnuvarma681/OIBSIP',
    },
    {
      name: 'Azure-app-Service',
      description: 'Static Web App configured with GitHub Actions Azure deployment workflow',
      language: 'CSS',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-01-06T06:37:11Z',
      html_url: 'https://github.com/vishnuvarma681/Azure-app-Service',
    },
    {
      name: 'StudentCRUD_basic',
      description: 'perform basic crud from scratch in springboot using ArrayList',
      language: 'Java',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-06-28T07:21:52Z',
      html_url: 'https://github.com/vishnuvarma681/StudentCRUD_basic',
    },
  ],
};

const VERIFIED_LEETCODE_FALLBACK = {
  source: 'snapshot',
  lastUpdated: '2026-11-21T00:14:00Z',
  username: 'VishnuNVarma',
  ranking: 164705,
  totalSolved: 573,
  totalSubmissions: 694,
  easySolved: 337,
  mediumSolved: 229,
  hardSolved: 7,
  streak: 260,
  totalActiveDays: 262,
  contestRating: 1621,
  attendedContests: 8,
  topPercentage: 21.87,
  badges: ['200 Days Badge 2026', '100 Days Badge 2026', '50 Days Badge 2026'],
  languages: [
    { languageName: 'Java', problemsSolved: 550 },
    { languageName: 'MySQL', problemsSolved: 22 },
    { languageName: 'Python', problemsSolved: 1 },
    { languageName: 'Bash', problemsSolved: 1 },
  ],
};

app.get('/api/github', rateLimit(30, 60_000), async (_req, res) => {
  try {
    if (githubCache && Date.now() - githubCache.fetchedAt < CACHE_TTL_MS) {
      return res.json(githubCache.data);
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'vishnu-varma-portfolio',
    };

    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/vishnuvarma681', { headers }),
      fetch('https://api.github.com/users/vishnuvarma681/repos?per_page=100&sort=updated', { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error(`GitHub API responded ${userRes.status}/${reposRes.status}`);
    }

    const userJson = await userRes.json();
    const reposJson = await reposRes.json();

    if (!Array.isArray(reposJson)) {
      throw new Error('Unexpected GitHub repositories payload');
    }

    const payload = {
      source: 'live',
      lastUpdated: new Date().toISOString(),
      profile: {
        login: userJson.login,
        name: userJson.name || 'Vishnu Varma',
        html_url: userJson.html_url,
        public_repos: userJson.public_repos,
        followers: userJson.followers,
        following: userJson.following,
      },
      repos: reposJson.map((r: Record<string, unknown>) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        updated_at: r.updated_at,
        html_url: r.html_url,
      })),
    };

    githubCache = { data: payload, fetchedAt: Date.now() };
    return res.json(payload);
  } catch {
    return res.json(VERIFIED_GITHUB_FALLBACK);
  }
});

app.get('/api/leetcode', rateLimit(30, 60_000), async (_req, res) => {
  try {
    if (leetcodeCache && Date.now() - leetcodeCache.fetchedAt < CACHE_TTL_MS) {
      return res.json(leetcodeCache.data);
    }

    const query = `query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile { ranking }
        submitStats { acSubmissionNum { difficulty count submissions } }
        badges { displayName }
        userCalendar { streak totalActiveDays }
        languageProblemCount { languageName problemsSolved }
      }
      userContestRanking(username: $username) {
        attendedContestsCount rating topPercentage
      }
    }`;

    const lcRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        'User-Agent': 'vishnu-varma-portfolio',
      },
      body: JSON.stringify({ query, variables: { username: 'VishnuNVarma' } }),
    });

    if (!lcRes.ok) {
      throw new Error(`LeetCode API responded ${lcRes.status}`);
    }

    const json = await lcRes.json();
    const user = json?.data?.matchedUser;
    const contest = json?.data?.userContestRanking;
    if (!user) {
      throw new Error('Missing matchedUser in LeetCode response');
    }

    const ac = user.submitStats?.acSubmissionNum || [];
    const byDiff = (d: string) =>
      ac.find((item: { difficulty: string; count: number }) => item.difficulty === d)?.count ?? 0;
    const allSubs =
      ac.find((item: { difficulty: string; submissions: number }) => item.difficulty === 'All')
        ?.submissions ?? 0;

    const payload = {
      source: 'live',
      lastUpdated: new Date().toISOString(),
      username: user.username,
      ranking: user.profile?.ranking ?? VERIFIED_LEETCODE_FALLBACK.ranking,
      totalSolved: byDiff('All'),
      totalSubmissions: allSubs,
      easySolved: byDiff('Easy'),
      mediumSolved: byDiff('Medium'),
      hardSolved: byDiff('Hard'),
      streak: user.userCalendar?.streak ?? VERIFIED_LEETCODE_FALLBACK.streak,
      totalActiveDays: user.userCalendar?.totalActiveDays ?? VERIFIED_LEETCODE_FALLBACK.totalActiveDays,
      contestRating: Math.round(contest?.rating ?? VERIFIED_LEETCODE_FALLBACK.contestRating),
      attendedContests: contest?.attendedContestsCount ?? VERIFIED_LEETCODE_FALLBACK.attendedContests,
      topPercentage: Number((contest?.topPercentage ?? VERIFIED_LEETCODE_FALLBACK.topPercentage).toFixed(2)),
      badges: (user.badges || []).map((b: { displayName: string }) => b.displayName),
      languages: user.languageProblemCount || VERIFIED_LEETCODE_FALLBACK.languages,
    };

    leetcodeCache = { data: payload, fetchedAt: Date.now() };
    return res.json(payload);
  } catch {
    return res.json(VERIFIED_LEETCODE_FALLBACK);
  }
});

// Ephemeral TalkTime sandbox room (memory-only, sanitized, rate-limited)
interface SandboxMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

const sandboxMessages: SandboxMessage[] = [
  {
    id: 'seed-1',
    sender: 'System Architecture Note',
    text: 'Sandbox room active. Open this portfolio in a second browser tab to test cross-session message syncing.',
    timestamp: new Date().toISOString(),
  },
];

function sanitizeText(input: string, maxLen: number): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

app.get('/api/chat/messages', rateLimit(60, 60_000), (_req, res) => {
  res.json({ messages: sandboxMessages });
});

app.post('/api/chat/messages', rateLimit(20, 60_000), (req, res) => {
  const sender = sanitizeText(String(req.body?.sender || ''), 32);
  const text = sanitizeText(String(req.body?.text || ''), 280);

  if (!sender || !text) {
    return res.status(400).json({ error: 'Display name and message text are required.' });
  }

  const msg: SandboxMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sender,
    text,
    timestamp: new Date().toISOString(),
  };

  sandboxMessages.push(msg);
  if (sandboxMessages.length > 25) {
    sandboxMessages.shift();
  }

  return res.status(201).json({ message: msg, messages: sandboxMessages });
});

// Optional server-side Gemini integration for PrepAI & QuizInt live mode
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.post('/api/demos/analyze-resume', rateLimit(10, 60_000), async (req, res) => {
  const resumeText = String(req.body?.resumeText || '').trim().slice(0, 6000);
  const jobDescription = String(req.body?.jobDescription || '').trim().slice(0, 2500);

  if (resumeText.length < 40 || jobDescription.length < 20) {
    return res.status(400).json({ error: 'Please provide both resume text and a target role description.' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'Live Gemini backend is not configured on this server. Switch to Browser-Local Engine for zero-network analysis.',
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Analyze this candidate resume against the target job description.\n\nRESUME:\n${resumeText}\n\nTARGET JOB DESCRIPTION:\n${jobDescription}`,
      config: {
        systemInstruction:
          'You are an objective technical ATS & engineering resume reviewer. Return concise, practical feedback without hype or fabricated claims.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER, description: '0 to 100 keyword and skill alignment score' },
            summary: { type: Type.STRING, description: '2-sentence objective summary' },
            detectedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim());
    return res.json({ mode: 'gemini-live', ...parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gemini API request failed';
    return res.status(502).json({ error: `Live AI analysis error: ${message}` });
  }
});

app.post('/api/demos/generate-quiz', rateLimit(10, 60_000), async (req, res) => {
  const topic = sanitizeText(String(req.body?.topic || 'Java & Spring Boot'), 80);

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'Live Gemini backend is not configured on this server. Use the Curated Question Bank instead.',
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Generate 5 technical interview multiple-choice questions on the topic: "${topic}".`,
      config: {
        systemInstruction:
          'Create accurate, practical computer science and software engineering interview questions with 4 options each and a concise explanation.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
          },
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '[]').trim());
    return res.json({ mode: 'gemini-live', questions: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gemini API request failed';
    return res.status(502).json({ error: `Quiz generation error: ${message}` });
  }
});

async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distPath, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
