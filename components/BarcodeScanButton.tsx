"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import { Camera, X } from "lucide-react";

const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: { ideal: "environment" },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    // focusMode isn't in the standard TS lib yet, but Chrome/Android honor it.
    advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet]
  }
};

export function BarcodeScanButton({ onDetected }: { onDetected: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);

    (async () => {
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
        const controls = await reader.decodeFromConstraints(VIDEO_CONSTRAINTS, videoRef.current ?? undefined, (result) => {
          if (cancelled || !result) return;
          onDetected(result.getText());
          setOpen(false);
        });

        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;

        // Some browsers only honor focusMode once the stream is live, not in the initial constraints.
        try {
          await controls.streamVideoConstraintsApply?.({ advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet] });
        } catch {
          // Continuous autofocus isn't supported on this device/browser — safe to ignore.
        }
      } catch {
        if (!cancelled) setError("Nie udalo sie uruchomic kamery. Sprawdz uprawnienia w przegladarce.");
      }
    })();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, onDetected]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Skanuj kod kreskowy"
        title="Skanuj kod kreskowy"
        className="flex items-center justify-center border border-ink/15 bg-canvas px-3 py-3 text-ink hover:bg-soft-accent"
      >
        <Camera aria-hidden size={18} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
          <div className="w-full max-w-sm rounded-md bg-canvas p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Skanuj kod kreskowy</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Zamknij" className="text-muted hover:text-ink">
                <X aria-hidden size={18} />
              </button>
            </div>
            {error ? (
              <p className="mt-4 text-sm text-accent">{error}</p>
            ) : (
              <>
                <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-md bg-black">
                  <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-x-[12%] top-1/2 h-1/3 -translate-y-1/2 rounded-md border-2 border-white/80" />
                </div>
                <p className="mt-3 text-xs text-muted">Trzymaj kod kreskowy prosto, w ramce, ok. 10-15 cm od aparatu. Poczekaj chwile, az obraz sie wyostrzy.</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
