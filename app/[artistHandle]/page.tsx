import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getProfile } from "@/lib/db";

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

export default async function ArtistProfile() {
  const profile = await getProfile();
  const { lead, rest: restBio } = splitBio(profile.bio);

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[340px_1fr] md:items-end md:gap-12">
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
        </div>
      </section>
    </main>
  );
}
