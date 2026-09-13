"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { BarcodeScanButton } from "./BarcodeScanButton";
import { analyzeProductPhoto, lookupBarcode } from "@/lib/actions";

type OpenBeautyFactsProduct = {
  product_name?: string;
  brands?: string;
  categories?: string;
};

type BarcodeMatch = { brand: string; name: string; category: string };

export function CosmeticForm({
  action,
  categories,
  defaultValues,
  submitLabel,
  deleteHref
}: {
  action: (formData: FormData) => void;
  categories: string[];
  defaultValues?: { name: string; brand: string; category: string; shade: string; notes: string; barcode: string };
  submitLabel: string;
  deleteHref?: string;
}) {
  const [barcode, setBarcode] = useState(defaultValues?.barcode ?? "");
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [brand, setBrand] = useState(defaultValues?.brand ?? "");
  const [category, setCategory] = useState(defaultValues?.category ?? "");
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading" | "analyzing-photo" | "found" | "found-photo" | "not-found" | "error">("idle");
  const lastLookedUp = useRef(defaultValues?.barcode ?? "");

  const applyMatch = useCallback((match: BarcodeMatch) => {
    if (match.brand) setBrand(match.brand);
    if (match.name) setName(match.name);
    if (match.category) setCategory(match.category);
    setLookupStatus("found");
  }, []);

  const handleDetected = useCallback(
    async (code: string) => {
      setBarcode(code);
      lastLookedUp.current = code;
      setLookupStatus("loading");

      try {
        const res = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${code}.json`);
        const data: { status: number; product?: OpenBeautyFactsProduct } = await res.json();
        const product = data.status === 1 ? data.product : undefined;
        if (product) {
          const match: BarcodeMatch = {
            brand: product.brands?.split(",")[0]?.trim() ?? "",
            name: product.product_name?.trim() ?? "",
            category: product.categories?.split(",")[0]?.trim() ?? ""
          };
          if (match.brand || match.name || match.category) {
            applyMatch(match);
            return;
          }
        }
      } catch {
        // Open Beauty Facts failed — still worth trying the other sources below.
      }

      try {
        const fallback = await lookupBarcode(code);
        if (fallback) {
          applyMatch(fallback);
          return;
        }
      } catch {
        setLookupStatus("error");
        return;
      }

      setLookupStatus("not-found");
    },
    [applyMatch]
  );

  const handlePhotoFallback = useCallback(async (photo: { base64: string; mimeType: string }) => {
    setLookupStatus("analyzing-photo");
    try {
      const result = await analyzeProductPhoto(photo);
      if (!result) {
        setLookupStatus("not-found");
        return;
      }
      if (result.barcode) {
        setBarcode(result.barcode);
        lastLookedUp.current = result.barcode;
      }
      if (result.brand) setBrand(result.brand);
      if (result.name) setName(result.name);
      if (result.category) setCategory(result.category);
      setLookupStatus("found-photo");
    } catch {
      setLookupStatus("error");
    }
  }, []);

  return (
    <form action={action} className="mt-8 max-w-xl space-y-5">
      <div className="block text-sm">
        Kod kreskowy
        <div className="mt-2 flex gap-2">
          <input
            name="barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onBlur={() => {
              const trimmed = barcode.trim();
              if (trimmed && trimmed !== lastLookedUp.current) handleDetected(trimmed);
            }}
            className="w-full border border-ink/15 bg-canvas px-3 py-3"
            placeholder="np. 5901234123457"
          />
          <BarcodeScanButton onDetected={handleDetected} onPhotoFallback={handlePhotoFallback} />
        </div>
        {lookupStatus === "loading" && <p className="mt-1 text-xs text-muted">Szukam produktu w bazie...</p>}
        {lookupStatus === "analyzing-photo" && <p className="mt-1 text-xs text-muted">Nie znaleziono kodu na zdjeciu — AI czyta etykiete...</p>}
        {lookupStatus === "found" && <p className="mt-1 text-xs text-accent">Znaleziono produkt — pola zostaly uzupelnione.</p>}
        {lookupStatus === "found-photo" && <p className="mt-1 text-xs text-accent">Odczytano etykiete ze zdjecia — pola zostaly uzupelnione.</p>}
        {lookupStatus === "not-found" && <p className="mt-1 text-xs text-muted">Nie udalo sie rozpoznac produktu — uzupelnij recznie.</p>}
        {lookupStatus === "error" && <p className="mt-1 text-xs text-muted">Nie udalo sie sprawdzic bazy — uzupelnij recznie.</p>}
      </div>
      <label className="block text-sm">
        Nazwa*
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3"
          placeholder="np. Skin Veil 03"
        />
      </label>
      <label className="block text-sm">
        Marka
        <input
          name="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3"
          placeholder="np. Luma"
        />
      </label>
      <label className="block text-sm">
        Kategoria
        <input
          name="category"
          list="categories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3"
          placeholder="np. Podklad"
        />
        <datalist id="categories">
          {categories.map((c) => <option key={c} value={c} />)}
        </datalist>
      </label>
      <label className="block text-sm">
        Kolor
        <input name="shade" defaultValue={defaultValues?.shade} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. 03 Neutral" />
      </label>
      <label className="block text-sm">
        Notatki
        <textarea name="notes" rows={3} defaultValue={defaultValues?.notes} className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3" placeholder="np. dobrze kryje, do skory suchej" />
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="bg-accent px-4 py-3 text-sm font-medium text-white">{submitLabel}</button>
        {deleteHref && <Link href={deleteHref} className="border border-ink/15 px-4 py-3 text-sm text-accent">Usun kosmetyk</Link>}
      </div>
    </form>
  );
}
