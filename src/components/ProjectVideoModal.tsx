import { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Maximize, ExternalLink, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectItem } from '../types/portfolio';

interface ProjectVideoModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectVideoModal({ project, onClose }: ProjectVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!project) return;
    setIsPlaying(false);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  if (!project) return null;

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }
  };

  const handleFullscreen = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.requestFullscreen) {
      vid.requestFullscreen();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0F1522] text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <h3 id="video-modal-title" className="font-display text-lg font-semibold text-white">
              {project.title} — Application Walkthrough
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">{project.shortDescription}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video modal"
            className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Player Area */}
        <div className="bg-black">
          {project.video ? (
            <div className="space-y-0">
              <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                poster={project.thumbnail || project.image}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="aspect-video w-full bg-black"
              >
                <source src={project.video} />
                {project.captionsUrl && (
                  <track
                    kind="captions"
                    src={project.captionsUrl}
                    srcLang="en"
                    label="English captions"
                    default
                  />
                )}
                Your browser does not support HTML5 video playback.
              </video>
              <div className="flex items-center justify-between border-t border-white/10 bg-[#0B101B] px-5 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-slate-200 hover:bg-white/10 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-slate-200 hover:bg-white/10 cursor-pointer"
                  >
                    <Maximize className="h-3.5 w-3.5" /> Fullscreen
                  </button>
                </div>
                {project.videoDuration && (
                  <span className="font-mono text-slate-400">Duration: {project.videoDuration}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden bg-[#0A0E17]">
              {(project.thumbnail || project.image) && (
                <img
                  src={project.thumbnail || project.image}
                  alt={project.imageAlt || project.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-45"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 p-6 text-center">
                <p className="font-mono text-xs text-blue-400">Screen Recording Pending Upload</p>
                <h4 className="mt-2 font-display text-xl font-semibold text-white">
                  {project.title} Walkthrough Video
                </h4>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-300">
                  Real application recordings are supported directly via HTML5 video. Add an MP4 or WebM file under{' '}
                  <code className="text-slate-200">public/videos/</code> and set the{' '}
                  <code className="text-slate-200">video</code> field in <code className="text-slate-200">src/data/projects.ts</code>.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  {project.playgroundTab && (
                    <Link
                      to={`/playground/${project.playgroundTab}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-blue-400"
                    >
                      <Terminal className="h-3.5 w-3.5" /> Try Interactive Demo
                    </Link>
                  )}
                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
                  >
                    Read Architecture Breakdown
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-xs text-slate-400">
          <span>{project.technologies.join(' · ')}</span>
          <div className="flex items-center gap-4">
            {project.githubUrls[0] && (
              <a
                href={project.githubUrls[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-200 hover:text-blue-400"
              >
                Source Code <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
