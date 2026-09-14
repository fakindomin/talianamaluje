import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();
  const publicProjects = projects.filter((project) => project.public);
  return (
    <main>
      <Header active="portfolio" />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 border-b border-ink/10 pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="mb-2 text-xs uppercase text-accent">Portfolio jednej artystki</p>
            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.95] sm:text-7xl">Makijaz pokazany jak editorial, zarzadzany jak studio pracy.</h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted">Publiczna czesc zaczyna sie od realizacji. Bez logowania, bez social metryk, bez katalogu fikcyjnych artystow.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {publicProjects.map((project, index) => <ProjectCard key={project.id} project={project} priority={index < 2} from="/" />)}
        </div>
      </section>
    </main>
  );
}
