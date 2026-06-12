import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "brand" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-gradient-to-b from-white to-neutral-200 text-black hover:from-neutral-100 hover:to-neutral-300 shadow-soft",
  brand: "bg-gradient-to-b from-white to-neutral-200 text-black hover:from-neutral-100 hover:to-neutral-300 shadow-soft",
  secondary: "gradient-box gradient-box-hover text-white",
  outline: "gradient-box gradient-box-hover text-white",
  ghost: "text-neutral-400 hover:bg-white/5 hover:text-white",
  danger: "bg-gradient-to-b from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600",
};

const sizes = {
  sm: "px-3.5 py-2 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-6 py-3 text-sm rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "brand", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
