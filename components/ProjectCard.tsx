import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <article className="overflow-hidden rounded border border-ink/10 bg-white/35">
        <div className="relative aspect-[4/5] bg-soft-accent">
          <Image src={project.cover} alt={project.coverAlt} fill priority={priority} sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        </div>
        <div className="flex items-start justify-between gap-3 p-3">
          <div>
            <h2 className="font-serif text-xl font-semibold leading-none">{project.title}</h2>
            <p className="mt-1 text-xs uppercase text-muted">{project.style}</p>
          </div>
          <span className="text-xs text-muted">{project.dateLabel}</span>
        </div>
      </article>
    </Link>
  );
}
