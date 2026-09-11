import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { getModelById, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const model = await getModelById(id);
  if (!model) return {};
  return { title: model.name };
}

export default async function ModelkaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [model, projects] = await Promise.all([getModelById(id), getProjects()]);
  if (!model) notFound();

  const modelProjects = projects.filter((project) => project.modelId === model.id && project.public);

  return (
    <main>
      <Header active="modelki" />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/modelki" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft aria-hidden size={16} />Wroc do Modelek</Link>
        <div className="mt-6 grid gap-8 border-b border-ink/10 pb-8 md:grid-cols-[320px_1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-soft-accent shadow-line">
            <Image src={model.cover} alt={model.coverAlt} fill priority sizes="320px" className="object-cover" />
          </div>
          <div className="self-end">
            <p className="text-xs uppercase text-accent">Modelka</p>
            <h1 className="mt-2 font-serif text-6xl font-semibold leading-none">{model.name}</h1>
          </div>
        </div>
        {modelProjects.length === 0 ? (
          <p className="mt-8 text-sm text-muted">Brak jeszcze publicznych makijazy z ta modelka.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {modelProjects.map((project) => <ProjectCard key={project.id} project={project} from={`/modelki/${model.id}`} />)}
          </div>
        )}
      </section>
    </main>
  );
}
