import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/lib/db";

type CategoryTab = "portfolio" | "modelki";

const categoryTabs: { key: CategoryTab; label: string; href: string }[] = [
  { key: "portfolio", label: "Portfolio", href: "/" },
  { key: "modelki", label: "Modelki/Klientki", href: "/modelki" }
];

export async function Header({ active }: { active?: CategoryTab } = {}) {
  const profile = await getProfile();
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-24 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-serif text-lg font-semibold tracking-normal sm:gap-3 sm:text-2xl">
          <Image src="/logo-mark.webp" alt="" width={360} height={277} priority className="h-9 w-auto shrink-0 sm:h-16" />
          <span className="truncate">talianamaluje</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-2 text-sm text-muted">
          <Link className="px-3 py-2 hover:text-ink" href={`/@${profile.slug}`}>Profil</Link>
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
