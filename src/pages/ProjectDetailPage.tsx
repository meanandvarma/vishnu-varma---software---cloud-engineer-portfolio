import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Terminal, Layers, Database, GitBranch } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import { ProjectVideo } from '../components/ProjectVideo';
import { ProjectVideoModal } from '../components/ProjectVideoModal';
import { ProjectItem } from '../types/portfolio';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  const [videoModalProject, setVideoModalProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!project) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Project Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The requested project breakdown does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8 space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {project.githubUrls.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 hover:border-blue-500/40"
            >
              {repo.label} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
          {project.demoAvailable && project.playgroundTab && (
            <Link
              to={`/playground/${project.playgroundTab}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950"
            >
              <Terminal className="h-3.5 w-3.5" /> Try Interactive Demo
            </Link>
          )}
        </div>
      </div>

      {/* Editorial Header */}
      <header className="space-y-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-8">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {project.category} · {project.evidenceStatus}
        </p>

        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {project.title}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {project.summary}
        </p>
        <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
          {project.sourceNote}
        </p>
      </header>

      {/* Reusable Video Showcase */}
      <ProjectVideo project={project} onOpenModal={setVideoModalProject} aspect="16/9" />

      {/* Architecture Flow */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            System Architecture
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {project.architectureOverview}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {project.architectureNodes.map((node, i) => (
            <div
              key={node.id}
              className="border-t border-slate-200 dark:border-white/10 pt-3 space-y-1"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                <span>0{i + 1}</span>
                <span>{node.layer}</span>
              </div>
              <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                {node.label}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {node.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem, Contribution & Capabilities */}
      <div className="grid gap-10 md:grid-cols-2 border-t border-slate-200/80 dark:border-white/[0.08] pt-8">
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Problem &amp; Contribution
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">Problem Solved:</strong> {project.problemSolved}
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">Contribution:</strong> {project.contribution}
          </p>
          <p className="pt-2 font-mono text-xs text-slate-500 dark:text-slate-400">
            {project.technologies.join(' · ')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Key Capabilities
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {project.keyFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-blue-600 dark:text-blue-400">→</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* API Flow & Database Schema when available */}
      {(project.apiFlow || project.databaseSchema) && (
        <div className="grid gap-10 md:grid-cols-2 border-t border-slate-200/80 dark:border-white/[0.08] pt-8">
          {project.apiFlow && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Request &amp; API Flow
                </h2>
              </div>
              <ol className="space-y-2 font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {project.apiFlow.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>
          )}

          {project.databaseSchema && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Database Schema Overview
                </h2>
              </div>
              <div className="divide-y divide-slate-200/70 dark:divide-white/[0.07]">
                {project.databaseSchema.map((tbl) => (
                  <div key={tbl.table} className="py-2.5 font-mono text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">{tbl.table}</p>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400">{tbl.columns.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Challenges, Decisions & Learnings */}
      <section className="grid gap-8 md:grid-cols-3 border-t border-slate-200/80 dark:border-white/[0.08] pt-8">
        <div className="space-y-2">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
            Technical Challenges
          </h3>
          <ul className="space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {project.technicalChallenges.map((c, i) => (
              <li key={i}>· {c}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
            Engineering Decisions
          </h3>
          <ul className="space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {project.engineeringDecisions.map((d, i) => (
              <li key={i}>· {d}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
            Key Learnings
          </h3>
          <ul className="space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {project.learnings.map((l, i) => (
              <li key={i}>· {l}</li>
            ))}
          </ul>
        </div>
      </section>

      <ProjectVideoModal project={videoModalProject} onClose={() => setVideoModalProject(null)} />
    </main>
  );
}
