import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "brand";
  className?: string;
}

const variants = {
  default: "bg-white/10 text-neutral-300 ring-1 ring-white/10",
  success: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  danger: "bg-red-500/10 text-red-300 ring-1 ring-red-500/20",
  info: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20",
  brand: "bg-white/10 text-neutral-200 ring-1 ring-white/15",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
