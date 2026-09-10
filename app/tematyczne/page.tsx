import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Makijaze tematyczne",
  description: "Realizacje pogrupowane wedlug kategorii makijazu: editorial, wieczorowy, slubny, nude."
};

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
          {publicProjects.map((project, index) => <ProjectCard key={project.id} project={project} priority={index < 2} />)}
        </div>
      </section>
    </main>
  );
}
