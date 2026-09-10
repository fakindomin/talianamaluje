import Image from "next/image";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export default function Home() {
  const publicProjects = projects.filter((project) => project.public);
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 border-b border-ink/10 pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <Image src="/logo-full.webp" alt="talianamaluje — makeup artist" width={220} height={168} priority className="mb-6 h-auto w-48 sm:w-56" />
            <p className="mb-2 text-xs uppercase text-accent">Portfolio jednej artystki</p>
            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl">Makijaz pokazany jak editorial, zarzadzany jak studio pracy.</h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted">Publiczna czesc zaczyna sie od realizacji. Bez logowania, bez social metryk, bez katalogu fikcyjnych artystow.</p>
        </div>
        <div className="masonry columns-2 md:columns-3 xl:columns-4">
          {publicProjects.map((project, index) => <ProjectCard key={project.id} project={project} priority={index < 2} />)}
        </div>
      </section>
    </main>
  );
}
