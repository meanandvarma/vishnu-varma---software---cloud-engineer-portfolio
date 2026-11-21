import { useState } from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, Sparkles, FileText, RotateCcw } from 'lucide-react';

interface AnalysisResult {
  mode: 'local-engine' | 'gemini-live';
  matchScore: number;
  summary: string;
  detectedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
}

const SAMPLE_RESUMES = {
  sde: `Vishnu Varma — B.Tech Computer Science (CGPA 8.19)
Skills: Java, Spring Boot, Hibernate, JPA, WebSockets (STOMP), Spring Security, MySQL, Flutter, Dart, Kotlin, REST APIs, Git, Maven.
Projects:
- TalkTime: Built real-time 1-to-1 chat backend with Spring Boot, WebSockets, Firebase Auth, JWT, and MySQL.
- QuizInt: Created Spring Boot REST API integrating Gemini API with JSON parsing and retry logic for a Flutter Material 3 client.
- PrepAI: Architected Flutter app with Riverpod and audio/WebSocket integrations for resume evaluation.
DSA: Solved 573 LeetCode problems (550 in Java) with a 260-day streak.`,
  cloud: `Vishnu Varma — B.Tech CSE (2023–2027)
Certifications: AZ-900 Azure Fundamentals, AI-900 Azure AI Fundamentals, DP-900, SC-900, NPTEL Computer Networks.
Skills: Microsoft Azure, Terraform, Docker, Docker Compose, GitHub Actions, Nginx, Azure VM, Azure Container Registry, Azure Key Vault, Linux, MySQL.
Projects:
- DevOps Assessment: Containerized Django and React/Nginx stack with Docker Compose and deployed to Azure VM via GitHub Actions CI/CD.
- Cloud Infrastructure Automation: Designed modular Terraform configurations for Azure VNet, Subnets, NSG, Storage, and Key Vault.`,
};

const SAMPLE_JDS = {
  javaBackend: {
    label: 'Java Backend Engineer (SDE)',
    text: 'Looking for a Software Engineer with strong Java, Spring Boot, REST API design, Spring Security / JWT authentication, JPA/Hibernate, MySQL relational modeling, WebSockets, unit testing (JUnit), Docker basics, and solid Data Structures & Algorithms.',
    keywords: [
      'java',
      'spring boot',
      'rest',
      'spring security',
      'jwt',
      'jpa',
      'hibernate',
      'mysql',
      'websockets',
      'junit',
      'docker',
      'algorithms',
    ],
  },
  azureDevops: {
    label: 'Azure Cloud & DevOps Engineer',
    text: 'Seeking a Cloud/DevOps Engineer experienced with Microsoft Azure, Terraform Infrastructure-as-Code, Docker containers, GitHub Actions CI/CD pipelines, Linux networking, Key Vault secret management, Azure Container Registry, and Kubernetes.',
    keywords: [
      'azure',
      'terraform',
      'docker',
      'github actions',
      'ci/cd',
      'linux',
      'key vault',
      'container registry',
      'kubernetes',
      'nginx',
      'vnet',
      'nsg',
    ],
  },
};

function runLocalAnalysis(resumeText: string, jdKey: keyof typeof SAMPLE_JDS, customJd: string): AnalysisResult {
  const lowerResume = resumeText.toLowerCase();
  const jdWords =
    SAMPLE_JDS[jdKey].keywords.filter((kw) => customJd.toLowerCase().includes(kw) || customJd === SAMPLE_JDS[jdKey].text);
  const targetKeywords = jdWords.length > 0 ? jdWords : SAMPLE_JDS[jdKey].keywords;

  const detectedSkills = targetKeywords.filter((kw) => lowerResume.includes(kw));
  const missingKeywords = targetKeywords.filter((kw) => !lowerResume.includes(kw));
  const matchScore = Math.min(96, Math.max(24, Math.round((detectedSkills.length / targetKeywords.length) * 100)));

  const strengths: string[] = [];
  if (detectedSkills.length >= 5) {
    strengths.push(`Strong keyword overlap across ${detectedSkills.length} core technical requirements.`);
  }
  if (/\d+/.test(resumeText)) {
    strengths.push('Includes concrete measurable evidence (problem counts, CGPA, or project metrics).');
  }
  if (lowerResume.includes('spring boot') || lowerResume.includes('docker')) {
    strengths.push('Demonstrates practical backend or deployment tooling beyond coursework.');
  }
  if (strengths.length === 0) {
    strengths.push('Provides baseline technical terminology; add specific project outcomes to strengthen impact.');
  }

  const improvements: string[] = [];
  if (missingKeywords.length > 0) {
    improvements.push(`Consider adding verified experience or coursework related to: ${missingKeywords.slice(0, 4).join(', ')}.`);
  }
  if (!lowerResume.includes('test') && !lowerResume.includes('junit')) {
    improvements.push('Highlight automated testing (JUnit 5, integration tests, or CI validation checks).');
  }
  improvements.push('Pair each project bullet with the specific engineering problem, architecture choice, and observable outcome.');

  return {
    mode: 'local-engine',
    matchScore,
    summary: `Browser-local keyword rubric matched ${detectedSkills.length} of ${targetKeywords.length} target signals (${matchScore}% alignment) for ${SAMPLE_JDS[jdKey].label}.`,
    detectedSkills: detectedSkills.map((s) => s.toUpperCase()),
    missingKeywords: missingKeywords.map((s) => s.toUpperCase()),
    strengths,
    improvements,
  };
}

export function PrepAIDemo() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES.sde);
  const [jdKey, setJdKey] = useState<keyof typeof SAMPLE_JDS>('javaBackend');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JDS.javaBackend.text);
  const [useLiveGemini, setUseLiveGemini] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult>(() =>
    runLocalAnalysis(SAMPLE_RESUMES.sde, 'javaBackend', SAMPLE_JDS.javaBackend.text)
  );

  const handleSelectJd = (key: keyof typeof SAMPLE_JDS) => {
    setJdKey(key);
    setJobDescription(SAMPLE_JDS[key].text);
  };

  const handleAnalyze = async () => {
    setError(null);
    if (resumeText.trim().length < 40) {
      setError('Please enter at least 40 characters of resume text to analyze.');
      return;
    }

    if (!useLiveGemini) {
      setResult(runLocalAnalysis(resumeText, jdKey, jobDescription));
      return;
    }

    if (!privacyConsent) {
      setError('Please confirm consent before sending text to the live Gemini backend, or keep Browser-Local Engine selected.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/demos/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Live analysis failed');
      }
      setResult({
        mode: 'gemini-live',
        matchScore: Number(data.matchScore) || 0,
        summary: data.summary || '',
        detectedSkills: Array.isArray(data.detectedSkills) ? data.detectedSkills : [],
        missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
        strengths: Array.isArray(data.strengths) ? data.strengths : [],
        improvements: Array.isArray(data.improvements) ? data.improvements : [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach live Gemini backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            PrepAI — Resume Intelligence &amp; ATS Alignment Demo
          </h3>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            Inspired by the PrepAI Flutter &amp; Azure AI project. Runs locally in your browser by default with zero data retention.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{useLiveGemini ? 'Live Gemini Endpoint (Opt-in)' : 'Browser-Local Simulation Engine'}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Inputs */}
        <div className="space-y-4 lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="prepai-resume" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Candidate Resume Text
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResumeText(SAMPLE_RESUMES.sde)}
                className="rounded-md border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Load SDE Sample
              </button>
              <button
                type="button"
                onClick={() => setResumeText(SAMPLE_RESUMES.cloud)}
                className="rounded-md border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Load Cloud Sample
              </button>
            </div>
          </div>
          <textarea
            id="prepai-resume"
            rows={7}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste resume text here..."
            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0E17] p-3.5 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="prepai-jd" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Job Description
            </label>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-white/5 p-1">
              {(Object.keys(SAMPLE_JDS) as Array<keyof typeof SAMPLE_JDS>).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectJd(key)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    jdKey === key
                      ? 'bg-white dark:bg-[#1A2234] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {SAMPLE_JDS[key].label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            id="prepai-jd"
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0E17] p-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
          />

          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Analysis Engine</span>
              <div className="flex items-center gap-1 rounded-lg bg-slate-200/70 dark:bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setUseLiveGemini(false);
                    setError(null);
                  }}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer ${
                    !useLiveGemini
                      ? 'bg-white dark:bg-[#1A2234] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Browser-Local (Private)
                </button>
                <button
                  type="button"
                  onClick={() => setUseLiveGemini(true)}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer ${
                    useLiveGemini
                      ? 'bg-white dark:bg-[#1A2234] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sparkles className="h-3 w-3" /> Live Gemini API
                </button>
              </div>
            </div>

            {useLiveGemini && (
              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  I consent to send the text above to the server-side Gemini endpoint for evaluation (not persisted).
                </span>
              </label>
            )}
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleAnalyze}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
            <button
              type="button"
              onClick={() => {
                setResumeText(SAMPLE_RESUMES.sde);
                handleSelectJd('javaBackend');
                setResult(runLocalAnalysis(SAMPLE_RESUMES.sde, 'javaBackend', SAMPLE_JDS.javaBackend.text));
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Right Structured Output */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0A0E17] p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-4">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Keyword &amp; Role Alignment Score
              </p>
              <p className="mt-1 font-display text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {result.matchScore}%
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 dark:text-slate-400">
              <span>Mode</span>
              <p className="font-mono font-medium text-slate-800 dark:text-slate-200">
                {result.mode === 'gemini-live' ? 'Gemini 4 Hydrogen' : 'Local Rubric Engine'}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.summary}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Detected Keywords ({result.detectedSkills.length})
              </h4>
              <p className="mt-2 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {result.detectedSkills.length > 0 ? result.detectedSkills.join(' · ') : 'None matched'}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Missing Keywords ({result.missingKeywords.length})
              </h4>
              <p className="mt-2 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {result.missingKeywords.length > 0 ? result.missingKeywords.join(' · ') : 'All sample keywords covered'}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-200 dark:border-white/[0.08] pt-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Strengths
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {result.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Suggested Improvements
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {result.improvements.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-blue-600 dark:text-blue-400">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
