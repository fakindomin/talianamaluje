import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ModelsGrid } from "@/components/ModelsGrid";
import { getModels } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modelki/Klientki",
  description: "Modelki i klientki wspolpracujace przy sesjach zdjeciowych z talianamaluje."
};

export default async function ModelkiPage() {
  const models = await getModels();
  return (
    <main>
      <Header active="modelki" />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs uppercase text-accent">Wspolpraca</p>
        <h1 className="mb-8 font-serif text-5xl font-semibold leading-none">Modelki/Klientki</h1>
        {models.length === 0 ? (
          <p className="text-sm text-muted">Wkrotce pojawia sie tu modelki wspolpracujace przy sesjach.</p>
        ) : (
          <ModelsGrid models={models} />
        )}
      </section>
    </main>
  );
}
