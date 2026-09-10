import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-md border border-ink/10 bg-white/40 p-6 shadow-line">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do portfolio</Link>
        <div className="mt-10">
          <LockKeyhole aria-hidden className="text-accent" />
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Studio</h1>
          <p className="mt-3 text-sm leading-6 text-muted">Logowanie jest przygotowane pod Supabase Auth. Ten ekran nie blokuje publicznego przegladania.</p>
        </div>
        <form className="mt-8 space-y-4">
          <label className="block text-sm">Email<input className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" type="email" placeholder="nina@example.com" /></label>
          <label className="block text-sm">Haslo<input className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" type="password" placeholder="••••••••" /></label>
          <Link href="/studio" className="block w-full bg-accent px-4 py-3 text-center text-sm font-medium text-white">Przejdz do wersji demo</Link>
        </form>
      </section>
    </main>
  );
}
