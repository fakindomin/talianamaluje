import Image from "next/image";
import Link from "next/link";
import { StudioSidebar } from "@/components/StudioSidebar";
import { getModels } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StudioModelkiPage() {
  const models = await getModels();

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="modelki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase text-accent">Wspolpraca</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Modelki</h1>
          </div>
          <Link href="/studio/modelki/nowa" className="block w-full bg-accent px-4 py-3 text-center text-sm font-medium text-white md:w-auto">Nowa modelka</Link>
        </div>
        {models.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Brak modelek. Dodaj pierwsza przez przycisk &quot;Nowa modelka&quot;.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {models.map((model) => (
              <article key={model.id} className="overflow-hidden rounded-md border border-ink/10 bg-white/35">
                <div className="relative aspect-[4/5] bg-soft-accent">
                  <Image src={model.cover} alt={model.coverAlt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-serif text-2xl font-semibold leading-none">{model.name}</h3>
                  <Link href={`/studio/modelki/${model.id}/edytuj`} className="mt-2 inline-block text-sm text-accent hover:underline">Edytuj</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
