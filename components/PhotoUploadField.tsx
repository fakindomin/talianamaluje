"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

type UploadedPhoto = { url: string; uploading: boolean };

async function compressImage(file: File, maxDim = 1920, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  return blob ?? file;
}

export function PhotoUploadField({
  name,
  folder,
  multiple = false,
  label
}: {
  name: string;
  folder: "projects" | "models";
  multiple?: boolean;
  label: string;
}) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const setFormBusy = (busy: boolean) => {
    const form = inputRef.current?.closest("form");
    const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitButton) submitButton.disabled = busy;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const placeholders: UploadedPhoto[] = list.map(() => ({ url: "", uploading: true }));
    setPhotos((prev) => (multiple ? [...prev, ...placeholders] : placeholders));
    setFormBusy(true);

    const supabase = getBrowserSupabase();
    const startIndex = multiple ? photos.length : 0;

    for (let i = 0; i < list.length; i++) {
      try {
        const compressed = await compressImage(list[i]);
        const path = `${folder}/${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage.from("media").upload(path, compressed, {
          contentType: "image/jpeg",
          upsert: false
        });
        if (error) throw error;
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        setPhotos((prev) => {
          const next = multiple ? [...prev] : [{ url: "", uploading: true }];
          next[startIndex + i] = { url: data.publicUrl, uploading: false };
          return next;
        });
      } catch {
        setPhotos((prev) => prev.filter((_, idx) => idx !== startIndex + i));
      }
    }
    setFormBusy(false);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const anyUploading = photos.some((p) => p.uploading);

  return (
    <div className="block text-sm">
      {label}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="mt-2 w-full border border-ink/15 bg-canvas px-3 py-3"
      />
      {anyUploading && (
        <p className="mt-2 flex items-center gap-2 text-xs text-muted">
          <Loader2 aria-hidden size={14} className="animate-spin" />
          Przesylanie zdjec...
        </p>
      )}
      {photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative h-20 w-16 overflow-hidden rounded-md bg-soft-accent shadow-line">
              {photo.uploading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 aria-hidden size={16} className="animate-spin text-muted" />
                </div>
              ) : (
                <>
                  <Image src={photo.url} alt="" fill sizes="64px" className="object-cover" />
                  <input type="hidden" name={name} value={photo.url} />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    aria-label="Usun zdjecie"
                    className="absolute right-0.5 top-0.5 rounded-full bg-ink/70 p-0.5 text-white"
                  >
                    <X aria-hidden size={11} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
