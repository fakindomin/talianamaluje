import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { resetSettings } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default function ResetSettingsPage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="ustawienia" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/ustawienia" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do ustawien</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Zresetowac kolory?</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">Kolor akcentu i kolor tla wroca do domyslnego ukladu (bordowy akcent, rozowy beż tla) na calej stronie.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={resetSettings}>
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Tak, resetuj</button>
          </form>
          <Link href="/studio/ustawienia" className="border border-ink/15 px-4 py-3 text-sm">Anuluj</Link>
        </div>
      </section>
    </main>
  );
}
