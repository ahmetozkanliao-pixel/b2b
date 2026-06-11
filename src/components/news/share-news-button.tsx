"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareNewsButtonProps {
  url: string;
  title: string;
}

export function ShareNewsButton({ url, title }: ShareNewsButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const fullUrl = `${window.location.origin}${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url: fullUrl });
        return;
      } catch {
        // iptal veya desteklenmiyor
      }
    }

    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Kopyalandı
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Paylaş
        </>
      )}
    </Button>
  );
}

export function CopyNewsLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(`${window.location.origin}${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-100"
    >
      <Link2 className="h-4 w-4 shrink-0 text-brand-600" />
      <span className="truncate font-mono text-xs">{url}</span>
      {copied && <span className="ml-auto text-xs font-semibold text-brand-600">Kopyalandı</span>}
    </button>
  );
}
