"use client";

import Link from "next/link";
import { ListingCard } from "./listing-card";
import { Button } from "@/components/ui/button";
import { ChapterSection } from "@/components/home/chapter-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Listing } from "@/types";

const demoListings: Listing[] = [
  {
    id: "1",
    company_id: "c1",
    category_id: "cat1",
    title: "Paslanmaz Çelik Boru Üretimi",
    description: "Endüstriyel kullanım için paslanmaz çelik boru üretimi talep edilmektedir.",
    technical_details: null,
    budget_min: 50000,
    budget_max: 150000,
    delivery_time: "30 gün",
    city: "İstanbul",
    application_deadline: "2026-07-01",
    status: "active",
    view_count: 42,
    created_at: "2026-06-01T10:00:00Z",
    category: { id: "cat1", name: "Metal İşleme", slug: "metal-isleme", icon: null },
  },
  {
    id: "2",
    company_id: "c2",
    category_id: "cat2",
    title: "Plastik Enjeksiyon Kalıp Üretimi",
    description: "Elektronik kutu için plastik enjeksiyon kalıbı üretimi.",
    technical_details: null,
    budget_min: 25000,
    budget_max: 80000,
    delivery_time: "45 gün",
    city: "Bursa",
    application_deadline: "2026-07-15",
    status: "active",
    view_count: 28,
    created_at: "2026-05-28T14:00:00Z",
    category: { id: "cat2", name: "Plastik Enjeksiyon", slug: "plastik-enjeksiyon", icon: null },
  },
  {
    id: "3",
    company_id: "c3",
    category_id: "cat3",
    title: "Tekstil Kumaş Tedariki",
    description: "Yıllık 50.000 metre pamuklu kumaş tedarik ihtiyacı.",
    technical_details: null,
    budget_min: 100000,
    budget_max: 300000,
    delivery_time: "60 gün",
    city: "İzmir",
    application_deadline: "2026-08-01",
    status: "active",
    view_count: 65,
    created_at: "2026-05-25T09:00:00Z",
    category: { id: "cat3", name: "Tekstil Üretimi", slug: "tekstil-uretimi", icon: null },
  },
];

export function LatestListings() {
  const { t } = useI18n();

  return (
    <ChapterSection id="ilanlar" variant="white" className="!min-h-0">
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <ScrollReveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="editorial-label">{t("home.listings.label")}</p>
            <h2 className="editorial-heading mt-4 text-4xl sm:text-5xl lg:text-6xl">
              {t("home.listings.title")}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
              {t("home.listings.subtitle2")}
            </p>
          </div>
          <Link href="/ilanlar" className="hidden sm:block">
            <Button variant="outline" className="rounded-lg px-6">
              {t("home.listings.viewAllShort")}
            </Button>
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-14">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/ilanlar">
            <Button variant="outline" className="rounded-full px-6">
              {t("home.listings.viewAllShort")}
            </Button>
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}
