import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { PackingItemRow } from "@/components/PackingItemRow";
import { addCosmeticsFromProject, addPackingItem } from "@/lib/actions";
import { getCalendarEventById, getPackingItems } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function WyjazdPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = await getCalendarEventById(eventId);
  if (!event) notFound();

  const items = await getPackingItems(eventId);
  const checkedCount = items.filter((item) => item.checked).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  const addItemWithEvent = addPackingItem.bind(null, eventId);
  const addFromProject = event.projectId ? addCosmeticsFromProject.bind(null, eventId, event.projectId) : null;

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="na-wyjazd" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/na-wyjazd" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do wyjazdow</Link>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase text-accent">{event.date}{event.time ? ` · ${event.time}` : ""}{event.projectTitle ? ` · ${event.projectTitle}` : ""}</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">{event.title}</h1>
          </div>
          {total > 0 && (
            <Link href={`/studio/na-wyjazd/${eventId}/reset`} className="border border-ink/15 px-4 py-3 text-sm text-accent">Resetuj checkliste</Link>
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
          {addFromProject && (
            <form action={addFromProject} className="mb-4 border-b border-ink/10 pb-4">
              <button type="submit" className="border border-ink/15 px-4 py-2 text-sm hover:bg-soft-accent">Dodaj kosmetyki z projektu &quot;{event.projectTitle}&quot;</button>
            </form>
          )}
          {total === 0 ? (
            <p className="text-sm text-muted">Brak jeszcze zadnych pozycji na liscie.</p>
          ) : (
            <div>
              {items.map((item) => (
                <PackingItemRow key={item.id} id={item.id} label={item.label} checked={item.checked} eventId={eventId} />
              ))}
            </div>
          )}
          <form action={addItemWithEvent} className="mt-4 flex gap-2">
            <input name="label" required placeholder="np. Peleryna" className="flex-1 border border-ink/15 bg-canvas px-3 py-3 text-sm" />
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Dodaj</button>
          </form>
        </div>
      </section>
    </main>
  );
}
