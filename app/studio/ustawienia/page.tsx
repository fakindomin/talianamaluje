import { StudioSidebar } from "@/components/StudioSidebar";
import { updateSettings } from "@/lib/actions";
import { getProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UstawieniaPage() {
  const profile = await getProfile();

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="ustawienia" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs uppercase text-accent">Zaplecze</p>
        <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Ustawienia</h1>

        <form action={updateSettings} className="mt-8 max-w-xl space-y-5">
          <div className="border border-ink/10 bg-white/35 p-4">
            <p className="font-serif text-2xl font-semibold leading-none">Wyglad strony</p>
            <label className="mt-4 flex items-center gap-4 text-sm">
              <span className="flex-1">Kolor akcentu</span>
              <input
                type="color"
                name="accentColor"
                defaultValue={profile.accentColor}
                className="h-10 w-16 cursor-pointer border border-ink/15 bg-canvas p-1"
              />
            </label>
            <p className="mt-3 text-sm leading-6 text-muted">Ten kolor jest uzywany na przyciskach, linkach i akcentach na calej stronie (publicznej i w panelu).</p>
          </div>
          <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
        </form>
      </section>
    </main>
  );
}
