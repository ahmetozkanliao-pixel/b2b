"use client";

import { cn } from "@/lib/utils";

interface ResendCubeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-32 w-32 [--cube:64px]",
  md: "h-48 w-48 [--cube:96px]",
  lg: "h-64 w-64 [--cube:128px]",
};

export function ResendCube({ className, size = "lg" }: ResendCubeProps) {
  return (
    <div
      className={cn("resend-cube-scene", sizeMap[size], className)}
      aria-hidden
    >
      <div className="resend-cube">
        <div className="resend-cube-face resend-cube-front" />
        <div className="resend-cube-face resend-cube-back" />
        <div className="resend-cube-face resend-cube-right" />
        <div className="resend-cube-face resend-cube-left" />
        <div className="resend-cube-face resend-cube-top" />
        <div className="resend-cube-face resend-cube-bottom" />
      </div>
      <div className="resend-cube-glow" />
    </div>
  );
}
