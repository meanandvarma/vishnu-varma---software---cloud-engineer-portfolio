import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ExternalLink, ArrowUpRight, Terminal } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import { ProjectItem } from '../types/portfolio';
import { ProjectVideo } from '../components/ProjectVideo';
import { ProjectVideoModal } from '../components/ProjectVideoModal';

export function ProjectsSection() {
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  const featuredProjects = PROJECTS_DATA.filter((p) => p.featured);
  const leadProjects = featuredProjects.slice(0, 2); // PrepAI & TalkTime (Alternating showcase)
  const secondaryProjects = featuredProjects.slice(2, 4); // QuizInt & DevOps CI/CD (2-col editorial)
  const additionalProjects = PROJECTS_DATA.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="mx-auto max-w-[1140px] px-5 py-16 sm:px-8 md:py-24 border-t border-slate-200/80 dark:border-white/[0.07]"
    >
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Selected Projects
        </p>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Systems built across Java, Flutter, and Azure.
        </h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          Four core projects selected from public repositories. Watch walkthrough previews, inspect architecture details, or browse source code.
        </p>
      </div>

      {/* Alternating Featured Showcases (PrepAI & TalkTime) */}
      <div className="mt-14 space-y-16 md:space-y-20">
        {leadProjects.map((project, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <article
              key={project.slug}
              className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12"
            >
              <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                <ProjectVideo project={project} onOpenModal={setModalProject} aspect="16/10" />
              </div>

              <div className={`lg:col-span-5 space-y-4 ${isReversed ? 'lg:order-1' : ''}`}>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  0{idx + 1}. {project.category} · {project.evidenceStatus}
                </p>

                <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {project.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[15px]">
                  {project.tagline}
                </p>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-900 dark:text-slate-200">Contribution:</span>{' '}
                  {project.contribution}
                </p>

                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {project.technologies.slice(0, 5).join(' · ')}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-2 text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => setModalProject(project)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950 cursor-pointer whitespace-nowrap"
                  >
                    <Play className="h-3.5 w-3.5" /> Watch Demo
                  </button>

                  {project.githubUrls[0] && (
                    <a
                      href={project.githubUrls[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
                    >
                      View Source <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
                  >
                    View Details <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>

                  {project.demoAvailable && project.playgroundTab && (
                    <Link
                      to={`/playground/${project.playgroundTab}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                    >
                      <Terminal className="h-3.5 w-3.5" /> Try Interactive Demo
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Two-Column Secondary Featured Projects (QuizInt & DevOps CI/CD) */}
      <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-12 pt-14 border-t border-slate-200/70 dark:border-white/[0.06]">
        {secondaryProjects.map((project, idx) => (
          <article key={project.slug} className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <ProjectVideo project={project} onOpenModal={setModalProject} aspect="16/10" />

              <div className="space-y-2.5 pt-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  0{idx + 3}. {project.category} · {project.evidenceStatus}
                </p>
                <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {project.tagline}
                </p>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Contribution:</span>{' '}
                  {project.contribution}
                </p>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {project.technologies.slice(0, 5).join(' · ')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setModalProject(project)}
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5" /> Watch Demo
              </button>

              {project.githubUrls[0] && (
                <a
                  href={project.githubUrls[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
                >
                  View Source <ExternalLink className="h-3 w-3" />
                </a>
              )}

              <Link
                to={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
              >
                View Details <ArrowUpRight className="h-3 w-3" />
              </Link>

              {project.demoAvailable && project.playgroundTab && (
                <Link
                  to={`/playground/${project.playgroundTab}`}
                  className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
                >
                  Try Interactive Demo
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Quiet Additional Architectures Strip */}
      {additionalProjects.length > 0 && (
        <div className="mt-14 pt-8 border-t border-slate-200/70 dark:border-white/[0.06] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Additional architectures &amp; coursework:</span>
          <div className="flex flex-wrap items-center gap-5">
            {additionalProjects.map((proj) => (
              <Link
                key={proj.slug}
                to={`/projects/${proj.slug}`}
                className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {proj.title} <ArrowUpRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <ProjectVideoModal project={modalProject} onClose={() => setModalProject(null)} />
    </section>
  );
}
