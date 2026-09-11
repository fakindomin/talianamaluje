"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  };

  if (photos.length <= 1) {
    return (
      <div className="relative min-h-[70vh] overflow-hidden rounded-md bg-soft-accent shadow-line">
        <Image src={photos[0]} alt={alt} fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-contain" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth rounded-md shadow-line [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((src, index) => (
          <div key={src} className="relative min-h-[70vh] w-full shrink-0 snap-center bg-soft-accent">
            <Image
              src={src}
              alt={`${alt} ${index + 1}/${photos.length}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        aria-label="Poprzednie zdjecie"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/85 p-2 text-ink shadow-line hover:bg-white sm:block"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        aria-label="Nastepne zdjecie"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/85 p-2 text-ink shadow-line hover:bg-white sm:block"
      >
        <ChevronRight size={20} />
      </button>
      <div className="mt-3 flex justify-center gap-1.5">
        {photos.map((src) => (
          <span key={src} className="h-1.5 w-1.5 rounded-full bg-ink/25" />
        ))}
      </div>
    </div>
  );
}
