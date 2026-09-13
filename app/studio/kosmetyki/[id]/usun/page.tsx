import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { deleteCosmetic } from "@/lib/actions";
import { getCosmeticById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UsunKosmetykPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cosmetic = await getCosmeticById(id);
  if (!cosmetic) notFound();

  const deleteWithId = deleteCosmetic.bind(null, id);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kosmetyki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/studio/kosmetyki/${id}/edytuj`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do edycji</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Usunac ten kosmetyk?</h1>
        <div className="mt-6 max-w-xl border border-ink/10 bg-white/35 p-4">
          <p className="font-serif text-2xl font-semibold leading-none">{cosmetic.brand} {cosmetic.name}</p>
          <p className="mt-1 text-sm text-muted">{cosmetic.category || "Bez kategorii"}</p>
        </div>
        <p className="mt-4 max-w-xl text-sm text-muted">Tej operacji nie da sie cofnac.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={deleteWithId}>
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Tak, usun</button>
          </form>
          <Link href="/studio/kosmetyki" className="border border-ink/15 px-4 py-3 text-sm">Anuluj</Link>
        </div>
      </section>
    </main>
  );
}
