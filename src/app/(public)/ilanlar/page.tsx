import type { Metadata } from "next";
import { isDemoMode } from "@/lib/demo/config";
import { getDemoListings } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import { getAppCategories } from "@/lib/get-categories";
import { ListingCard } from "@/components/home/listing-card";

export const metadata: Metadata = {
  title: "İlanlar",
  description: "Aktif üretim ve tedarik ilanlarını keşfedin.",
};

export default async function ListingsPage() {
  const categories = await getAppCategories();
  let listings = isDemoMode() ? getDemoListings() : [];

  if (!isDemoMode()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("listings")
      .select("*, category:categories(name, slug)")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    listings = data || [];
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative">
        <p className="editorial-label">İlanlar</p>
        <h1 className="editorial-heading mt-3 text-3xl sm:text-4xl">Aktif İlanlar</h1>
        <p className="mt-3 text-neutral-400">Güncel üretim ve tedarik talepleri</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} categories={categories} />
          ))
        ) : (
          <p className="col-span-full py-12 text-center text-neutral-500">
            Henüz aktif ilan bulunmuyor.
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
