'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { ScanQrCode } from 'lucide-react';

interface QrZoomProps {
  src: string;
  platform: string;
  /** Thumbnail size class, defaults to h-32 w-32 */
  thumbClass?: string;
}

/**
 * Renders a QR code thumbnail that opens a full-size lightbox on click.
 * Reuses the project's existing spring-animated Modal — no new deps.
 */
export function QrZoom({ src, platform, thumbClass = 'h-32 w-32' }: QrZoomProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex justify-center focus:outline-none"
        aria-label={`Expand ${platform} QR code`}
      >
        <img
          src={src}
          alt={`${platform} QR Code`}
          className={`${thumbClass} rounded-xl object-contain border border-[#e6dfcb] bg-white p-1.5 transition-all group-hover:brightness-90 group-hover:scale-[1.03] cursor-zoom-in`}
        />
        {/* Hover badge */}
        <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-[#2c3324]/80 text-[#e0a861] text-[10px] font-semibold px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ScanQrCode className="h-2.5 w-2.5" />
          Expand
        </span>
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={`${platform} QR Code`}
        description="Point your banking app camera at the code to send payment."
        className="max-w-[700px]"
      >
        <div className="flex justify-center pt-2 pb-1">
          <img
            src={src}
            alt={`${platform} QR Code full size`}
            className="w-full rounded-2xl object-contain border border-[#e6dfcb] bg-white p-4 shadow-sm"
          />
        </div>
        <p className="mt-3 text-center text-xs text-[#707666] dark:text-[#a3ab98]">
          Tap outside or press <kbd className="font-mono px-1 py-0.5 rounded bg-[#e6dfcb] dark:bg-[#323d2b] text-[#2c3324] dark:text-[#fefcf1]">Esc</kbd> to close.
        </p>
      </Modal>
    </>
  );
}
