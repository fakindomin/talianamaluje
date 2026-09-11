import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { StudioSidebar } from "@/components/StudioSidebar";
import { addModel } from "@/lib/actions";

export default function NowaModelkaPage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="modelki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/modelki" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Modelek</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Nowa modelka</h1>
        <form action={addModel} className="mt-8 max-w-xl space-y-5">
          <label className="block text-sm">
            Imie*
            <input name="name" required className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Klaudia" />
          </label>
          <PhotoUploadField name="photoUrls" folder="models" multiple label="Zdjecia* (pierwsze bedzie glownym)" />
          <button type="submit" className="w-full bg-accent px-4 py-3 text-sm font-medium text-white sm:w-auto">Zapisz modelke</button>
        </form>
      </section>
    </main>
  );
}
