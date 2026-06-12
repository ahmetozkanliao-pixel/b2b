import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  verified?: boolean;
  type?: "producer" | "demand" | "company";
  className?: string;
  showLabel?: boolean;
}

export function VerifiedBadge({
  verified = false,
  type = "company",
  className,
  showLabel = true,
}: VerifiedBadgeProps) {
  if (!verified) return null;

  const label =
    type === "producer"
      ? "Doğrulanmış Üretici"
      : type === "demand"
        ? "Doğrulanmış Firma"
        : "Doğrulanmış";

  return (
    <Badge variant="success" className={cn("gap-1", className)}>
      <BadgeCheck className="h-3 w-3" />
      {showLabel ? label : <span className="sr-only">{label}</span>}
    </Badge>
  );
}
