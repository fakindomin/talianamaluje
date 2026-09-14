import Link from "next/link";
import { StudioSidebar } from "@/components/StudioSidebar";
import { getAllPackingItems, getTripEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NaWyjazdPage() {
  const [trips, packingItems] = await Promise.all([getTripEvents(), getAllPackingItems()]);

  const itemsByEvent = new Map<string, typeof packingItems>();
  for (const item of packingItems) {
    const list = itemsByEvent.get(item.eventId) ?? [];
    list.push(item);
    itemsByEvent.set(item.eventId, list);
  }

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="na-wyjazd" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs uppercase text-accent">Zaplecze</p>
        <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Na wyjazd</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">Wybierz, na jaki wyjazd szykujesz walizke. Lista pakowania jest generowana z kosmetykow przypisanych do projektu tej wizyty.</p>

        {trips.length === 0 ? (
          <p className="mt-8 max-w-xl text-sm text-muted">
            Brak zaplanowanych wyjazdow. Dodaj wydarzenie w{" "}
            <Link href="/studio/kalendarz" className="text-accent hover:underline">Kalendarzu</Link>{" "}
            i przypisz mu projekt, zeby pojawilo sie tutaj.
          </p>
        ) : (
          <div className="mt-8 max-w-xl space-y-3">
            {trips.map((trip) => {
              const items = itemsByEvent.get(trip.id) ?? [];
              const checked = items.filter((item) => item.checked).length;
              const total = items.length;
              const progress = total > 0 ? Math.round((checked / total) * 100) : 0;
              return (
                <Link
                  key={trip.id}
                  href={`/studio/na-wyjazd/${trip.id}`}
                  className="block border border-ink/10 bg-white/35 p-4 hover:bg-white/55"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-serif text-2xl font-semibold leading-none">{trip.title}</p>
                      <p className="mt-1 text-sm text-muted">{trip.date}{trip.time ? ` · ${trip.time}` : ""} · {trip.projectTitle}</p>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums text-muted">{total > 0 ? `${checked}/${total}` : "pusta"}</p>
                  </div>
                  {total > 0 && (
                    <div className="mt-3 h-2 bg-soft-accent"><div className="h-2 bg-accent" style={{ width: `${progress}%` }} /></div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
