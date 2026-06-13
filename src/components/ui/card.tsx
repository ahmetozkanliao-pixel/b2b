import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "light" | "dark";
}

export function Card({ children, className, hover, variant = "light" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variant === "dark"
          ? "gradient-box text-neutral-100 shadow-card"
          : "border border-primary-100 bg-white text-slate-900 shadow-soft",
        hover && variant === "dark" && "gradient-box-hover",
        hover && variant === "light" && "transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-primary-100 p-6", className)}>
      {children}
    </div>
  );
}
