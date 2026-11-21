import { useState } from 'react';
import { ArrowRight, Download, ExternalLink, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/personal';
import { SOCIAL_LINKS } from '../data/socialLinks';
import { ThemeMode } from '../hooks/useTheme';

interface HeroSectionProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function HeroSection({ theme, onToggleTheme }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="mx-auto max-w-[1140px] px-5 pt-14 pb-16 sm:px-8 lg:pt-20 lg:pb-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Editorial Typography */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {PERSONAL_INFO.name} · {PERSONAL_INFO.headline}
            </p>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl sm:leading-[1.12] [text-wrap:balance]">
            {PERSONAL_INFO.heroHeadline}
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            {PERSONAL_INFO.heroIntro}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => scrollTo('projects')}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950 cursor-pointer whitespace-nowrap shrink-0"
            >
              Explore Projects <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/15 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" /> Download Resume
            </button>
          </div>

          <div className="flex items-center gap-6 pt-2 text-sm text-slate-600 dark:text-slate-400">
            <a
              href={SOCIAL_LINKS.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              GitHub <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              LinkedIn <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Right Restrained Visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-900 aspect-[4/3]">
            {!imgError ? (
              <img
                src="/src/assets/images/hero_engineering_studio_1795248928871.jpg"
                alt="Software engineering workspace representing Vishnu Varma's development environment"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-900 p-8 text-slate-400 text-sm">
                Software Engineering &amp; Cloud Workspace
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
