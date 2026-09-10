import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { login } from "@/lib/auth-actions";

export const metadata: Metadata = {
  title: "Logowanie",
  robots: { index: false, follow: false }
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-md border border-ink/10 bg-white/40 p-6 shadow-line">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do portfolio</Link>
        <div className="mt-10">
          <LockKeyhole aria-hidden className="text-accent" />
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Studio</h1>
          <p className="mt-3 text-sm leading-6 text-muted">Logowanie do panelu admina.</p>
        </div>
        <form action={login} className="mt-8 space-y-4">
          <label className="block text-sm">
            Haslo
            <input name="password" type="password" required autoFocus className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="••••••••" />
          </label>
          {error && <p className="text-sm text-accent">Nieprawidlowe haslo.</p>}
          <button type="submit" className="block w-full bg-accent px-4 py-3 text-center text-sm font-medium text-white">Zaloguj</button>
        </form>
      </section>
    </main>
  );
}
