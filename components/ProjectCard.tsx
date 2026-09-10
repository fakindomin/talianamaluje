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
  const count = photos.length;
  const keyframeName = `cf-${project.id.replace(/[^a-zA-Z0-9]/g, "")}`;
  const slot = VISIBLE_SECONDS + FADE_SECONDS;
  const total = slot * count;
  const projectOffset = count > 1 ? hashOffsetSeconds(project.id, total) : 0;
  const backLayerCount = count >= 3 ? 2 : count === 2 ? 1 : 0;

  function renderLayer(role: number, isFront: boolean) {
    return photos.map((photo, index) => {
      const slotIndex = (((index - role) % count) + count) % count;
      const layerStyle: CSSProperties | undefined =
        count > 1
          ? ({
              "--tile-anim-name": keyframeName,
              "--tile-anim-duration": `${total}s`,
              "--tile-anim-delay": `${slotIndex * slot - projectOffset}s`
            } as CSSProperties)
          : undefined;
      return (
        <div key={photo} className={`absolute inset-0 ${count > 1 ? "tile-crossfade" : ""}`} style={layerStyle}>
          <div className="tile-kenburns h-full w-full">
            <Image
              src={photo}
              alt={isFront ? project.coverAlt : ""}
              fill
              priority={isFront && priority && index === 0}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>
      );
    });
  }

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative">
        {count > 1 && <style>{buildCrossfadeCss(keyframeName, count)}</style>}
        {backLayerCount >= 2 && (
          <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 -rotate-2 overflow-hidden rounded-md shadow-line">
            {renderLayer(2, false)}
          </div>
        )}
        {backLayerCount >= 1 && (
          <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-1 overflow-hidden rounded-md shadow-line">
            {renderLayer(1, false)}
          </div>
        )}
        <article className="relative aspect-[4/5] overflow-hidden rounded-md bg-soft-accent shadow-line">
          {renderLayer(0, true)}
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
