import Link from "next/link";
import { StudioSidebar } from "@/components/StudioSidebar";
import { getCosmetics, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StudioKosmetykiPage() {
  const [cosmetics, projects] = await Promise.all([getCosmetics(), getProjects()]);
  const usageCounts = new Map<string, number>();
  for (const project of projects) {
    for (const cosmeticId of project.cosmeticIds) {
      usageCounts.set(cosmeticId, (usageCounts.get(cosmeticId) ?? 0) + 1);
    }
  }

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <StudioSidebar active="kosmetyki" />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase text-accent">Zaplecze</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Kosmetyki</h1>
          </div>
          <Link href="/studio/kosmetyki/nowy" className="block w-full bg-accent px-4 py-3 text-center text-sm font-medium text-white md:w-auto">Nowy kosmetyk</Link>
        </div>
        {cosmetics.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Brak kosmetykow. Dodaj pierwszy przez przycisk &quot;Nowy kosmetyk&quot;.</p>
        ) : (
          <div className="mt-6 max-w-3xl overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase text-muted">
                  <th className="py-2 pr-4 font-medium">Marka</th>
                  <th className="py-2 pr-4 font-medium">Nazwa</th>
                  <th className="py-2 pr-4 font-medium">Kategoria</th>
                  <th className="py-2 pr-4 font-medium">Kolor</th>
                  <th className="py-2 pr-4 font-medium">Uzyty</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {cosmetics.map((item) => {
                  const usedIn = usageCounts.get(item.id) ?? 0;
                  return (
                    <tr key={item.id} className="border-b border-ink/10">
                      <td className="py-3 pr-4 text-muted">{item.brand || "—"}</td>
                      <td className="py-3 pr-4 font-medium">{item.name}</td>
                      <td className="py-3 pr-4 text-muted">{item.category || "—"}</td>
                      <td className="py-3 pr-4 text-muted">{item.shade || "—"}</td>
                      <td className="py-3 pr-4 text-muted">{usedIn === 0 ? "—" : `w ${usedIn} ${usedIn === 1 ? "projekcie" : "projektach"}`}</td>
                      <td className="py-3 text-right"><Link href={`/studio/kosmetyki/${item.id}/edytuj`} className="text-accent hover:underline">Edytuj</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
