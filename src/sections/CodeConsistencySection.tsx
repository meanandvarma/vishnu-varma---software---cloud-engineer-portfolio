import { ExternalLink, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GitHubStatsResponse, LeetCodeStatsResponse } from '../types/portfolio';
import { SOCIAL_LINKS } from '../data/socialLinks';

interface CodeConsistencySectionProps {
  leetcode: LeetCodeStatsResponse | null;
  github: GitHubStatsResponse | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function CodeConsistencySection({
  leetcode,
  github,
  loading,
  error,
  onRefresh,
}: CodeConsistencySectionProps) {
  const difficultyData = leetcode
    ? [
        { name: 'Easy', count: leetcode.easySolved, color: '#10B981' },
        { name: 'Medium', count: leetcode.mediumSolved, color: '#3B82F6' },
        { name: 'Hard', count: leetcode.hardSolved, color: '#8B5CF6' },
      ]
    : [];

  const featuredRepoNames = new Set([
    'PrepAI',
    'TalkTimeBackend',
    'TalkTime',
    'QuizInt_Backend',
    'QuizInt',
    'devops-assessment',
  ]);

  const repos = (github?.repos || [])
    .filter((r) => featuredRepoNames.has(r.name))
    .slice(0, 6);

  return (
    <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-8 md:py-24 border-t border-slate-200/80 dark:border-white/[0.07]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Code, Consistency &amp; Problem Solving
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Verified algorithms practice and open-source activity.
          </h2>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Stats'}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-xs text-amber-700 dark:text-amber-400">
          {error} (showing verified snapshot data).
        </p>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        {/* Left: Compact LeetCode Summary & Restrained Chart */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/[0.07] pb-3">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                LeetCode · {leetcode?.username ?? 'VishnuNVarma'}
              </h3>
              <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {leetcode?.source === 'live' ? 'Live GraphQL' : 'Verified Snapshot'} ·{' '}
                {leetcode ? new Date(leetcode.lastUpdated).toLocaleDateString() : '2026'}
              </p>
            </div>
            <a
              href={SOCIAL_LINKS.leetcode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              LeetCode Profile <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {leetcode && (
            <>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                    {leetcode.totalSolved}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Problems Solved</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                    {leetcode.streak}d
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Active Streak</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                    {leetcode.contestRating}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Rating (Top {leetcode.topPercentage}%)
                  </p>
                </div>
              </div>

              <div className="h-36 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={difficultyData}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={60}
                      tick={{ fill: '#94A3B8', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                      {difficultyData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Easy {leetcode.easySolved} · Medium {leetcode.mediumSolved} · Hard {leetcode.hardSolved} ·{' '}
                {leetcode.languages.map((l) => `${l.languageName} (${l.problemsSolved})`).join(' · ')}
              </p>
            </>
          )}
        </div>

        {/* Right: Concise Featured Repositories List */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/[0.07] pb-3">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                GitHub · @{github?.profile.login ?? 'vishnuvarma681'}
              </h3>
              <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                {github?.profile.public_repos ?? 31} Public Repositories
              </p>
            </div>
            <a
              href={SOCIAL_LINKS.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              All Repositories <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="divide-y divide-slate-200/70 dark:divide-white/[0.06]">
            {repos.map((repo) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 py-3.5 first:pt-1 transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-display text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {repo.name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    {repo.description || 'Public source repository on GitHub.'}
                  </p>
                </div>
                <div className="shrink-0 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  <p>{repo.language || 'Code'}</p>
                  <p>{new Date(repo.updated_at).toLocaleDateString()}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
