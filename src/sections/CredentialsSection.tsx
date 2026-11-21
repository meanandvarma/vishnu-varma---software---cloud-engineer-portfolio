import { ExternalLink } from 'lucide-react';
import { EDUCATION_DATA } from '../data/education';
import { CERTIFICATIONS_DATA } from '../data/certifications';
import { ACHIEVEMENTS_DATA } from '../data/achievements';

export function CredentialsSection() {
  // Highlight complementary achievements here without repeating the LeetCode grid above
  const highlights = ACHIEVEMENTS_DATA.filter((a) => a.id !== 'leetcode-573');

  return (
    <section
      id="achievements"
      className="mx-auto max-w-[1140px] px-5 py-16 sm:px-8 md:py-24 border-t border-slate-200/80 dark:border-white/[0.07]"
    >
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Education &amp; Credentials
        </p>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Academic background, certifications, and milestones.
        </h2>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        {/* Left: Education Block */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Education
          </h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {EDUCATION_DATA.institution}
              </p>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {EDUCATION_DATA.period}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{EDUCATION_DATA.degree}</p>
            <p className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400 tabular-nums">
              CGPA {EDUCATION_DATA.cgpa}
            </p>
            <p className="pt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-800 dark:text-slate-200">Coursework:</span>{' '}
              {EDUCATION_DATA.coursework.join(' · ')}
            </p>
            <p className="pt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-500">
              {EDUCATION_DATA.degreeVariantsNote}
            </p>
          </div>
        </div>

        {/* Right: Certifications & Achievements Lists */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Certifications
            </h3>
            <ul className="divide-y divide-slate-200/70 dark:divide-white/[0.06]">
              {CERTIFICATIONS_DATA.map((cert) => (
                <li
                  key={cert.id}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {cert.name}
                    </span>
                    <span className="ml-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {cert.issuer}
                      {cert.code ? ` · ${cert.code}` : ''}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    {cert.date || cert.evidenceStatus}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Achievements
            </h3>
            <ul className="divide-y divide-slate-200/70 dark:divide-white/[0.06]">
              {highlights.map((ach) => (
                <li key={ach.id} className="py-3 space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {ach.title}
                    </span>
                    {ach.link ? (
                      <a
                        href={ach.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {ach.source} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {ach.source}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {ach.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
