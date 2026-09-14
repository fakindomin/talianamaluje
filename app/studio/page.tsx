import Link from "next/link";
import { ProjectsView } from "@/components/ProjectsView";
import { StudioSidebar } from "@/components/StudioSidebar";
import { getAllPackingItems, getCosmetics, getModels, getProjects, getTripEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const [projects, cosmetics, models, trips, packingItems] = await Promise.all([getProjects(), getCosmetics(), getModels(), getTripEvents(), getAllPackingItems()]);
  const publicCount = projects.filter((project) => project.public).length;
  const packingChecked = packingItems.filter((item) => item.checked).length;
  const packingTotal = packingItems.length;

  const itemsByEvent = new Map<string, typeof packingItems>();
  for (const item of packingItems) {
    const list = itemsByEvent.get(item.eventId) ?? [];
    list.push(item);
    itemsByEvent.set(item.eventId, list);
  }
  const upcomingTrips = trips.slice(0, 3);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="portfolio" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase text-accent">Domyslny widok po logowaniu</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Portfolio</h1>
          </div>
          <Link href="/studio/projekty/nowy" className="block w-full bg-accent px-4 py-3 text-center text-sm font-medium text-white md:w-auto">Nowy projekt</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {[["Prywatne", projects.length - publicCount], ["Publiczne", publicCount], ["Kosmetyki", cosmetics.length], ["Modelki", models.length], ["Spakowane", `${packingChecked}/${packingTotal}`]].map(([label, value]) => <div key={label} className="border border-ink/10 bg-white/35 p-4"><p className="text-xs uppercase text-muted">{label}</p><p className="mt-2 font-serif text-3xl font-semibold">{value}</p></div>)}
        </div>
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
          <ProjectsView projects={projects} />
          <aside className="space-y-6">
            <section className="border border-ink/10 bg-white/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-3xl font-semibold">Kosmetyki</h2>
                <Link href="/studio/kosmetyki" className="text-sm text-accent hover:underline">Zobacz wszystkie</Link>
              </div>
              {cosmetics.length === 0 ? (
                <p className="mt-4 text-sm text-muted">Brak jeszcze zadnych kosmetykow.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {cosmetics.slice(0, 5).map((item) => (
                    <div key={item.id} className="border-b border-ink/10 pb-3">
                      <p className="font-medium">{item.brand} {item.name}</p>
                      <p className="text-sm text-muted">{item.category || "Bez kategorii"}{item.shade ? ` · ${item.shade}` : ""}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section className="border border-ink/10 bg-white/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-3xl font-semibold">Na wyjazd</h2>
                <Link href="/studio/na-wyjazd" className="text-sm text-accent hover:underline">Zobacz wszystkie</Link>
              </div>
              {upcomingTrips.length === 0 ? (
                <p className="mt-4 text-sm text-muted">Brak zaplanowanych wyjazdow. Przypisz projekt do wydarzenia w Kalendarzu.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {upcomingTrips.map((trip) => {
                    const items = itemsByEvent.get(trip.id) ?? [];
                    const checked = items.filter((item) => item.checked).length;
                    const total = items.length;
                    return (
                      <Link key={trip.id} href={`/studio/na-wyjazd/${trip.id}`} className="block border-b border-ink/10 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{trip.title}</p>
                          <span className="shrink-0 text-xs tabular-nums text-muted">{total > 0 ? `${checked}/${total}` : "pusta"}</span>
                        </div>
                        <p className="text-sm text-muted">{trip.date}{trip.time ? ` · ${trip.time}` : ""}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
