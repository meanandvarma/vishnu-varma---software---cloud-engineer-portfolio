import { PERSONAL_INFO } from '../data/personal';
import { EDUCATION_DATA } from '../data/education';

export function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1140px] px-5 py-16 sm:px-8 md:py-24 border-t border-slate-200/80 dark:border-white/[0.07]"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left Column: Biography, Education & Interests */}
        <div className="lg:col-span-5 space-y-5">
          <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            About
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Focused on practical engineering and clean fundamentals.
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[15px]">
            {PERSONAL_INFO.aboutBio}
          </p>

          <div className="pt-4 border-t border-slate-200/70 dark:border-white/[0.07] space-y-1 text-sm">
            <p className="font-medium text-slate-900 dark:text-white">
              {EDUCATION_DATA.institution} · {EDUCATION_DATA.period}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {EDUCATION_DATA.degree} · CGPA {EDUCATION_DATA.cgpa}
            </p>
          </div>
        </div>

        {/* Right Column: Technical Focus Areas */}
        <div className="lg:col-span-7 divide-y divide-slate-200/80 dark:divide-white/[0.07] lg:pl-8">
          {PERSONAL_INFO.focusAreas.map((area, idx) => (
            <div key={area.title} className="py-5 first:pt-0 last:pb-0 space-y-1.5">
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                0{idx + 1}. {area.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {area.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
