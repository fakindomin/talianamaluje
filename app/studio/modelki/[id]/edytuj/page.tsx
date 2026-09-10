import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { StudioSidebar } from "@/components/StudioSidebar";
import { updateModel } from "@/lib/actions";
import { getModelById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EdytujModelkePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const model = await getModelById(id);
  if (!model) notFound();

  const updateWithId = updateModel.bind(null, id);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="modelki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/modelki" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Modelek</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Edytuj modelke</h1>
        <div className="mt-6 max-w-xl">
          <div className="relative aspect-[4/5] w-48 overflow-hidden rounded border border-ink/10 bg-soft-accent">
            <Image src={model.cover} alt={model.coverAlt} fill sizes="192px" className="object-cover" />
          </div>
        </div>
        <form action={updateWithId} className="mt-6 max-w-xl space-y-5">
          <label className="block text-sm">
            Imie*
            <input name="name" required defaultValue={model.name} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <PhotoUploadField name="coverUrl" folder="models" label="Nowe zdjecie (zostaw puste, zeby zachowac obecne)" />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
            <Link href={`/studio/modelki/${model.id}/usun`} className="border border-ink/15 px-4 py-3 text-sm text-accent">Usun modelke</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
