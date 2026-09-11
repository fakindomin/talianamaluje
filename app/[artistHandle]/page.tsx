import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { getProfile, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: profile.displayName,
    description: profile.bio,
    openGraph: { title: profile.displayName, description: profile.bio, images: [{ url: profile.avatar }] },
    twitter: { card: "summary_large_image", title: profile.displayName, description: profile.bio, images: [profile.avatar] }
  };
}

export default async function ArtistProfile() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-ink/10 pb-8 md:grid-cols-[320px_1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-soft-accent shadow-line">
            <Image src={profile.avatar} alt={profile.avatarAlt} fill priority sizes="320px" className="object-cover" />
          </div>
          <div className="self-end">
            <p className="text-xs uppercase text-accent">{profile.brandName}</p>
            <h1 className="mt-2 font-serif text-6xl font-semibold leading-none">{profile.displayName}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{profile.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[profile.city, profile.serviceArea, ...profile.specialties].map((item) => <span key={item} className="rounded border border-ink/10 px-3 py-1 text-sm text-muted">{item}</span>)}
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
