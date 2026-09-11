"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const count = photos.length;
  const loop = count > 1;
  const slides = loop ? [photos[count - 1], ...photos, photos[0]] : photos;

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || !loop) return;
    el.scrollTo({ left: el.clientWidth, behavior: "instant" });
  }, [loop, count]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !loop) return;

    const settle = () => {
      const width = el.clientWidth;
      if (!width) return;
      const index = Math.round(el.scrollLeft / width);
      if (index === 0) {
        el.scrollTo({ left: count * width, behavior: "instant" });
      } else if (index === count + 1) {
        el.scrollTo({ left: width, behavior: "instant" });
      }
    };

    const onScroll = () => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      settleTimeout.current = setTimeout(settle, 120);
    };

    const onResize = () => {
      const width = el.clientWidth;
      if (!width) return;
      const index = Math.round(el.scrollLeft / width);
      el.scrollTo({ left: index * width, behavior: "instant" });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [loop, count]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  };

  if (count <= 1) {
    return (
      <div className="overflow-hidden rounded-md shadow-line">
        <Image
          src={photos[0]}
          alt={alt}
          priority
          width={1200}
          height={1500}
          sizes="(max-width: 1024px) 100vw, 70vw"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory items-start overflow-x-auto overscroll-x-contain scroll-smooth rounded-md shadow-line [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((src, index) => (
          <div key={`${src}-${index}`} className="w-full shrink-0 snap-center">
            <Image
              src={src}
              alt={`${alt} ${((index - 1 + count) % count) + 1}/${count}`}
              priority={index === 1}
              width={1200}
              height={1500}
              sizes="(max-width: 1024px) 100vw, 70vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        aria-label="Poprzednie zdjecie"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-ink shadow-line hover:bg-white"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        aria-label="Nastepne zdjecie"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-ink shadow-line hover:bg-white"
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
