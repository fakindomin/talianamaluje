"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/db";

export function PortfolioGrid({ projects, from }: { projects: Project[]; from: string }) {
  const [query, setQuery] = useState("");
  const [style, setStyle] = useState<string | null>(null);

  const styles = useMemo(
    () => Array.from(new Set(projects.map((p) => p.style).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pl")),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (style && project.style !== style) return false;
      if (!q) return true;
      return project.title.toLowerCase().includes(q) || (project.modelName?.toLowerCase().includes(q) ?? false);
    });
  }, [projects, query, style]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj po tytule lub modelce..."
          className="w-full border border-ink/15 bg-white/50 px-3 py-2.5 text-sm sm:max-w-xs"
        />
        {styles.length > 0 && (
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setStyle(null)}
              className={`border-b-2 pb-0.5 text-xs uppercase tracking-wide ${style === null ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              Wszystkie
            </button>
            {styles.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle((current) => (current === s ? null : s))}
                className={`border-b-2 pb-0.5 text-xs uppercase tracking-wide ${style === s ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink"}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">Brak wynikow.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project, index) => <ProjectCard key={project.id} project={project} priority={index < 2} from={from} />)}
        </div>
      )}
    </div>
  );
}
