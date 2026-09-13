import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { updateCosmetic } from "@/lib/actions";
import { getCosmeticById, getCosmetics } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EdytujKosmetykPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [cosmetic, cosmetics] = await Promise.all([getCosmeticById(id), getCosmetics()]);
  if (!cosmetic) notFound();

  const categories = Array.from(new Set(cosmetics.map((item) => item.category).filter(Boolean)));
  const updateWithId = updateCosmetic.bind(null, id);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kosmetyki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/kosmetyki" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Kosmetykow</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Edytuj kosmetyk</h1>
        <form action={updateWithId} className="mt-8 max-w-xl space-y-5">
          <label className="block text-sm">
            Nazwa*
            <input name="name" required defaultValue={cosmetic.name} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Marka
            <input name="brand" defaultValue={cosmetic.brand} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Kategoria
            <input name="category" list="categories" defaultValue={cosmetic.category} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
            <datalist id="categories">
              {categories.map((category) => <option key={category} value={category} />)}
            </datalist>
          </label>
          <label className="block text-sm">
            Odcien
            <input name="shade" defaultValue={cosmetic.shade} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Notatki
            <textarea name="notes" rows={3} defaultValue={cosmetic.notes} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
            <Link href={`/studio/kosmetyki/${cosmetic.id}/usun`} className="border border-ink/15 px-4 py-3 text-sm text-accent">Usun kosmetyk</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
