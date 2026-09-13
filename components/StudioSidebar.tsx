import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckSquare, FlaskConical, Images, LogOut, Settings, UserRound, UsersRound } from "lucide-react";
import { logout } from "@/lib/auth-actions";

type StudioTab = "portfolio" | "modelki" | "profil" | "kosmetyki" | "kalendarz";

const nav: { label: string; icon: typeof Images; href: string; key?: StudioTab }[] = [
  { label: "Portfolio", icon: Images, href: "/studio", key: "portfolio" },
  { label: "Kosmetyki", icon: FlaskConical, href: "/studio/kosmetyki", key: "kosmetyki" },
  { label: "Modelki", icon: UsersRound, href: "/studio/modelki", key: "modelki" },
  { label: "Kalendarz", icon: CalendarDays, href: "/studio/kalendarz", key: "kalendarz" },
  { label: "Na wyjazd", icon: CheckSquare, href: "#" },
  { label: "Profil", icon: UserRound, href: "/studio/profil", key: "profil" },
  { label: "Ustawienia", icon: Settings, href: "#" }
];

export function StudioSidebar({ active }: { active: StudioTab }) {
  return (
    <aside className="border-b border-ink/10 bg-white/35 lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between px-4 lg:h-auto lg:block lg:p-5">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold">
          <Image src="/logo-mark.webp" alt="" width={360} height={277} className="h-8 w-auto" />
          talianamaluje
        </Link>
        <span className="text-xs uppercase text-accent lg:mt-2 lg:block">Studio</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:px-3">
        {nav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex min-w-fit items-center gap-2 rounded px-3 py-2 text-sm ${item.key === active ? "bg-soft-accent text-ink" : "text-muted hover:bg-soft-accent/60 hover:text-ink"}`}
          >
            <item.icon aria-hidden size={16} />
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={logout} className="px-3 pb-4 lg:px-3">
        <button type="submit" className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-muted hover:bg-soft-accent/60 hover:text-ink">
          <LogOut aria-hidden size={16} />
          Wyloguj
        </button>
      </form>
    </aside>
  );
}
