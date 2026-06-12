"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/i18n-provider";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  variant?: "light" | "dark";
  className?: string;
}

const sizes = {
  sm: { box: "h-7 w-7 text-[10px]", text: "text-sm" },
  md: { box: "h-8 w-8 text-[11px]", text: "text-base" },
  lg: { box: "h-9 w-9 text-xs", text: "text-lg" },
};

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  variant = "dark",
  className,
}: LogoProps) {
  const { t } = useI18n();
  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-white";
  const isDarkContext = variant === "light";

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-md border font-semibold",
          isDarkContext
            ? "border-white/20 bg-white text-black"
            : "border-white/20 bg-white text-black",
          s.box
        )}
      >
        B2
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn("font-semibold tracking-tight", s.text, textColor)}>
            {t("logo.tagline")}
          </span>
          {size !== "sm" && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              {t("logo.subtitle")}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
