import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getModels } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modelki",
  description: "Modelki wspolpracujace przy sesjach zdjeciowych z talianamaluje."
};

export default async function ModelkiPage() {
  const models = await getModels();
  return (
    <main>
      <Header active="modelki" />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs uppercase text-accent">Wspolpraca</p>
        <h1 className="mb-8 font-serif text-5xl font-semibold leading-none">Modelki</h1>
        {models.length === 0 && <p className="text-sm text-muted">Wkrotce pojawia sie tu modelki wspolpracujace przy sesjach.</p>}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {models.map((model, index) => (
            <article key={model.id} className="overflow-hidden rounded-md bg-white/35 shadow-line">
              <div className="relative aspect-[4/5] bg-soft-accent">
                <Image
                  src={model.cover}
                  alt={model.coverAlt}
                  fill
                  priority={index < 2}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h2 className="font-serif text-xl font-semibold leading-none">{model.name}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
