import { Link } from 'react-router-dom';
import { SKILL_CATEGORIES } from '../data/skills';

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="mx-auto max-w-[1140px] px-5 py-16 sm:px-8 md:py-24 border-t border-slate-200/80 dark:border-white/[0.07]"
    >
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Technical Skills
        </p>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Tools and technologies applied in projects.
        </h2>
      </div>

      <div className="mt-10 divide-y divide-slate-200/80 dark:divide-white/[0.07]">
        {SKILL_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="grid gap-4 py-6 md:grid-cols-12 md:items-start"
          >
            <div className="md:col-span-4">
              <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                {category.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {category.description}
              </p>
            </div>

            <div className="md:col-span-8 flex flex-wrap gap-x-6 gap-y-3">
              {category.skills.map((skill) => (
                <div key={skill.name} className="min-w-[180px] flex-1 basis-[210px] space-y-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {skill.name}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {skill.status}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {skill.context}
                    {skill.projectSlugs && skill.projectSlugs[0] && (
                      <>
                        {' '}
                        <Link
                          to={`/projects/${skill.projectSlugs[0]}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Details →
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
