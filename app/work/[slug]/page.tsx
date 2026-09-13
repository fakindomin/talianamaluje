import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { getProfile, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

function resolveBackTarget(back: string | undefined, profileSlug: string): { href: string; label: string } {
  const isSafe = !!back && back.startsWith("/") && !back.startsWith("//") && !back.includes("://");
  const path = isSafe ? back! : `/@${profileSlug}`;

  if (path === "/") return { href: path, label: "Wroc do Portfolio" };
  if (path === "/tematyczne") return { href: path, label: "Wroc do makijazy tematycznych" };
  if (path.startsWith("/modelki/")) return { href: path, label: "Wroc do modelki" };
  if (path.startsWith("/@")) return { href: path, label: "Wroc do profilu" };
  return { href: `/@${profileSlug}`, label: "Wroc do profilu" };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const project = projects.find((item) => item.slug === slug && item.public);
  if (!project) return {};
  const title = project.title;
  const description = project.description || `${project.style} — realizacja ${profile.displayName}.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: project.cover }] },
    twitter: { card: "summary_large_image", title, description, images: [project.cover] }
  };
}

export default async function WorkPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ back?: string }>;
}) {
  const { slug } = await params;
  const { back } = await searchParams;
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const project = projects.find((item) => item.slug === slug && item.public);
  if (!project) notFound();
  const backTarget = resolveBackTarget(back, profile.slug);
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href={backTarget.href} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />{backTarget.label}</Link>
        <section className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <PhotoCarousel photos={project.photos} alt={project.coverAlt || project.title} />
          <aside className="border-t border-ink/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs uppercase tracking-[0.08em] text-accent">{project.style}{project.dateLabel ? ` · ${project.dateLabel}` : ""}</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl">{project.title}</h1>
            {project.modelName && <p className="mt-4 text-sm text-muted">Modelka: {project.modelName}</p>}
            {project.description && (
              <>
                <div className="mt-6 h-px bg-ink/10" />
                <p className="mt-6 text-sm leading-7 text-muted">{project.description}</p>
              </>
            )}
            {project.beforePhotos.length > 0 && (
              <div className="mt-8">
                <div className="h-px bg-ink/10" />
                <h2 className="mt-6 text-sm font-medium">Przed</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {project.beforePhotos.map((photo) => (
                    <div key={photo} className="relative aspect-[4/5] w-24 overflow-hidden rounded-md bg-soft-accent shadow-line">
                      <Image src={photo} alt={`${project.title} — przed`} fill sizes="96px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {project.cosmetics.length > 0 && (
              <div className="mt-8">
                <div className="h-px bg-ink/10" />
                <h2 className="mt-6 text-sm font-medium">Uzyte kosmetyki</h2>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {project.cosmetics.map((cosmetic) => (
                    <li key={cosmetic.id} className="border-b border-ink/10 pb-2">
                      {cosmetic.brand ? `${cosmetic.brand} ` : ""}{cosmetic.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
