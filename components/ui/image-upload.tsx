'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploadProps {
  name: string;
  label?: string;
  helperText?: string;
  defaultPreview?: string;
  error?: string;
  onFileSelect?: (file: File | null) => void;
  required?: boolean;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB input limit from user device
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

/**
 * Compresses and resizes large images in-browser to prevent payload limit errors
 * and guarantee rapid uploads over mobile or low-bandwidth connections.
 */
async function compressImageClientSide(file: File, maxDimension = 1600, quality = 0.88): Promise<File> {
  if (file.size <= 500 * 1024) return file;

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });

    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, quality));
    return blob && blob.size < file.size ? new File([blob], file.name, { type, lastModified: Date.now() }) : file;
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  label = 'Attach Image from Device',
  helperText = 'Maximum 10MB • PNG, JPG, or WEBP format',
  defaultPreview,
  error: externalError,
  onFileSelect,
  required = false,
}) => {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndProcessFile = async (rawFile: File) => {
    setClientError(null);

    // Validate MIME Type
    if (!ALLOWED_TYPES.includes(rawFile.type.toLowerCase())) {
      setClientError('Invalid file format. Please attach a PNG, JPG, or WEBP image.');
      return;
    }

    // Validate File Size (10MB maximum input)
    if (rawFile.size > MAX_SIZE_BYTES) {
      const sizeMb = (rawFile.size / (1024 * 1024)).toFixed(2);
      setClientError(`File size exceeds 10MB limit (${sizeMb}MB). Please choose a smaller image.`);
      return;
    }

    try {
      setIsProcessing(true);
      const processedFile = await compressImageClientSide(rawFile);

      // Attach processed file to input element via DataTransfer
      if (fileInputRef.current && typeof DataTransfer !== 'undefined') {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(processedFile);
        fileInputRef.current.files = dataTransfer.files;
      }

      // Generate browser preview
      const objectUrl = URL.createObjectURL(processedFile);
      setPreview(objectUrl);
      setFileDetails({
        name: processedFile.name,
        size: `${(processedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      });

      if (onFileSelect) {
        onFileSelect(processedFile);
      }
    } catch {
      // Fallback
      const objectUrl = URL.createObjectURL(rawFile);
      setPreview(objectUrl);
      setFileDetails({
        name: rawFile.name,
        size: `${(rawFile.size / (1024 * 1024)).toFixed(2)} MB`,
      });
      if (onFileSelect) {
        onFileSelect(rawFile);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileDetails(null);
    setClientError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const activeError = clientError || externalError;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wider">
          {label} {required && <span className="text-[#c0392b] dark:text-[#ef5350]">*</span>}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleInputChange}
        className="hidden"
        id={`file-upload-${name}`}
      />

      {/* Upload Zone or Preview Card */}
      {preview ? (
        <div className="relative rounded-2xl border-2 border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/40 dark:bg-[#1b2117] p-4 transition-all duration-200 hover:border-[#e0a861]">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#131710] shadow-xs">
              <img
                src={preview}
                alt="Upload preview"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Meta and actions */}
            <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#e0a861]" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-[#2e7d32] dark:text-[#66bb6a]" />
                )}
                <span className="truncate">{fileDetails?.name || 'Attached Image'}</span>
              </div>
              {fileDetails && (
                <p className="text-[11px] text-[#707666] dark:text-[#a3ab98]">
                  Optimized size: {fileDetails.size}
                </p>
              )}
              <p className="text-[11px] text-[#505748] dark:text-[#a3ab98]">
                Ready to be uploaded with this submission.
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-xs font-medium text-[#2c3324] dark:text-[#fefcf1] bg-white dark:bg-[#20271c] border border-[#e6dfcb] dark:border-[#323d2b] rounded-lg hover:bg-[#fefcf1] dark:hover:bg-[#252e1f] transition-colors"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1 text-xs font-medium text-[#c0392b] dark:text-[#ef5350] bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] rounded-lg hover:bg-[#fae4e4] dark:hover:bg-[#3d1e1a] transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={clsx(
            'group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200',
            isDragging
              ? 'border-[#e0a861] bg-[#f8f4e3] dark:bg-[#252e1f]'
              : 'border-[#e6dfcb] dark:border-[#323d2b] bg-[#fefcf1]/70 dark:bg-[#1b2117]/80 hover:border-[#e0a861] hover:bg-[#f8f4e3]/50 dark:hover:bg-[#252e1f]/50',
            activeError && 'border-[#f5c6cb] dark:border-[#ef5350] bg-[#fdf2f2]/40 dark:bg-[#2d1815]/40'
          )}
        >
          <div className="h-12 w-12 rounded-full bg-white dark:bg-[#20271c] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-center shadow-xs text-[#e0a861] group-hover:scale-110 transition-transform">
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1]">
              Click to browse from your device <span className="text-[#707666] dark:text-[#a3ab98] font-normal">or drag & drop</span>
            </p>
            <p className="text-[11px] text-[#707666] dark:text-[#a3ab98]">{helperText}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {activeError && (
        <div className="flex items-center gap-1.5 text-xs text-[#c0392b] mt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
};
