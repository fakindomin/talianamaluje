import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CosmeticForm } from "@/components/CosmeticForm";
import { StudioSidebar } from "@/components/StudioSidebar";
import { addCosmetic } from "@/lib/actions";
import { getCosmetics } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NowyKosmetykPage() {
  const cosmetics = await getCosmetics();
  const categories = Array.from(new Set(cosmetics.map((item) => item.category).filter(Boolean)));

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kosmetyki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/kosmetyki" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Kosmetykow</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Nowy kosmetyk</h1>
        <CosmeticForm action={addCosmetic} categories={categories} submitLabel="Zapisz kosmetyk" />
      </section>
    </main>
  );
}
