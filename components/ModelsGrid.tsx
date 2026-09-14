"use client";

import { useMemo, useState } from "react";
import { ModelCard } from "@/components/ModelCard";
import type { Model } from "@/lib/db";

export function ModelsGrid({ models }: { models: Model[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;
    return models.filter((model) => model.name.toLowerCase().includes(q));
  }, [models, query]);

  return (
    <div>
      <div className="mb-6 max-w-sm">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj po imieniu..."
          className="w-full border border-ink/15 bg-white/50 px-3 py-2.5 text-sm"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">Brak wynikow{query ? ` dla „${query}”` : ""}.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((model, index) => <ModelCard key={model.id} model={model} priority={index < 2} />)}
        </div>
      )}
    </div>
  );
}
