import { Badge } from "@/components/ui/badge";
import { getCategoryById } from "@/lib/categories";
import type { Category } from "@/types";

interface CategoryBadgesProps {
  categories: Category[];
  allCategories?: Category[];
  size?: "sm" | "md";
}

export function CategoryBadges({
  categories,
  allCategories,
  size = "sm",
}: CategoryBadgesProps) {
  if (!categories.length) return null;

  const lookup = allCategories ?? categories;

  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((cat) => {
        const parent = cat.parent_id ? getCategoryById(lookup, cat.parent_id) : null;
        const label = parent ? `${parent.name} › ${cat.name}` : cat.name;
        return (
          <Badge key={cat.id} variant="info" className={size === "sm" ? "text-xs" : ""}>
            {label}
          </Badge>
        );
      })}
    </div>
  );
}
