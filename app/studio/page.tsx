import Image from "next/image";
import Link from "next/link";
import { StudioSidebar } from "@/components/StudioSidebar";
import { getCosmetics, getModels, getPackingItems, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const [projects, cosmetics, models, packingItems] = await Promise.all([getProjects(), getCosmetics(), getModels(), getPackingItems()]);
  const publicCount = projects.filter((project) => project.public).length;
  const packingChecked = packingItems.filter((item) => item.checked).length;
  const packingTotal = packingItems.length;
  const packingProgress = packingTotal > 0 ? Math.round((packingChecked / packingTotal) * 100) : 0;

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
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-medium uppercase text-muted">Projekty</h2>
              <div className="flex gap-2 text-sm"><button className="border border-ink/15 px-3 py-2">Siatka</button><button className="border border-ink/15 px-3 py-2 text-muted">Lista</button></div>
            </div>
            {projects.length === 0 ? (
              <p className="text-sm text-muted">Brak projektow. Dodaj pierwszy przez przycisk &quot;Nowy projekt&quot;.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => <article key={project.id} className="overflow-hidden rounded-md border border-ink/10 bg-white/35"><div className="relative aspect-[4/5] bg-soft-accent"><Image src={project.cover} alt={project.coverAlt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" /></div><div className="p-3"><div className="flex items-center justify-between gap-3"><h3 className="font-serif text-2xl font-semibold leading-none">{project.title}</h3><span className={`text-xs ${project.public ? "text-accent" : "text-muted"}`}>{project.public ? "Publiczny" : "Prywatny"}</span></div><p className="mt-2 text-sm text-muted">{project.style}</p><Link href={`/studio/projekty/${project.id}/edytuj`} className="mt-2 inline-block text-sm text-accent hover:underline">Edytuj</Link></div></article>)}
              </div>
            )}
          </div>
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
                <Link href="/studio/na-wyjazd" className="text-sm text-accent hover:underline">Zobacz liste</Link>
              </div>
              {packingTotal === 0 ? (
                <p className="mt-3 text-sm text-muted">Brak jeszcze zadnych pozycji na liscie pakowania.</p>
              ) : (
                <>
                  <p className="mt-3 text-sm leading-6 text-muted">Spakowane {packingChecked} z {packingTotal} pozycji.</p>
                  <div className="mt-4 h-2 bg-soft-accent"><div className="h-2 bg-accent" style={{ width: `${packingProgress}%` }} /></div>
                </>
              )}
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
