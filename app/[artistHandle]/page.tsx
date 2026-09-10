import Image from "next/image";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { artist } from "@/lib/data";
import { getProjects } from "@/lib/db";

export default async function ArtistProfile() {
  const projects = await getProjects();
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-ink/10 pb-8 md:grid-cols-[320px_1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded border border-ink/10 bg-soft-accent">
            <Image src={artist.avatar} alt={artist.avatarAlt} fill priority sizes="320px" className="object-cover" />
          </div>
          <div className="self-end">
            <p className="text-xs uppercase text-accent">{artist.brandName}</p>
            <h1 className="mt-2 font-serif text-6xl font-semibold leading-none">{artist.displayName}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{artist.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[artist.city, artist.serviceArea, ...artist.specialties].map((item) => <span key={item} className="rounded border border-ink/10 px-3 py-1 text-sm text-muted">{item}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {projects.filter((project) => project.public).map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>
    </main>
  );
}
