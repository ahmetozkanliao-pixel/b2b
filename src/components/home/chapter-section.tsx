import { cn } from "@/lib/utils";

type ChapterVariant = "dark" | "light" | "muted";

interface ChapterSectionProps {
  id: string;
  variant?: ChapterVariant;
  className?: string;
  children: React.ReactNode;
  fullHeight?: boolean;
}

const variantStyles: Record<ChapterVariant, string> = {
  dark: "gradient-hero text-white",
  light: "bg-white text-slate-900",
  muted: "bg-slate-50 text-slate-900",
};

export function ChapterSection({
  id,
  variant = "light",
  className,
  children,
  fullHeight = true,
}: ChapterSectionProps) {
  return (
    <section
      id={id}
      data-chapter={id}
      className={cn(
        "chapter-section relative overflow-hidden",
        fullHeight && "min-h-screen",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </section>
  );
}
