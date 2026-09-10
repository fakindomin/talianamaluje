import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckSquare, FlaskConical, Images, Settings, UserRound, UsersRound } from "lucide-react";
import { cosmetics, projects, studioStats } from "@/lib/data";

const nav = [
  { label: "Portfolio", icon: Images },
  { label: "Kosmetyki", icon: FlaskConical },
  { label: "Modelki", icon: UsersRound },
  { label: "Kalendarz", icon: CalendarDays },
  { label: "Na wyjazd", icon: CheckSquare },
  { label: "Profil", icon: UserRound },
  { label: "Ustawienia", icon: Settings }
];

export default function StudioPage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-ink/10 bg-white/35 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-4 lg:h-auto lg:block lg:p-5">
          <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold">
            <Image src="/logo-mark.webp" alt="" width={360} height={277} className="h-8 w-auto" />
            talianamaluje
          </Link>
          <span className="text-xs uppercase text-accent lg:mt-2 lg:block">Studio</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:px-3">
          {nav.map((item, index) => <a key={item.label} className={`flex min-w-fit items-center gap-2 rounded px-3 py-2 text-sm ${index === 0 ? "bg-soft-accent text-ink" : "text-muted hover:bg-soft-accent/60 hover:text-ink"}`} href="#"><item.icon aria-hidden size={16} />{item.label}</a>)}
        </nav>
      </aside>
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase text-accent">Domyslny widok po logowaniu</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Portfolio</h1>
          </div>
          <button className="w-full bg-accent px-4 py-3 text-sm font-medium text-white md:w-auto">Nowy projekt</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {[["Prywatne", studioStats.privateProjects], ["Publiczne", studioStats.publishedProjects], ["Kosmetyki", studioStats.cosmetics], ["Modelki", studioStats.models], ["Spakowane", studioStats.packingProgress]].map(([label, value]) => <div key={label} className="border border-ink/10 bg-white/35 p-4"><p className="text-xs uppercase text-muted">{label}</p><p className="mt-2 font-serif text-3xl font-semibold">{value}</p></div>)}
        </div>
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-medium uppercase text-muted">Projekty</h2>
              <div className="flex gap-2 text-sm"><button className="border border-ink/15 px-3 py-2">Siatka</button><button className="border border-ink/15 px-3 py-2 text-muted">Lista</button></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => <article key={project.id} className="overflow-hidden border border-ink/10 bg-white/35"><div className="relative aspect-[4/5] bg-soft-accent"><Image src={project.cover} alt={project.coverAlt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" /></div><div className="p-3"><div className="flex items-center justify-between gap-3"><h3 className="font-serif text-2xl font-semibold leading-none">{project.title}</h3><span className={`text-xs ${project.public ? "text-accent" : "text-muted"}`}>{project.public ? "Publiczny" : "Prywatny"}</span></div><p className="mt-2 text-sm text-muted">{project.style}</p></div></article>)}
            </div>
          </div>
          <aside className="space-y-6">
            <section className="border border-ink/10 bg-white/35 p-4"><h2 className="font-serif text-3xl font-semibold">Kosmetyki w pracy</h2><div className="mt-4 space-y-3">{cosmetics.map((item) => <div key={item.name} className="border-b border-ink/10 pb-3"><p className="font-medium">{item.brand} {item.name}</p><p className="text-sm text-muted">{item.type} · uzyty w {item.usedIn} projektach</p></div>)}</div></section>
            <section className="border border-ink/10 bg-white/35 p-4"><h2 className="font-serif text-3xl font-semibold">Najblizszy wyjazd</h2><p className="mt-3 text-sm leading-6 text-muted">Checklisty beda trwale zapisywane i generowane z wybranych projektow. Reset wymaga potwierdzenia.</p><div className="mt-4 h-2 bg-soft-accent"><div className="h-2 w-[47%] bg-accent" /></div></section>
          </aside>
        </div>
      </section>
    </main>
  );
}
