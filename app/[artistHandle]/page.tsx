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

function splitBio(bio: string): { lead: string; rest: string } {
  const match = bio.match(/^(.*?[.!?])\s+([\s\S]*)$/);
  if (!match) return { lead: bio, rest: "" };
  return { lead: match[1], rest: match[2] };
}

function pluralRealizacje(n: number): string {
  if (n === 1) return "1 realizacja";
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return `${n} realizacje`;
  return `${n} realizacji`;
}

export default async function ArtistProfile() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const publicProjects = projects.filter((project) => project.public);
  const [featured, ...rest] = publicProjects;
  const sideItems = rest.slice(0, 3);
  const overflowItems = rest.slice(3);
  const { lead, rest: restBio } = splitBio(profile.bio);
  const from = `/@${profile.slug}`;

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="grid gap-8 border-b border-ink/10 pb-9 md:grid-cols-[340px_1fr] md:items-end md:gap-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-soft-accent shadow-line">
            <Image src={profile.avatar} alt={profile.avatarAlt} fill priority sizes="(max-width: 768px) 60vw, 340px" className="object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-accent">Makeup artist · {profile.serviceArea}</p>
            <h1 className="mt-3 max-w-2xl font-serif text-6xl font-semibold leading-[0.94] sm:text-7xl">{profile.displayName}</h1>
            {lead && <p className="mt-6 max-w-[32ch] font-serif text-xl italic leading-snug text-ink">„{lead}”</p>}
            {restBio && <p className="mt-3 max-w-[46ch] text-sm leading-7 text-muted">{restBio}</p>}
            {profile.specialties.length > 0 && (
              <ul className="mt-6 flex flex-wrap text-sm text-muted">
                {profile.specialties.map((item, index) => (
                  <li key={item} className={index > 0 ? "ml-4 border-l border-ink/10 pl-4" : ""}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="mt-10 flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-3xl font-semibold">Portfolio</h2>
          {publicProjects.length > 0 && <span className="text-xs uppercase tracking-[0.08em] text-muted">{pluralRealizacje(publicProjects.length)}</span>}
        </div>

        {publicProjects.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Portfolio pojawi sie tutaj, gdy dodam pierwsza publiczna realizacje.</p>
        ) : (
          <>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <ProjectCard project={featured} priority from={from} aspect="aspect-[4/5]" />
              {sideItems.length > 0 && (
                <div className="flex flex-col gap-4">
                  {sideItems.map((project) => (
                    <ProjectCard key={project.id} project={project} from={from} aspect="aspect-[16/7]" />
                  ))}
                </div>
              )}
            </div>
            {overflowItems.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {overflowItems.map((project) => (
                  <ProjectCard key={project.id} project={project} from={from} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
