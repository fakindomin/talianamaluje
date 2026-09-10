import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { artist } from "@/lib/data";
import { getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug && item.public);
  if (!project) return {};
  const title = project.title;
  const description = project.description || `${project.style} — realizacja ${artist.displayName}.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: project.cover }] },
    twitter: { card: "summary_large_image", title, description, images: [project.cover] }
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug && item.public);
  if (!project) notFound();
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/@${artist.slug}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do profilu</Link>
        <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <PhotoCarousel photos={project.photos} alt={project.coverAlt || project.title} />
          <aside className="self-end border-t border-ink/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs uppercase text-accent">{project.style}</p>
            <h1 className="mt-2 font-serif text-6xl font-semibold leading-none">{project.title}</h1>
            <p className="mt-4 text-sm text-muted">{project.dateLabel}</p>
            {project.modelName && <p className="mt-1 text-sm text-muted">Modelka: {project.modelName}</p>}
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
