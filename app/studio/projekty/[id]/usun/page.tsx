import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { deleteProject } from "@/lib/actions";
import { getProjectById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UsunProjektPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const deleteWithId = deleteProject.bind(null, id);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="portfolio" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/studio/projekty/${id}/edytuj`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do edycji</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Usunac ten projekt?</h1>
        <div className="mt-6 flex max-w-xl items-center gap-4 border border-ink/10 bg-white/35 p-4">
          <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded bg-soft-accent">
            <Image src={project.cover} alt={project.coverAlt} fill sizes="96px" className="object-cover" />
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold leading-none">{project.title}</p>
            <p className="mt-1 text-sm text-muted">{project.style}</p>
          </div>
        </div>
        <p className="mt-4 max-w-xl text-sm text-muted">Tej operacji nie da sie cofnac. Projekt zniknie z Portfolio i Makijazy tematycznych.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={deleteWithId}>
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Tak, usun</button>
          </form>
          <Link href="/studio" className="border border-ink/15 px-4 py-3 text-sm">Anuluj</Link>
        </div>
      </section>
    </main>
  );
}
