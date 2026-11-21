import { useState } from 'react';
import { Copy, Check, Download, ExternalLink, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/personal';
import { SOCIAL_LINKS } from '../data/socialLinks';

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <section
      id="contact"
      className="mx-auto max-w-[1140px] px-5 py-16 sm:px-8 md:py-24 border-t border-slate-200/80 dark:border-white/[0.07]"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7 space-y-5">
          <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Contact
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl [text-wrap:balance]">
            Have an opportunity or an interesting project?
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Open to Software Engineering, Java Backend, and Cloud/DevOps internships or graduate roles. Reach out directly by email or LinkedIn.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={SOCIAL_LINKS.email.url}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950 transition-colors"
            >
              <Mail className="h-4 w-4" /> Send Email
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/15 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : PERSONAL_INFO.email}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-600 dark:text-slate-400">
            <a
              href={SOCIAL_LINKS.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              LinkedIn <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={SOCIAL_LINKS.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              GitHub <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={SOCIAL_LINKS.leetcode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              LeetCode <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Role-Specific Resumes */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Resume Downloads
          </h3>
          <div className="divide-y divide-slate-200/80 dark:divide-white/[0.07] border-y border-slate-200/80 dark:border-white/[0.07]">
            {[PERSONAL_INFO.resumes.sde, PERSONAL_INFO.resumes.cloud].map((resume) => (
              <div
                key={resume.filename}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                    {resume.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                    {resume.subtitle}
                  </p>
                </div>
                <a
                  href={resume.url}
                  download={resume.filename}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-white/15 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 shrink-0 whitespace-nowrap"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
