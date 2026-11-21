import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PlaygroundTabId } from '../types/portfolio';
import { PrepAIDemo } from '../demos/PrepAIDemo';
import { TalkTimeDemo } from '../demos/TalkTimeDemo';
import { QuizIntDemo } from '../demos/QuizIntDemo';
import { TerraformExplorerDemo } from '../demos/TerraformExplorerDemo';
import { CicdPipelineDemo } from '../demos/CicdPipelineDemo';
import { ErrorBoundary } from '../components/ErrorBoundary';

const TABS: Array<{ id: PlaygroundTabId; label: string; note: string }> = [
  { id: 'prepai', label: 'PrepAI Analyzer', note: 'Browser-local ATS engine + optional Gemini AI' },
  { id: 'talktime', label: 'TalkTime Chat', note: 'Ephemeral cross-tab sandbox' },
  { id: 'quizint', label: 'QuizInt Quiz', note: 'Curated question bank + optional Gemini AI' },
  { id: 'terraform', label: 'Azure Terraform', note: 'Local HCL topology simulation' },
  { id: 'cicd', label: 'Spring CI/CD', note: 'Simulated 8-stage pipeline & rollback' },
];

export function PlaygroundPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const validTab: PlaygroundTabId =
    tab && TABS.some((t) => t.id === tab) ? (tab as PlaygroundTabId) : 'prepai';

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [validTab]);

  return (
    <main className="mx-auto max-w-[1140px] px-5 py-12 sm:px-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          Optional Interactive Sandboxes · Clearly Separated from Production Videos
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Interactive Project Sandboxes
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Secondary interactive modules built to demonstrate system flows directly in the browser. Simulated behavior is labeled inside each module.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Interactive project sandboxes"
        className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#111827] p-1.5"
      >
        {TABS.map((t) => {
          const isActive = validTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => navigate(`/playground/${t.id}`)}
              className={`flex-1 min-w-[140px] rounded-lg px-3.5 py-2 text-left transition-colors cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="block font-display text-xs font-semibold whitespace-nowrap">{t.label}</span>
              <span className="block text-[11px] opacity-75 whitespace-nowrap">{t.note}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111827] p-5 sm:p-6">
        <ErrorBoundary fallbackTitle="Sandbox module failed to load">
          {validTab === 'prepai' && <PrepAIDemo />}
          {validTab === 'talktime' && <TalkTimeDemo />}
          {validTab === 'quizint' && <QuizIntDemo />}
          {validTab === 'terraform' && <TerraformExplorerDemo />}
          {validTab === 'cicd' && <CicdPipelineDemo />}
        </ErrorBoundary>
      </div>
    </main>
  );
}
