import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, X } from "lucide-react";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { StudioSidebar } from "@/components/StudioSidebar";
import { removeModelPhoto, setModelCover, updateModel } from "@/lib/actions";
import { getModelById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EdytujModelkePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const model = await getModelById(id);
  if (!model) notFound();

  const updateWithId = updateModel.bind(null, id);
  const canRemovePhotos = model.photos.length > 1;

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="modelki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/modelki" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Modelek</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Edytuj modelke</h1>
        <p className="mt-6 text-xs uppercase text-muted">Zdjecia (kliknij gwiazdke, zeby ustawic jako glowne)</p>
        <div className="mt-2 flex max-w-xl flex-wrap gap-3">
          {model.photos.map((photo) => {
            const isCover = photo === model.cover;
            return (
              <div key={photo} className="relative aspect-[4/5] w-28 overflow-hidden rounded-md bg-soft-accent shadow-line">
                <Image src={photo} alt={model.coverAlt} fill sizes="112px" className="object-cover" />
                {isCover ? (
                  <span className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-white">
                    <Star aria-hidden size={10} fill="currentColor" />
                    Glowne
                  </span>
                ) : (
                  <form action={setModelCover.bind(null, model.id, photo)} className="absolute left-1 top-1">
                    <button
                      type="submit"
                      aria-label="Ustaw jako glowne"
                      title="Ustaw jako glowne"
                      className="rounded-full bg-white/85 p-1 text-ink shadow-line hover:bg-white"
                    >
                      <Star aria-hidden size={12} />
                    </button>
                  </form>
                )}
                {canRemovePhotos && (
                  <form action={removeModelPhoto.bind(null, model.id, photo)} className="absolute right-1 top-1">
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
            );
          })}
        </div>
        <form action={updateWithId} className="mt-6 max-w-xl space-y-5">
          <label className="block text-sm">
            Imie*
            <input name="name" required defaultValue={model.name} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <PhotoUploadField name="photoUrls" folder="models" multiple label="Dodaj kolejne zdjecia (zostaw puste, zeby nic nie dodawac)" />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
            <Link href={`/studio/modelki/${model.id}/usun`} className="border border-ink/15 px-4 py-3 text-sm text-accent">Usun modelke</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
