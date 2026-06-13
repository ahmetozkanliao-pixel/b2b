import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: "light" | "dark";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, variant = "light", ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "block text-sm font-medium",
            variant === "dark" ? "text-neutral-300" : "text-slate-700"
          )}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          "block w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50",
          variant === "dark"
            ? "gradient-input text-white placeholder:text-neutral-500 focus:ring-0"
            : "border border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-400",
          error && "border-red-400 focus:border-red-400 focus:ring-red-200",
          className
        )}
        {...props}
      />
      {error && (
        <p className={cn("text-sm", variant === "dark" ? "text-red-400" : "text-red-600")}>
          {error}
        </p>
      )}
    </div>
  )
);
Textarea.displayName = "Textarea";
