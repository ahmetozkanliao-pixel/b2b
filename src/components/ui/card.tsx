import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "light" | "dark";
}

export function Card({ children, className, hover, variant = "dark" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl text-neutral-100",
        variant === "dark"
          ? "gradient-box shadow-card"
          : "border border-neutral-200 bg-white text-neutral-900 shadow-card",
        hover && "gradient-box-hover",
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
    <div
      className={cn(
        "border-t border-transparent p-6 [border-image:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)_1]",
        className
      )}
    >
      {children}
    </div>
  );
}
