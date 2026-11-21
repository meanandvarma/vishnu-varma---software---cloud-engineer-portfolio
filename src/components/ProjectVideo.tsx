import { useState } from 'react';
import { Play, Film } from 'lucide-react';
import { ProjectItem } from '../types/portfolio';

interface ProjectVideoProps {
  project: ProjectItem;
  onOpenModal: (project: ProjectItem) => void;
  aspect?: '16/10' | '16/9' | '4/3';
}

export function ProjectVideo({ project, onOpenModal, aspect = '16/10' }: ProjectVideoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const thumbSrc = project.thumbnail || project.image;
  const aspectClass =
    aspect === '4/3' ? 'aspect-[4/3]' : aspect === '16/9' ? 'aspect-video' : 'aspect-[16/10]';

  return (
    <div className={`group relative ${aspectClass} w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200 dark:border-white/[0.08]`}>
      {thumbSrc && !imgFailed ? (
        <img
          src={thumbSrc}
          alt={project.imageAlt || `${project.title} preview`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center text-slate-300">
          <Film className="h-8 w-8 text-blue-400 opacity-80" />
          <p className="mt-2 font-display text-sm font-medium text-white">{project.title}</p>
        </div>
      )}

      {/* Measured contrast scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 transition-opacity group-hover:from-black/85" />

      {/* Centered Play Button */}
      <button
        type="button"
        onClick={() => onOpenModal(project)}
        aria-label={`Watch demo for ${project.title}`}
        className="absolute inset-0 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-lg transition-transform duration-200 group-hover:scale-105">
          <Play className="h-5 w-5 fill-slate-950 translate-x-0.5" />
        </span>
      </button>

      {/* Bottom Clean Metadata Overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold truncate">{project.title}</p>
          <p className="text-xs text-slate-200/90 truncate">{project.shortDescription}</p>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-slate-200/90">
          {project.video
            ? project.videoDuration || 'Video Demo'
            : 'Preview'}
        </span>
      </div>
    </div>
  );
}
