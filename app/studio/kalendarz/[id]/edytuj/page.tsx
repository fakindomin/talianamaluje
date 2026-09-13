import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { updateCalendarEvent } from "@/lib/actions";
import { getCalendarEventById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EdytujWydarzeniePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const { id } = await params;
  const { month } = await searchParams;
  const event = await getCalendarEventById(id);
  if (!event) notFound();

  const updateWithId = updateCalendarEvent.bind(null, id);
  const backHref = `/studio/kalendarz?month=${month ?? event.date.slice(0, 7)}`;

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kalendarz" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Kalendarza</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Edytuj wydarzenie</h1>
        <form action={updateWithId} className="mt-8 max-w-xl space-y-5">
          <label className="block text-sm">
            Tytul*
            <input name="title" required defaultValue={event.title} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm">
              Data*
              <input type="date" name="date" required defaultValue={event.date} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
            </label>
            <label className="block text-sm">
              Godzina
              <input type="time" name="time" defaultValue={event.time} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
            </label>
          </div>
          <label className="block text-sm">
            Notatki
            <textarea name="notes" rows={3} defaultValue={event.notes} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
            <Link href={`/studio/kalendarz/${event.id}/usun?month=${month ?? event.date.slice(0, 7)}`} className="border border-ink/15 px-4 py-3 text-sm text-accent">Usun wydarzenie</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
