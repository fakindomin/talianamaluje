import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/db";
import type { CSSProperties } from "react";

const VISIBLE_SECONDS = 4;
const FADE_SECONDS = 1;

function buildCrossfadeCss(keyframeName: string, count: number) {
  if (count <= 1) return "";
  const slot = VISIBLE_SECONDS + FADE_SECONDS;
  const total = slot * count;
  const holdPercent = (VISIBLE_SECONDS / total) * 100;
  const fadeEndPercent = (slot / total) * 100;
  return `@keyframes ${keyframeName} { 0% { opacity: 1; } ${holdPercent.toFixed(2)}% { opacity: 1; } ${fadeEndPercent.toFixed(2)}% { opacity: 0; } 100% { opacity: 0; } }`;
}

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const photos = project.photos;
  const keyframeName = `cf-${project.id.replace(/[^a-zA-Z0-9]/g, "")}`;
  const slot = VISIBLE_SECONDS + FADE_SECONDS;
  const total = slot * photos.length;

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <article className="relative aspect-[4/5] overflow-hidden bg-soft-accent">
        {photos.length > 1 && <style>{buildCrossfadeCss(keyframeName, photos.length)}</style>}
        {photos.map((photo, index) => {
          const layerStyle: CSSProperties | undefined =
            photos.length > 1
              ? ({
                  "--tile-anim-name": keyframeName,
                  "--tile-anim-duration": `${total}s`,
                  "--tile-anim-delay": `${index * slot}s`,
                  opacity: index === 0 ? 1 : 0
                } as CSSProperties)
              : undefined;
          return (
            <div key={photo} className={`absolute inset-0 ${photos.length > 1 ? "tile-crossfade" : ""}`} style={layerStyle}>
              <div className="tile-kenburns h-full w-full">
                <Image
                  src={photo}
                  alt={project.coverAlt}
                  fill
                  priority={priority && index === 0}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-0 tile-text-drift">
          <div className="absolute right-3 top-3 text-xs" style={{ color: project.textColor }}>{project.dateLabel}</div>
          <div className="absolute inset-x-3 bottom-3">
            <h2 className="font-serif text-2xl font-semibold leading-none" style={{ color: project.textColor }}>{project.title}</h2>
            <p className="mt-1 text-xs uppercase opacity-90" style={{ color: project.textColor }}>{project.style}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
