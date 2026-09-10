import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { updateProject } from "@/lib/actions";
import { getModels, getProjectById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EdytujProjektPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, models] = await Promise.all([getProjectById(id), getModels()]);
  if (!project) notFound();

  const updateWithId = updateProject.bind(null, id);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="portfolio" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Portfolio</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Edytuj projekt</h1>
        <div className="mt-6 flex max-w-xl flex-wrap gap-3">
          {project.photos.map((photo) => (
            <div key={photo} className="relative aspect-[4/5] w-28 overflow-hidden rounded border border-ink/10 bg-soft-accent">
              <Image src={photo} alt={project.coverAlt} fill sizes="112px" className="object-cover" />
            </div>
          ))}
        </div>
        <form action={updateWithId} className="mt-6 max-w-xl space-y-5">
          <label className="block text-sm">
            Tytul (podpis kafelka)*
            <input name="title" required defaultValue={project.title} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Styl / kategoria
            <input name="style" defaultValue={project.style} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Data (etykieta)
            <input name="dateLabel" defaultValue={project.dateLabel} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Opis
            <textarea name="description" rows={3} defaultValue={project.description} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Uzyte kosmetyki (oddziel przecinkami)
            <input name="products" defaultValue={project.products.join(", ")} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Modelka
            <select name="modelId" defaultValue={project.modelId ?? ""} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3">
              <option value="">Brak / nie dotyczy</option>
              {models.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            Albo nowa modelka (jesli jej nie ma na liscie powyzej)
            <input name="newModelName" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Klaudia" />
          </label>
          <label className="block text-sm">
            Dodaj kolejne zdjecia (zostaw puste, zeby nic nie dodawac)
            <input type="file" name="photos" accept="image/*" multiple className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublic" defaultChecked={project.public} className="h-4 w-4" />
            Widoczny publicznie (Portfolio, Makijaze tematyczne)
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
            <Link href={`/studio/projekty/${project.id}/usun`} className="border border-ink/15 px-4 py-3 text-sm text-accent">Usun projekt</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
