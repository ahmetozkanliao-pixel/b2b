import type { Category, Company, Listing } from "@/types";

export function getMainCategories(categories: Category[]): Category[] {
  return categories.filter((c) => !c.parent_id);
}

export function getSubCategories(categories: Category[], parentId: string): Category[] {
  return categories.filter((c) => c.parent_id === parentId);
}

export function getCategoryById(
  categories: Category[],
  id: string | null | undefined
): Category | undefined {
  if (!id) return undefined;
  return categories.find((c) => c.id === id);
}

export function getCategoryLabel(
  categories: Category[],
  categoryId: string | null | undefined
): string {
  const category = getCategoryById(categories, categoryId);
  if (!category) return "—";

  if (category.parent_id) {
    const parent = getCategoryById(categories, category.parent_id);
    return parent ? `${parent.name} › ${category.name}` : category.name;
  }

  return category.name;
}

export function getCategoriesByIds(
  ids: string[] | undefined | null,
  allCategories: Category[]
): Category[] {
  if (!ids?.length) return [];
  return allCategories.filter((c) => ids.includes(c.id));
}

export function producerMatchesListing(
  producer: Pick<Company, "category_ids">,
  listing: Pick<Listing, "category_id">
): boolean {
  if (!listing.category_id) return false;
  if (!producer.category_ids?.length) return false;
  return producer.category_ids.includes(listing.category_id);
}
