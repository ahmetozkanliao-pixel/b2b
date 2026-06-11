import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types";

interface CategoryBadgesProps {
  categories: Category[];
  size?: "sm" | "md";
}

export function CategoryBadges({ categories, size = "sm" }: CategoryBadgesProps) {
  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((cat) => (
        <Badge key={cat.id} variant="info" className={size === "sm" ? "text-xs" : ""}>
          {cat.name}
        </Badge>
      ))}
    </div>
  );
}
