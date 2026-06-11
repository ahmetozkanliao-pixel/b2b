import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "brand";
  className?: string;
}

const variants = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-200/60",
  info: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/60",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-200/60",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
