import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { StudioSidebar } from "@/components/StudioSidebar";
import { addProject } from "@/lib/actions";
import { getCosmetics, getModels } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NowyProjektPage() {
  const [models, cosmetics] = await Promise.all([getModels(), getCosmetics()]);

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
            Rodzaj makijazu
            <select name="style" defaultValue="" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3">
              <option value="">Wybierz rodzaj</option>
              <option value="ŚLUBNE / DELIKATNE">ŚLUBNE / DELIKATNE</option>
              <option value="OKAZJONALNE / IMPREZA">OKAZJONALNE / IMPREZA</option>
              <option value="WIECZOROWE / GLAM">WIECZOROWE / GLAM</option>
            </select>
          </label>
          <label className="block text-sm">
            Data (etykieta)
            <input name="dateLabel" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. wrzesien 2026" />
          </label>
          <label className="block text-sm">
            Opis
            <textarea name="description" rows={3} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="Krotki opis realizacji" />
          </label>
          <div className="block text-sm">
            Uzyte kosmetyki
            {cosmetics.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Katalog jest pusty — wpisz kosmetyki ponizej.</p>
            ) : (
              <div className="mt-2 max-h-48 space-y-1 overflow-y-auto border border-ink/15 bg-canvas p-3">
                {cosmetics.map((cosmetic) => (
                  <label key={cosmetic.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="cosmeticIds" value={cosmetic.id} className="h-4 w-4" />
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
            <select name="modelId" defaultValue="" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3">
              <option value="">Brak / nie dotyczy</option>
              {models.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            Albo nowa modelka (jesli jej nie ma na liscie powyzej)
            <input name="newModelName" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Klaudia" />
          </label>
          <PhotoUploadField name="photoUrls" folder="projects" multiple label="Zdjecia* (mozna wybrac kilka naraz — pierwsze bedzie miniatura)" />
          <PhotoUploadField name="beforePhotoUrls" folder="projects" multiple label="Zdjecia przed (opcjonalnie, nie pojawiaja sie w Portfolio)" />
          <label className="block text-sm">
            Kolor tekstu na kafelku (dobierz pod jasnosc zdjecia)
            <input type="color" name="textColor" defaultValue="#F7EFEA" className="mt-2 h-11 w-full border border-ink/15 bg-canvas px-2" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublic" defaultChecked className="h-4 w-4" />
            Widoczny publicznie (Portfolio)
          </label>
          <button type="submit" className="w-full bg-accent px-4 py-3 text-sm font-medium text-white sm:w-auto">Zapisz projekt</button>
        </form>
      </section>
    </main>
  );
}
