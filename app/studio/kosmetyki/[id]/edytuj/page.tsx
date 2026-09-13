import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CosmeticForm } from "@/components/CosmeticForm";
import { StudioSidebar } from "@/components/StudioSidebar";
import { updateCosmetic } from "@/lib/actions";
import { getCosmeticById, getCosmetics } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EdytujKosmetykPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [cosmetic, cosmetics] = await Promise.all([getCosmeticById(id), getCosmetics()]);
  if (!cosmetic) notFound();

  const categories = Array.from(new Set(cosmetics.map((item) => item.category).filter(Boolean)));
  const updateWithId = updateCosmetic.bind(null, id);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kosmetyki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/studio/kosmetyki" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Kosmetykow</Link>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-none">Edytuj kosmetyk</h1>
        <CosmeticForm
          action={updateWithId}
          categories={categories}
          defaultValues={cosmetic}
          submitLabel="Zapisz zmiany"
          deleteHref={`/studio/kosmetyki/${cosmetic.id}/usun`}
        />
      </section>
    </main>
  );
}
