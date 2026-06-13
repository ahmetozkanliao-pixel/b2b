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
  dark: "chapter-bg-dark section-divider text-neutral-900 dark:text-white",
  light: "chapter-bg-light section-divider text-neutral-900 dark:text-white",
  muted: "chapter-bg-muted section-divider text-neutral-900 dark:text-white",
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
