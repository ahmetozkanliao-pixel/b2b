import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  variant?: "light" | "dark";
  className?: string;
}

const sizes = {
  sm: { box: "h-8 w-8 text-xs", text: "text-base" },
  md: { box: "h-9 w-9 text-sm", text: "text-lg" },
  lg: { box: "h-11 w-11 text-sm", text: "text-xl" },
};

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  variant = "dark",
  className,
}: LogoProps) {
  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-slate-900";

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl gradient-brand font-bold text-white shadow-soft",
          s.box
        )}
      >
        B2B
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn("font-bold tracking-tight", s.text, textColor)}>
            Üretim Platformu
          </span>
          {size !== "sm" && (
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-widest",
                variant === "light" ? "text-brand-300" : "text-slate-400"
              )}
            >
              Güvenilir B2B Ağı
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
