"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

async function compressForAi(file: File, maxDim = 1600, quality = 0.85): Promise<{ base64: string; mimeType: string }> {
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
  if (!ctx) throw new Error("no canvas context");
  ctx.drawImage(bitmap, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { base64: dataUrl.split(",")[1], mimeType: "image/jpeg" };
}

export function BarcodeScanButton({
  onDetected,
  onPhotoFallback
}: {
  onDetected: (code: string) => void;
  onPhotoFallback: (photo: { base64: string; mimeType: string }) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setBusy(true);
    setError(null);
    let imageUrl: string | null = null;

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const { DecodeHintType, BarcodeFormat } = await import("@zxing/library");

      const hints = new Map();
      hints.set(DecodeHintType.TRY_HARDER, true);
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.QR_CODE
      ]);

      const reader = new BrowserMultiFormatReader(hints);
      imageUrl = URL.createObjectURL(file);

      try {
        const result = await reader.decodeFromImageUrl(imageUrl);
        onDetected(result.getText());
        return;
      } catch {
        // No barcode found on the photo — fall back to letting AI read the label directly.
        const photo = await compressForAi(file);
        onPhotoFallback(photo);
      }
    } catch {
      setError("Nie udalo sie przetworzyc zdjecia. Sprobuj ponownie.");
    } finally {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setBusy(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label="Zrob zdjecie kodu kreskowego"
        title="Zrob zdjecie kodu kreskowego"
        className="flex items-center justify-center border border-ink/15 bg-canvas px-3 py-3 text-ink hover:bg-soft-accent disabled:opacity-60"
      >
        {busy ? <Loader2 aria-hidden size={18} className="animate-spin" /> : <Camera aria-hidden size={18} />}
      </button>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </>
  );
}
