import { cn } from "@/lib/utils";

type ChapterVariant = "dark" | "light" | "muted" | "white";

interface ChapterSectionProps {
  id: string;
  variant?: ChapterVariant;
  className?: string;
  children: React.ReactNode;
  fullHeight?: boolean;
}

const variantStyles: Record<ChapterVariant, string> = {
  dark: "chapter-bg-dark surface-dark section-divider text-slate-200",
  light: "chapter-bg-light section-divider text-slate-900",
  muted: "chapter-bg-muted section-divider text-slate-900",
  white: "chapter-bg-white section-divider text-slate-900",
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
