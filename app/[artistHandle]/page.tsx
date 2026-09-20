import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Facebook, Instagram } from "lucide-react";
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
            {(profile.facebookUrl || profile.instagramUrl) && (
              <div className="mt-6 flex items-center gap-4">
                {profile.facebookUrl && (
                  <Link href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted hover:text-accent">
                    <Facebook aria-hidden size={22} />
                  </Link>
                )}
                {profile.instagramUrl && (
                  <Link href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted hover:text-accent">
                    <Instagram aria-hidden size={22} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        {profile.certificates.length > 0 && (
          <div className="mt-10 border-t border-ink/10 pt-8">
            <p className="mb-4 text-xs uppercase tracking-[0.08em] text-accent">Certyfikaty</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {profile.certificates.map((certificate, index) => (
                <div key={certificate} className="relative aspect-[4/5] overflow-hidden rounded-md bg-soft-accent shadow-line">
                  <Image src={certificate} alt="Certyfikat" fill sizes="(max-width: 640px) 40vw, 200px" className="object-cover" loading={index < 4 ? "eager" : "lazy"} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
