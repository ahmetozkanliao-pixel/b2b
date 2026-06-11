import type { Category, Company, Listing } from "@/types";

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
