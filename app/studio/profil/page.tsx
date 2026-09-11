import Image from "next/image";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { StudioSidebar } from "@/components/StudioSidebar";
import { updateProfile } from "@/lib/actions";
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
        <div className="mt-6 max-w-xl">
          <div className="relative aspect-[4/5] w-48 overflow-hidden rounded-md bg-soft-accent shadow-line">
            <Image src={profile.avatar} alt={profile.avatarAlt} fill sizes="192px" className="object-cover" />
          </div>
        </div>
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
          <PhotoUploadField name="avatarUrl" folder="profile" label="Nowe zdjecie profilowe (zostaw puste, zeby zachowac obecne)" />
          <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
        </form>
      </section>
    </main>
  );
}
