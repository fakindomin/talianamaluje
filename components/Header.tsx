import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, UserRound } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-normal">
          <Image src="/logo-mark.webp" alt="" width={72} height={55} priority className="h-9 w-auto" />
          talianamaluje
        </Link>
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link className="px-3 py-2 hover:text-ink" href="/@nina-kaminska">Profil</Link>
          <Link className="inline-flex items-center gap-2 rounded border border-ink/15 px-3 py-2 text-ink hover:bg-soft-accent" href="/login"><LockKeyhole aria-hidden size={16} />Studio</Link>
          <Link className="hidden items-center gap-2 px-3 py-2 hover:text-ink sm:inline-flex" href="/studio"><UserRound aria-hidden size={16} />Demo</Link>
        </nav>
      </div>
    </header>
  );
}
