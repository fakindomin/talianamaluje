import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { addCosmetic } from "@/lib/actions";
import { getCosmetics } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NowyKosmetykPage() {
  const cosmetics = await getCosmetics();
  const categories = Array.from(new Set(cosmetics.map((item) => item.category).filter(Boolean)));

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kosmetyki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/kosmetyki" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Kosmetykow</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Nowy kosmetyk</h1>
        <form action={addCosmetic} className="mt-8 max-w-xl space-y-5">
          <label className="block text-sm">
            Nazwa*
            <input name="name" required className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Skin Veil 03" />
          </label>
          <label className="block text-sm">
            Marka
            <input name="brand" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Luma" />
          </label>
          <label className="block text-sm">
            Kategoria
            <input name="category" list="categories" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Podklad" />
            <datalist id="categories">
              {categories.map((category) => <option key={category} value={category} />)}
            </datalist>
          </label>
          <label className="block text-sm">
            Kolor
            <input name="shade" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. 03 Neutral" />
          </label>
          <label className="block text-sm">
            Notatki
            <textarea name="notes" rows={3} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. dobrze kryje, do skory suchej" />
          </label>
          <button type="submit" className="w-full bg-accent px-4 py-3 text-sm font-medium text-white sm:w-auto">Zapisz kosmetyk</button>
        </form>
      </section>
    </main>
  );
}
