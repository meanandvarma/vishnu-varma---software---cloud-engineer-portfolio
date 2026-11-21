import { ArrowUp, ExternalLink, Moon, Sun } from 'lucide-react';
import { PERSONAL_INFO } from '../data/personal';
import { SOCIAL_LINKS } from '../data/socialLinks';
import { ThemeMode } from '../hooks/useTheme';

interface FooterProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Footer({ theme, onToggleTheme }: FooterProps) {
  return (
    <footer className="border-t border-slate-200/80 dark:border-white/[0.07]">
      <div className="mx-auto flex max-w-[1140px] flex-col gap-4 px-5 py-8 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {PERSONAL_INFO.name} · {PERSONAL_INFO.headline}
        </p>

        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 dark:text-slate-400">
          <a
            href={SOCIAL_LINKS.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
          >
            GitHub <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
          >
            LinkedIn <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={SOCIAL_LINKS.leetcode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
          >
            LeetCode <ExternalLink className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
