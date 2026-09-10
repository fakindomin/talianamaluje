import Image from "next/image";
import { Header } from "@/components/Header";
import { getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TematycznePage() {
  const projects = await getProjects();
  const publicProjects = projects.filter((project) => project.public);

  return (
    <main>
      <Header active="tematyczne" />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs uppercase text-accent">Kategorie</p>
        <h1 className="mb-8 font-serif text-5xl font-semibold leading-none">Makijaze tematyczne</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {publicProjects.map((project, index) => (
            <article key={project.id} className="overflow-hidden rounded border border-ink/10 bg-white/35">
              <div className="relative aspect-[4/5] bg-soft-accent">
                <Image
                  src={project.cover}
                  alt={project.coverAlt}
                  fill
                  priority={index < 2}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h2 className="font-serif text-xl font-semibold leading-none">{project.style}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
