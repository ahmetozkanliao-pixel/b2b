"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareProfileButtonProps {
  url: string;
  companyName: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function ShareProfileButton({
  url,
  companyName,
  variant = "outline",
  size = "sm",
}: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${companyName} — B2B Profil`,
          text: `${companyName} firma profilini inceleyin.`,
          url: fullUrl,
        });
        return;
      } catch {
        // Kullanıcı iptal etti veya paylaşım desteklenmiyor
      }
    }

    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant={variant} size={size} onClick={handleShare}>
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

export function CopyProfileLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const fullUrl = `${window.location.origin}${url}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100"
    >
      <Link2 className="h-4 w-4 shrink-0 text-brand-600" />
      <span className="truncate font-mono text-xs">{url}</span>
      {copied && <span className="ml-auto text-xs font-semibold text-brand-600">Kopyalandı</span>}
    </button>
  );
}
