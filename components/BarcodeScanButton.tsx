"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import { Camera, X } from "lucide-react";

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
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result) => {
          if (cancelled || !result) return;
          onDetected(result.getText());
          setOpen(false);
        });
        if (cancelled) {
          controls.stop();
        } else {
          controlsRef.current = controls;
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
              <video ref={videoRef} muted playsInline className="mt-4 aspect-[4/3] w-full rounded-md bg-black object-cover" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
