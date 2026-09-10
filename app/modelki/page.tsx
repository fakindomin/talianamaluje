import { Header } from "@/components/Header";

export default function ModelkiPage() {
  return (
    <main>
      <Header active="modelki" />
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="mb-2 text-xs uppercase text-accent">Modelki</p>
        <h1 className="font-serif text-5xl font-semibold leading-none">Ta sekcja jest w przygotowaniu.</h1>
        <p className="mt-4 text-base leading-7 text-muted">Wkrotce pojawia sie tu modelki wspolpracujace przy sesjach zdjeciowych.</p>
      </section>
    </main>
  );
}
