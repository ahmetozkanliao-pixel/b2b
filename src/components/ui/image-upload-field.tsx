"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { compressImageFile } from "@/lib/utils/compress-image";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  previewClassName?: string;
  accept?: string;
  maxSizeMb?: number;
}

function isDataUrl(url: string) {
  return url.startsWith("data:");
}

function isApiLogoPath(url: string) {
  return url.startsWith("/api/demo/logo/");
}

export function ImageUploadField({
  id,
  label,
  value,
  onChange,
  hint,
  previewClassName,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMb = 2,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin (JPG, PNG, WebP).");
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Dosya boyutu en fazla ${maxSizeMb} MB olabilir.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const compressed = await compressImageFile(file);
      onChange(compressed);
    } catch {
      setError("Görsel işlenemedi. Daha küçük bir dosya deneyin.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const urlValue = isDataUrl(value) || isApiLogoPath(value) ? "" : value;

  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50",
            value && "border-solid border-slate-200",
            previewClassName
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          ) : value ? (
            <>
              {isDataUrl(value) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="Önizleme" className="h-full w-full object-cover" />
              ) : (
                <Image src={value} alt="Önizleme" fill className="object-cover" unoptimized />
              )}
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-1 top-1 rounded-full bg-slate-900/70 p-1 text-white transition-colors hover:bg-slate-900"
                aria-label="Logoyu kaldır"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <ImagePlus className="h-8 w-8 text-slate-300" />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            <ImagePlus className="h-4 w-4" />
            {uploading ? "İşleniyor..." : "Bilgisayardan yükle"}
          </button>
          <Input
            id={id}
            label="veya görsel bağlantısı (URL)"
            value={urlValue}
            onChange={(e) => {
              onChange(e.target.value);
              setError(null);
            }}
            placeholder="https://..."
          />
          {hint && <p className="text-xs text-slate-400">{hint}</p>}
          <p className="text-xs text-slate-400">
            Yüklenen görseller otomatik küçültülür (en fazla 400px).
          </p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
