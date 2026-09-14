import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { getCalendarEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "Styczen", "Luty", "Marzec", "Kwiecien", "Maj", "Czerwiec",
  "Lipiec", "Sierpien", "Wrzesien", "Pazdziernik", "Listopad", "Grudzien"
];
const WEEKDAY_LABELS = ["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Nd"];

function parseMonthParam(month: string | undefined): { year: number; monthIndex: number } {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [year, m] = month.split("-").map(Number);
    return { year, monthIndex: m - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), monthIndex: now.getMonth() };
}

function monthKey(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function buildGrid(year: number, monthIndex: number): (number | null)[] {
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  return Array.from({ length: totalCells }, (_, i) => {
    const day = i - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });
}

export default async function KalendarzPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month } = await searchParams;
  const { year, monthIndex } = parseMonthParam(month);
  const current = monthKey(year, monthIndex);
  const prev = monthIndex === 0 ? monthKey(year - 1, 11) : monthKey(year, monthIndex - 1);
  const next = monthIndex === 11 ? monthKey(year + 1, 0) : monthKey(year, monthIndex + 1);

  const events = await getCalendarEvents();
  const eventsByDate = new Map<string, typeof events>();
  for (const event of events) {
    const list = eventsByDate.get(event.date) ?? [];
    list.push(event);
    eventsByDate.set(event.date, list);
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const cells = buildGrid(year, monthIndex);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kalendarz" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase text-accent">Zaplecze</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Kalendarz</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/studio/kalendarz?month=${prev}`} aria-label="Poprzedni miesiac" className="border border-ink/15 p-2 hover:bg-soft-accent"><ChevronLeft size={18} /></Link>
            <p className="min-w-[160px] text-center font-serif text-2xl font-semibold">{MONTH_NAMES[monthIndex]} {year}</p>
            <Link href={`/studio/kalendarz?month=${next}`} aria-label="Nastepny miesiac" className="border border-ink/15 p-2 hover:bg-soft-accent"><ChevronRight size={18} /></Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 divide-x divide-y divide-ink/15 overflow-hidden rounded-md border border-ink/15 text-sm">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="bg-white/60 p-2 text-center text-xs uppercase text-muted">{label}</div>
          ))}
          {cells.map((day, index) => {
            if (day === null) return <div key={index} className="min-h-[100px] bg-white/20" />;
            const iso = `${current}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventsByDate.get(iso) ?? [];
            const isToday = iso === todayIso;
            return (
              <div key={index} className="min-h-[100px] bg-white/40 p-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isToday ? "flex h-5 w-5 items-center justify-center rounded-full bg-accent font-medium text-white" : "text-muted"}`}>{day}</span>
                  <Link href={`/studio/kalendarz/nowy?date=${iso}`} aria-label="Dodaj wydarzenie" className="text-muted hover:text-accent"><Plus size={14} /></Link>
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/studio/kalendarz/${event.id}/edytuj?month=${current}`}
                      className="block truncate rounded bg-soft-accent px-1.5 py-0.5 text-xs text-ink hover:bg-accent hover:text-white"
                      title={event.title}
                    >
                      {event.time ? `${event.time} ` : ""}{event.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
