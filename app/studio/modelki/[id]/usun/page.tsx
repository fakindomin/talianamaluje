import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { deleteModel } from "@/lib/actions";
import { getModelById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UsunModelkePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const model = await getModelById(id);
  if (!model) notFound();

  const deleteWithId = deleteModel.bind(null, id);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="modelki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/studio/modelki/${id}/edytuj`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do edycji</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Usunac te modelke?</h1>
        <div className="mt-6 flex max-w-xl items-center gap-4 border border-ink/10 bg-white/35 p-4">
          <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-md bg-soft-accent shadow-line">
            <Image src={model.cover} alt={model.coverAlt} fill sizes="96px" className="object-cover" />
          </div>
          <p className="font-serif text-2xl font-semibold leading-none">{model.name}</p>
        </div>
        <p className="mt-4 max-w-xl text-sm text-muted">Tej operacji nie da sie cofnac. Modelka zniknie ze strony Modelki.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={deleteWithId}>
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Tak, usun</button>
          </form>
          <Link href="/studio/modelki" className="border border-ink/15 px-4 py-3 text-sm">Anuluj</Link>
        </div>
      </section>
    </main>
  );
}
