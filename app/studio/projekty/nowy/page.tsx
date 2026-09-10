import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { addProject } from "@/lib/actions";

export default function NowyProjektPage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="portfolio" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Portfolio</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Nowy projekt</h1>
        <form action={addProject} className="mt-8 max-w-xl space-y-5">
          <label className="block text-sm">
            Tytul (podpis kafelka)*
            <input name="title" required className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Artystyczny" />
          </label>
          <label className="block text-sm">
            Styl / kategoria
            <input name="style" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Editorial glow" />
          </label>
          <label className="block text-sm">
            Data (etykieta)
            <input name="dateLabel" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. wrzesien 2026" />
          </label>
          <label className="block text-sm">
            Opis
            <textarea name="description" rows={3} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="Krotki opis realizacji" />
          </label>
          <label className="block text-sm">
            Uzyte kosmetyki (oddziel przecinkami)
            <input name="products" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Skin veil, Cream blush" />
          </label>
          <label className="block text-sm">
            Zdjecie*
            <input type="file" name="cover" accept="image/*" required className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublic" defaultChecked className="h-4 w-4" />
            Widoczny publicznie (Portfolio, Makijaze tematyczne)
          </label>
          <button type="submit" className="w-full bg-accent px-4 py-3 text-sm font-medium text-white sm:w-auto">Zapisz projekt</button>
        </form>
      </section>
    </main>
  );
}
