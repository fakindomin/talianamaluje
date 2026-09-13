"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/db";

export function ProjectsView({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase text-muted">Projekty</h2>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`border border-ink/15 px-3 py-2 ${view === "grid" ? "bg-soft-accent" : "text-muted hover:text-ink"}`}
          >
            Siatka
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`border border-ink/15 px-3 py-2 ${view === "list" ? "bg-soft-accent" : "text-muted hover:text-ink"}`}
          >
            Lista
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted">Brak projektow. Dodaj pierwszy przez przycisk &quot;Nowy projekt&quot;.</p>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-md border border-ink/10 bg-white/35">
              <div className="relative aspect-[4/5] bg-soft-accent">
                <Image src={project.cover} alt={project.coverAlt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-serif text-2xl font-semibold leading-none">{project.title}</h3>
                  <span className={`text-xs ${project.public ? "text-accent" : "text-muted"}`}>{project.public ? "Publiczny" : "Prywatny"}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{project.style}</p>
                <Link href={`/studio/projekty/${project.id}/edytuj`} className="mt-2 inline-block text-sm text-accent hover:underline">Edytuj</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-ink/10 border border-ink/10 bg-white/35">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center gap-4 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-soft-accent">
                <Image src={project.cover} alt={project.coverAlt} fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="truncate font-serif text-xl font-semibold leading-none">{project.title}</h3>
                  <span className={`shrink-0 text-xs ${project.public ? "text-accent" : "text-muted"}`}>{project.public ? "Publiczny" : "Prywatny"}</span>
                </div>
                <p className="mt-1 truncate text-sm text-muted">{project.style}</p>
              </div>
              <Link href={`/studio/projekty/${project.id}/edytuj`} className="shrink-0 text-sm text-accent hover:underline">Edytuj</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
