import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export default function TematycznePage() {
  const publicProjects = projects.filter((project) => project.public);
  const styles = Array.from(new Set(publicProjects.map((project) => project.style)));

  return (
    <main>
      <Header active="tematyczne" />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs uppercase text-accent">Kategorie</p>
        <h1 className="mb-8 font-serif text-5xl font-semibold leading-none">Makijaze tematyczne</h1>
        {styles.map((style) => (
          <div key={style} className="mb-10">
            <h2 className="mb-4 text-sm font-medium uppercase text-muted">{style}</h2>
            <div className="masonry columns-2 md:columns-3 xl:columns-4">
              {publicProjects
                .filter((project) => project.style === style)
                .map((project, index) => <ProjectCard key={project.id} project={project} priority={index === 0} />)}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
