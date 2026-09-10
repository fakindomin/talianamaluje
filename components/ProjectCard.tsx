import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/db";
import type { CSSProperties } from "react";

const VISIBLE_SECONDS = 4;
const FADE_SECONDS = 1;

function hashOffsetSeconds(id: string, total: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return (hash % Math.round(total * 100)) / 100;
}

function buildCrossfadeCss(keyframeName: string, count: number) {
  if (count <= 1) return "";
  const slot = VISIBLE_SECONDS + FADE_SECONDS;
  const total = slot * count;
  const fadeInEnd = (FADE_SECONDS / total) * 100;
  const holdEnd = (slot / total) * 100;
  const fadeOutEnd = ((slot + FADE_SECONDS) / total) * 100;
  return `@keyframes ${keyframeName} { 0% { opacity: 0; } ${fadeInEnd.toFixed(2)}% { opacity: 1; } ${holdEnd.toFixed(2)}% { opacity: 1; } ${fadeOutEnd.toFixed(2)}% { opacity: 0; } 100% { opacity: 0; } }`;
}

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const photos = project.photos;
  const keyframeName = `cf-${project.id.replace(/[^a-zA-Z0-9]/g, "")}`;
  const slot = VISIBLE_SECONDS + FADE_SECONDS;
  const total = slot * photos.length;
  const projectOffset = photos.length > 1 ? hashOffsetSeconds(project.id, total) : 0;

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative">
        {photos.length > 1 && (
          <>
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 -rotate-2 overflow-hidden rounded-md bg-soft-accent shadow-line">
              <Image src={photos[2 % photos.length]} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
            <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-1 overflow-hidden rounded-md bg-[#F7EFEA] shadow-line">
              <Image src={photos[1 % photos.length]} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
          </>
        )}
        <article className="relative aspect-[4/5] overflow-hidden rounded-md bg-soft-accent shadow-line">
          {photos.length > 1 && <style>{buildCrossfadeCss(keyframeName, photos.length)}</style>}
        {photos.map((photo, index) => {
          const layerStyle: CSSProperties | undefined =
            photos.length > 1
              ? ({
                  "--tile-anim-name": keyframeName,
                  "--tile-anim-duration": `${total}s`,
                  "--tile-anim-delay": `${index * slot - projectOffset}s`
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
      </div>
    </Link>
  );
}
