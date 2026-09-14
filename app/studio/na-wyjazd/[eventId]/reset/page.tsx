import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { resetPackingList } from "@/lib/actions";
import { getCalendarEventById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ResetPackingListPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = await getCalendarEventById(eventId);
  if (!event) notFound();

  const resetForEvent = resetPackingList.bind(null, eventId);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="na-wyjazd" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/studio/na-wyjazd/${eventId}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do listy</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Zresetowac checkliste?</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">Wszystkie pozycje na liscie dla &quot;{event.title}&quot; zostana odznaczone. Sama lista pozostanie bez zmian.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={resetForEvent}>
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Tak, resetuj</button>
          </form>
          <Link href={`/studio/na-wyjazd/${eventId}`} className="border border-ink/15 px-4 py-3 text-sm">Anuluj</Link>
        </div>
      </section>
    </main>
  );
}
