import type { Metadata } from "next";
import { isDemoMode } from "@/lib/demo/config";
import { getDemoListings } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/home/listing-card";

export const metadata: Metadata = {
  title: "İlanlar",
  description: "Aktif üretim ve tedarik ilanlarını keşfedin.",
};

export default async function ListingsPage() {
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Aktif İlanlar</h1>
      <p className="mt-2 text-gray-500">Güncel üretim ve tedarik talepleri</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <p className="col-span-full py-12 text-center text-gray-500">
            Henüz aktif ilan bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
}
