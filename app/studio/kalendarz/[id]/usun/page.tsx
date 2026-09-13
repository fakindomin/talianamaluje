import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { deleteCalendarEvent } from "@/lib/actions";
import { getCalendarEventById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UsunWydarzeniePage({
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

  const monthKey = month ?? event.date.slice(0, 7);
  const deleteWithId = deleteCalendarEvent.bind(null, id, monthKey);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kalendarz" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/studio/kalendarz/${id}/edytuj?month=${monthKey}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do edycji</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Usunac to wydarzenie?</h1>
        <div className="mt-6 max-w-xl border border-ink/10 bg-white/35 p-4">
          <p className="font-serif text-2xl font-semibold leading-none">{event.title}</p>
          <p className="mt-1 text-sm text-muted">{event.date}{event.time ? ` · ${event.time}` : ""}</p>
        </div>
        <p className="mt-4 max-w-xl text-sm text-muted">Tej operacji nie da sie cofnac.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={deleteWithId}>
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Tak, usun</button>
          </form>
          <Link href={`/studio/kalendarz?month=${monthKey}`} className="border border-ink/15 px-4 py-3 text-sm">Anuluj</Link>
        </div>
      </section>
    </main>
  );
}
