import Image from "next/image";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

type CategoryTab = "portfolio" | "modelki" | "tematyczne";

const categoryTabs: { key: CategoryTab; label: string; href: string }[] = [
  { key: "portfolio", label: "Portfolio", href: "/" },
  { key: "modelki", label: "Modelki", href: "/modelki" },
  { key: "tematyczne", label: "Makijaze tematyczne", href: "/tematyczne" }
];

export function Header({ active }: { active?: CategoryTab } = {}) {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-serif text-2xl font-semibold tracking-normal">
          <Image src="/logo-mark.webp" alt="" width={360} height={277} priority className="h-16 w-auto" />
          talianamaluje
        </Link>
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link className="px-3 py-2 hover:text-ink" href="/@nina-kaminska">Profil</Link>
          <Link className="inline-flex items-center gap-2 rounded border border-ink/15 px-3 py-2 text-ink hover:bg-soft-accent" href="/login"><LockKeyhole aria-hidden size={16} />Studio</Link>
        </nav>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-1 px-4 pb-3 sm:px-6 lg:px-8">
        {categoryTabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`border-b-2 px-3 py-1.5 text-sm ${active === tab.key ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
