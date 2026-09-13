import Link from "next/link";
import { StudioSidebar } from "@/components/StudioSidebar";
import { PackingItemRow } from "@/components/PackingItemRow";
import { addPackingItem } from "@/lib/actions";
import { getPackingItems } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NaWyjazdPage() {
  const items = await getPackingItems();
  const checkedCount = items.filter((item) => item.checked).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="na-wyjazd" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase text-accent">Zaplecze</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Na wyjazd</h1>
          </div>
          {total > 0 && (
            <Link href="/studio/na-wyjazd/reset" className="border border-ink/15 px-4 py-3 text-sm text-accent">Resetuj checkliste</Link>
          )}
        </div>

        <div className="mt-6 max-w-xl">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Spakowane</span>
            <span className="tabular-nums">{checkedCount}/{total}</span>
          </div>
          <div className="mt-2 h-2 bg-soft-accent">
            <div className="h-2 bg-accent transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-8 max-w-xl border border-ink/10 bg-white/35 p-4">
          {total === 0 ? (
            <p className="text-sm text-muted">Brak jeszcze zadnych pozycji na liscie.</p>
          ) : (
            <div>
              {items.map((item) => (
                <PackingItemRow key={item.id} id={item.id} label={item.label} checked={item.checked} />
              ))}
            </div>
          )}
          <form action={addPackingItem} className="mt-4 flex gap-2">
            <input name="label" required placeholder="np. Paleta cieni" className="flex-1 border border-ink/15 bg-canvas px-3 py-3 text-sm" />
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Dodaj</button>
          </form>
        </div>
      </section>
    </main>
  );
}
