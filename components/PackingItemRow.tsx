"use client";

import { useTransition } from "react";
import { deletePackingItem, togglePackingItem } from "@/lib/actions";

export function PackingItemRow({ id, label, checked }: { id: string; label: string; checked: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink/10 py-2 last:border-b-0">
      <label className="flex flex-1 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          disabled={isPending}
          onChange={(e) => {
            const next = e.target.checked;
            startTransition(() => {
              togglePackingItem(id, next);
            });
          }}
          className="h-4 w-4 accent-accent"
        />
        <span className={checked ? "text-muted line-through" : ""}>{label}</span>
      </label>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => { deletePackingItem(id); })}
        className="text-xs text-muted hover:text-accent"
      >
        Usun
      </button>
    </div>
  );
}
