import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { addCalendarEvent } from "@/lib/actions";
import { getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NoweWydarzeniePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date } = await searchParams;
  const month = date?.slice(0, 7) ?? "";
  const projects = await getProjects();

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kalendarz" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/studio/kalendarz?month=${month}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Kalendarza</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Nowe wydarzenie</h1>
        <form action={addCalendarEvent} className="mt-8 max-w-xl space-y-5">
          <label className="block text-sm">
            Tytul*
            <input name="title" required className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. Sesja z Klaudia" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm">
              Data*
              <input type="date" name="date" required defaultValue={date} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
            </label>
            <label className="block text-sm">
              Godzina
              <input type="time" name="time" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
            </label>
          </div>
          <label className="block text-sm">
            Projekt (jesli to sesja makijazu — wlaczy checkliste pakowania)
            <select name="projectId" className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3">
              <option value="">Brak</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}{project.modelName ? ` — ${project.modelName}` : ""}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Notatki
            <textarea name="notes" rows={3} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. adres, kontakt, szczegoly" />
          </label>
          <button type="submit" className="w-full bg-accent px-4 py-3 text-sm font-medium text-white sm:w-auto">Zapisz wydarzenie</button>
        </form>
      </section>
    </main>
  );
}
