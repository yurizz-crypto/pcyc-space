'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
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

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  label = 'Attach Image from Device',
  helperText = 'Maximum 5MB • PNG or JPG/JPEG format only',
  defaultPreview,
  error: externalError,
  onFileSelect,
  required = false,
}) => {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndProcessFile = (file: File) => {
    setClientError(null);

    // Validate MIME Type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setClientError('Invalid file format. Please attach a PNG or JPG/JPEG image.');
      return;
    }

    // Validate File Size (5MB)
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setClientError(`File size exceeds 5MB limit (${sizeMb}MB). Please choose a smaller image.`);
      return;
    }

    // Generate browser preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFileDetails({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    });

    if (onFileSelect) {
      onFileSelect(file);
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
      if (fileInputRef.current) {
        // Create DataTransfer to assign to input element
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
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
        <label className="block text-xs font-semibold text-[#2c3324] uppercase tracking-wider">
          {label} {required && <span className="text-[#c0392b]">*</span>}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleInputChange}
        className="hidden"
        id={`file-upload-${name}`}
      />

      {/* Upload Zone or Preview Card */}
      {preview ? (
        <div className="relative rounded-2xl border-2 border-[#e6dfcb] bg-[#f8f4e3]/40 p-4 transition-all duration-200 hover:border-[#e0a861]">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-[#e6dfcb] bg-white shadow-xs">
              <img
                src={preview}
                alt="Upload preview"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Meta and actions */}
            <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#2c3324]">
                <CheckCircle2 className="h-4 w-4 text-[#2e7d32]" />
                <span className="truncate">{fileDetails?.name || 'Attached Image'}</span>
              </div>
              {fileDetails && (
                <p className="text-[11px] text-[#707666]">File size: {fileDetails.size}</p>
              )}
              <p className="text-[11px] text-[#505748]">
                Ready to be uploaded with this submission.
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-xs font-medium text-[#2c3324] bg-white border border-[#e6dfcb] rounded-lg hover:bg-[#fefcf1] transition-colors"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1 text-xs font-medium text-[#c0392b] bg-[#fdf2f2] border border-[#f5c6cb] rounded-lg hover:bg-[#fae4e4] transition-colors"
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
              ? 'border-[#e0a861] bg-[#f8f4e3]'
              : 'border-[#e6dfcb] bg-[#fefcf1]/70 hover:border-[#e0a861] hover:bg-[#f8f4e3]/50',
            activeError && 'border-[#f5c6cb] bg-[#fdf2f2]/40'
          )}
        >
          <div className="h-12 w-12 rounded-full bg-white border border-[#e6dfcb] flex items-center justify-center shadow-xs text-[#e0a861] group-hover:scale-110 transition-transform">
            <UploadCloud className="h-6 w-6" />
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold text-[#2c3324]">
              Click to browse from your device <span className="text-[#707666] font-normal">or drag & drop</span>
            </p>
            <p className="text-[11px] text-[#707666]">{helperText}</p>
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
