import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { StudioSidebar } from "@/components/StudioSidebar";
import { addProfileCertificates, removeProfileCertificate, updateProfile } from "@/lib/actions";
import { getProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StudioProfilPage() {
  const profile = await getProfile();

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="profil" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs uppercase text-accent">Publiczny profil</p>
        <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Profil</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Zdjeciami profilowymi zarzadzasz w{" "}
          <Link href="/studio/ustawienia" className="text-accent hover:underline">Ustawieniach</Link>.
        </p>
        <form action={updateProfile} className="mt-6 max-w-xl space-y-5">
          <label className="block text-sm">
            Imie i nazwisko*
            <input name="displayName" required defaultValue={profile.displayName} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Marka
            <input name="brandName" defaultValue={profile.brandName} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Nick (adres profilu: /@nick)*
            <input name="slug" required defaultValue={profile.slug} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Miasto
            <input name="city" defaultValue={profile.city} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Obszar dzialania
            <input name="serviceArea" defaultValue={profile.serviceArea} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Opis
            <textarea name="bio" rows={5} defaultValue={profile.bio} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Specjalizacje (oddziel przecinkami)
            <input name="specialties" defaultValue={profile.specialties.join(", ")} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Link do Facebooka
            <input name="facebookUrl" type="url" defaultValue={profile.facebookUrl} placeholder="https://facebook.com/..." className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <label className="block text-sm">
            Link do Instagrama
            <input name="instagramUrl" type="url" defaultValue={profile.instagramUrl} placeholder="https://instagram.com/..." className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" />
          </label>
          <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
        </form>

        <div className="mt-8 max-w-xl border border-ink/10 bg-white/35 p-4">
          <p className="font-serif text-2xl font-semibold leading-none">Certyfikaty</p>
          <p className="mt-3 text-sm leading-6 text-muted">Zdjecia dyplomow i certyfikatow, ktore pojawia sie na publicznym profilu pod opisem.</p>

          {profile.certificates.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {profile.certificates.map((certificate) => (
                <div key={certificate} className="relative aspect-[4/5] w-28 overflow-hidden rounded-md bg-soft-accent shadow-line">
                  <Image src={certificate} alt="Certyfikat" fill sizes="112px" className="object-cover" />
                  <form action={removeProfileCertificate.bind(null, certificate)} className="absolute right-1 top-1">
                    <button
                      type="submit"
                      aria-label="Usun certyfikat"
                      className="rounded-full bg-ink/70 p-1 text-white hover:bg-ink"
                    >
                      <X aria-hidden size={12} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}

          <form action={addProfileCertificates} className="mt-4">
            <PhotoUploadField name="certificateUrls" folder="profile" multiple label="Dodaj nowe certyfikaty" />
            <button type="submit" className="mt-4 bg-accent px-4 py-3 text-sm font-medium text-white">Dodaj certyfikaty</button>
          </form>
        </div>
      </section>
    </main>
  );
}
