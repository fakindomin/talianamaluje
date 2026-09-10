import Image from "next/image";
import type { Model } from "@/lib/db";

export function ModelCard({ model, priority = false }: { model: Model; priority?: boolean }) {
  return (
    <article className="relative aspect-[4/5] overflow-hidden rounded-md bg-soft-accent shadow-line">
      <div className="tile-kenburns h-full w-full">
        <Image
          src={model.cover}
          alt={model.coverAlt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      <div className="pointer-events-none absolute inset-0 tile-text-drift">
        <div className="absolute inset-x-3 bottom-3">
          <h2 className="font-serif text-2xl font-semibold leading-none text-white">{model.name}</h2>
        </div>
      </div>
    </article>
  );
}
