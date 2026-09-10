import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { artist, projects } from "@/lib/data";

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug && item.public);
  if (!project) notFound();
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/@${artist.slug}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do profilu</Link>
        <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative min-h-[70vh] overflow-hidden rounded border border-ink/10 bg-soft-accent">
            <Image src={project.cover} alt={project.coverAlt} fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
          </div>
          <aside className="self-end border-t border-ink/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs uppercase text-accent">{project.style}</p>
            <h1 className="mt-2 font-serif text-6xl font-semibold leading-none">{project.title}</h1>
            <p className="mt-4 text-sm text-muted">{project.dateLabel}</p>
            <p className="mt-6 leading-7 text-muted">{project.description}</p>
            <div className="mt-8">
              <h2 className="text-sm font-medium">Uzyte kosmetyki</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">{project.products.map((product) => <li key={product} className="border-b border-ink/10 pb-2">{product}</li>)}</ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
