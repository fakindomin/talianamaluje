import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { StudioSidebar } from "@/components/StudioSidebar";
import { removeProjectBeforePhoto, removeProjectPhoto, updateProject } from "@/lib/actions";
import { getCosmetics, getModels, getProjectById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EdytujProjektPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, models, cosmetics] = await Promise.all([getProjectById(id), getModels(), getCosmetics()]);
  if (!project) notFound();

  const updateWithId = updateProject.bind(null, id);
  const canRemovePhotos = project.photos.length > 1;
  const styleOptions = ["ŚLUBNE / DELIKATNE", "OKAZJONALNE / IMPREZA", "WIECZOROWE / GLAM"];
  const hasCustomStyle = project.style && !styleOptions.includes(project.style);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="portfolio" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Portfolio</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Edytuj projekt</h1>
        <p className="mt-6 text-xs uppercase text-muted">Zdjecia w Portfolio</p>
        <div className="mt-2 flex max-w-xl flex-wrap gap-3">
          {project.photos.map((photo) => (
            <div key={photo} className="relative aspect-[4/5] w-28 overflow-hidden rounded-md bg-soft-accent shadow-line">
              <Image src={photo} alt={project.coverAlt} fill sizes="112px" className="object-cover" />
              {canRemovePhotos && (
                <form action={removeProjectPhoto.bind(null, project.id, photo)} className="absolute right-1 top-1">
                  <button
                    type="submit"
                    aria-label="Usun zdjecie"
                    className="rounded-full bg-ink/70 p-1 text-white hover:bg-ink"
                  >
                    <X aria-hidden size={12} />
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
        {project.beforePhotos.length > 0 && (
          <>
            <p className="mt-6 text-xs uppercase text-muted">Zdjecia przed (nie pojawiaja sie w Portfolio)</p>
            <div className="mt-2 flex max-w-xl flex-wrap gap-3">
              {project.beforePhotos.map((photo) => (
                <div key={photo} className="relative aspect-[4/5] w-28 overflow-hidden rounded-md bg-soft-accent shadow-line">
                  <Image src={photo} alt={`${project.coverAlt} - przed`} fill sizes="112px" className="object-cover" />
                  <form action={removeProjectBeforePhoto.bind(null, project.id, photo)} className="absolute right-1 top-1">
                    <button
                      type="submit"
                      aria-label="Usun zdjecie"
                      className="rounded-full bg-ink/70 p-1 text-white hover:bg-ink"
                    >
                      <X aria-hidden size={12} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </>
        )}
        <form action={updateWithId} className="mt-6 max-w-xl space-y-5">
          <label className="block text-sm">
            Tytul (podpis kafelka)
            <input name="title" defaultValue={project.title} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Rodzaj makijazu
            <select name="style" defaultValue={project.style} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3">
              <option value="">Wybierz rodzaj</option>
              {hasCustomStyle && <option value={project.style}>{project.style}</option>}
              {styleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            Data (etykieta)
            <input name="dateLabel" defaultValue={project.dateLabel} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Opis
            <textarea name="description" rows={3} defaultValue={project.description} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <div className="block text-sm">
            Uzyte kosmetyki
            {cosmetics.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Katalog jest pusty — wpisz kosmetyki ponizej.</p>
            ) : (
              <div className="mt-2 max-h-48 space-y-1 overflow-y-auto border border-ink/15 bg-canvas p-3">
                {cosmetics.map((cosmetic) => (
                  <label key={cosmetic.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="cosmeticIds"
                      value={cosmetic.id}
                      defaultChecked={project.cosmeticIds.includes(cosmetic.id)}
                      className="h-4 w-4"
                    />
                    {cosmetic.brand ? `${cosmetic.brand} ` : ""}{cosmetic.name}{cosmetic.category ? ` · ${cosmetic.category}` : ""}
                  </label>
                ))}
              </div>
            )}
          </div>
          <label className="block text-sm">
            Nowe kosmetyki (jesli nie ma ich na liscie, oddziel przecinkami)
            <input name="newCosmetics" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Skin Veil 03, Cream Blush Fig" />
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
          <PhotoUploadField name="photoUrls" folder="projects" multiple label="Dodaj kolejne zdjecia (zostaw puste, zeby nic nie dodawac)" />
          <PhotoUploadField name="beforePhotoUrls" folder="projects" multiple label="Dodaj zdjecia przed (opcjonalnie, nie pojawiaja sie w Portfolio)" />
          <label className="block text-sm">
            Kolor tekstu na kafelku (dobierz pod jasnosc zdjecia)
            <input type="color" name="textColor" defaultValue={project.textColor} className="mt-2 h-11 w-full border border-ink/15 bg-canvas px-2" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublic" defaultChecked={project.public} className="h-4 w-4" />
            Widoczny publicznie (Portfolio)
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
