import Image from "next/image";
import Link from "next/link";
import { Star, X } from "lucide-react";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { StudioSidebar } from "@/components/StudioSidebar";
import { addProfilePhotos, removeProfilePhoto, setProfileCover, updateSettings } from "@/lib/actions";
import { getProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UstawieniaPage() {
  const profile = await getProfile();
  const canRemovePhotos = profile.photos.length > 1;

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="ustawienia" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs uppercase text-accent">Zaplecze</p>
        <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Ustawienia</h1>

        <form action={updateSettings} className="mt-8 max-w-xl space-y-5">
          <div className="border border-ink/10 bg-white/35 p-4">
            <p className="font-serif text-2xl font-semibold leading-none">Wyglad strony</p>
            <label className="mt-4 flex items-center gap-4 text-sm">
              <span className="flex-1">Kolor akcentu</span>
              <input
                type="color"
                name="accentColor"
                defaultValue={profile.accentColor}
                className="h-10 w-16 cursor-pointer border border-ink/15 bg-canvas p-1"
              />
            </label>
            <p className="mt-3 text-sm leading-6 text-muted">Ten kolor jest uzywany na przyciskach, linkach i akcentach na calej stronie (publicznej i w panelu).</p>

            <label className="mt-6 flex items-center gap-4 text-sm">
              <span className="flex-1">Kolor tla (tapety)</span>
              <input
                type="color"
                name="canvasColor"
                defaultValue={profile.canvasColor}
                className="h-10 w-16 cursor-pointer border border-ink/15 bg-canvas p-1"
              />
            </label>
            <p className="mt-3 text-sm leading-6 text-muted">Tlo widoczne za tresca na calej stronie (publicznej i w panelu).</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">Zapisz zmiany</button>
            <Link href="/studio/ustawienia/reset" className="border border-ink/15 px-4 py-3 text-sm text-muted hover:text-ink">Resetuj do domyslnych</Link>
          </div>
        </form>

        <div className="mt-8 max-w-xl border border-ink/10 bg-white/35 p-4">
          <p className="font-serif text-2xl font-semibold leading-none">Zdjecia profilowe</p>
          <p className="mt-3 text-sm leading-6 text-muted">Dodawaj zdjecia swojej pracy na sobie. Kliknij gwiazdke, zeby ustawic ktore z nich pokazuje sie na publicznym profilu.</p>

          <div className="mt-4 flex flex-wrap gap-3">
            {profile.photos.map((photo) => {
              const isCover = photo === profile.avatar;
              return (
                <div key={photo} className="relative aspect-[4/5] w-28 overflow-hidden rounded-md bg-soft-accent shadow-line">
                  <Image src={photo} alt={profile.avatarAlt} fill sizes="112px" className="object-cover" />
                  {isCover ? (
                    <span className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-white">
                      <Star aria-hidden size={10} fill="currentColor" />
                      Glowne
                    </span>
                  ) : (
                    <form action={setProfileCover.bind(null, photo)} className="absolute left-1 top-1">
                      <button
                        type="submit"
                        aria-label="Ustaw jako glowne"
                        title="Ustaw jako glowne"
                        className="rounded-full bg-white/85 p-1 text-ink shadow-line hover:bg-white"
                      >
                        <Star aria-hidden size={12} />
                      </button>
                    </form>
                  )}
                  {canRemovePhotos && (
                    <form action={removeProfilePhoto.bind(null, photo)} className="absolute right-1 top-1">
                      <button
                        type="submit"
                        aria-label="Usun zdjecie"
                        className="rounded-full bg-ink/70 p-1 text-white hover:bg-ink"
                      >
                        <X aria-hidden size={12} />
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>

          <form action={addProfilePhotos} className="mt-4">
            <PhotoUploadField name="photoUrls" folder="profile" multiple label="Dodaj nowe zdjecia" />
            <button type="submit" className="mt-4 bg-accent px-4 py-3 text-sm font-medium text-white">Dodaj do galerii</button>
          </form>
        </div>
      </section>
    </main>
  );
}
