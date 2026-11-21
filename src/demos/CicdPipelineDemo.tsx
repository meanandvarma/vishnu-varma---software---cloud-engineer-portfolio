import { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertTriangle, Loader2, Circle } from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  duration: string;
  logs: string[];
}

const STAGES: PipelineStage[] = [
  {
    id: 'commit',
    name: 'Source Commit',
    duration: '0.4s',
    logs: ['Checked out commit 8f31c9a on branch main', 'Verified GitHub Actions runner ubuntu-latest'],
  },
  {
    id: 'build',
    name: 'Maven Build',
    duration: '8.2s',
    logs: ['./mvnw -B package -DskipTests', 'Compiled 24 Java 22 source files (Spring Boot 3.3.1)'],
  },
  {
    id: 'test',
    name: 'Unit Tests',
    duration: '5.6s',
    logs: ['./mvnw test', 'Tests run: 14, Failures: 0, Errors: 0, Skipped: 0'],
  },
  {
    id: 'docker',
    name: 'Docker Build',
    duration: '9.1s',
    logs: ['docker build -t vishnuacr.azurecr.io/spring-api:8f31c9a .', 'Multi-stage Eclipse Temurin 22 JRE image built (184 MB)'],
  },
  {
    id: 'acr',
    name: 'ACR Push',
    duration: '4.3s',
    logs: ['az acr login --name vishnuacr', 'Pushed digest sha256:49ac...f12 to Azure Container Registry'],
  },
  {
    id: 'deploy',
    name: 'App Service Deploy',
    duration: '6.8s',
    logs: ['Updated container tag on Azure App Service', 'Swapping staging container slot...'],
  },
  {
    id: 'health',
    name: 'Health Check',
    duration: '3.0s',
    logs: ['Polling GET /actuator/health (max 3 attempts)'],
  },
  {
    id: 'rollback',
    name: 'Rollback Guard',
    duration: '2.1s',
    logs: ['Monitoring post-release readiness'],
  },
];

type StageState = 'idle' | 'running' | 'success' | 'failed' | 'skipped';

export function CicdPipelineDemo() {
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [running, setRunning] = useState(false);
  const [stageStates, setStageStates] = useState<Record<string, StageState>>({});
  const [logs, setLogs] = useState<string[]>([
    'Ready. Click "Run Pipeline Simulation" to step through the 8-stage Spring Boot CI/CD workflow.',
  ]);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const runPipeline = async () => {
    if (running) return;
    setRunning(true);
    setStageStates({});
    setLogs(['Starting GitHub Actions workflow: spring-boot-ci-cd.yml...']);

    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i];

      // On healthy runs, Rollback Guard completes as "no rollback required"
      if (stage.id === 'rollback' && !simulateFailure) {
        setStageStates((prev) => ({ ...prev, [stage.id]: 'skipped' }));
        setLogs((prev) => [...prev, '[Rollback Guard] Health check passed HTTP 200 UP. Rollback not needed.']);
        break;
      }

      setStageStates((prev) => ({ ...prev, [stage.id]: 'running' }));
      setLogs((prev) => [...prev, `>>> Stage ${i + 1}: ${stage.name}`]);
      await sleep(420);

      if (stage.id === 'health' && simulateFailure) {
        setStageStates((prev) => ({ ...prev, [stage.id]: 'failed' }));
        setLogs((prev) => [
          ...prev,
          'GET /actuator/health returned HTTP 503 Service Unavailable (Database connection timeout).',
          'Triggering automated rollback to previous verified SHA tag (7d20b11)...',
        ]);
        continue;
      }

      if (stage.id === 'rollback' && simulateFailure) {
        setStageStates((prev) => ({ ...prev, [stage.id]: 'success' }));
        setLogs((prev) => [
          ...prev,
          'Reverted App Service container tag to 7d20b11.',
          'GET /actuator/health returned HTTP 200 UP. Production traffic restored.',
        ]);
        break;
      }

      setStageStates((prev) => ({ ...prev, [stage.id]: 'success' }));
      setLogs((prev) => [...prev, ...stage.logs]);
    }

    setRunning(false);
  };

  const reset = () => {
    if (running) return;
    setStageStates({});
    setLogs(['Pipeline reset. Click "Run Pipeline Simulation" to start.']);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            Spring Boot CI/CD &amp; Automated Rollback Simulator
          </h3>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            Simulated 8-stage pipeline covering Maven, Docker, Azure Container Registry, Health Check, and Failure Rollback.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={simulateFailure}
              disabled={running}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Simulate Health Check Failure</span>
          </label>
          <button
            type="button"
            disabled={running}
            onClick={runPipeline}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:text-slate-950 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" /> {running ? 'Running...' : 'Run Pipeline Simulation'}
          </button>
          <button
            type="button"
            disabled={running}
            onClick={reset}
            aria-label="Reset pipeline"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage, idx) => {
          const st = stageStates[stage.id] || 'idle';
          return (
            <div
              key={stage.id}
              className={`rounded-xl border p-3.5 transition-colors ${
                st === 'running'
                  ? 'border-blue-500 bg-blue-500/10'
                  : st === 'success'
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : st === 'failed'
                      ? 'border-rose-500/50 bg-rose-500/10'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0A0E17]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 dark:text-slate-400">0{idx + 1}</span>
                {st === 'running' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                {st === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                {st === 'failed' && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                {(st === 'idle' || st === 'skipped') && <Circle className="h-3.5 w-3.5 text-slate-400" />}
              </div>
              <p className="mt-2 font-display text-sm font-semibold text-slate-900 dark:text-white">
                {stage.name}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                {st === 'skipped' ? 'Not triggered' : st === 'idle' ? `Est. ${stage.duration}` : st.toUpperCase()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-300 max-h-56 overflow-y-auto space-y-1">
        {logs.map((line, i) => (
          <div
            key={i}
            className={
              line.includes('503') || line.includes('timeout')
                ? 'text-rose-400'
                : line.includes('HTTP 200') || line.includes('Restored') || line.includes('Failures: 0')
                  ? 'text-emerald-400'
                  : line.startsWith('>>>')
                    ? 'text-blue-400 font-semibold'
                    : ''
            }
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
