import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Factory,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { CategoryBadges } from "@/components/ui/category-badges";
import { ShareProfileButton } from "@/components/profile/share-profile-button";
import { getCategoriesByIds } from "@/lib/categories";
import { getCompanyProfilePath } from "@/lib/utils";
import type { Category, Company, PortfolioItem } from "@/types";

interface CompanyProfileViewProps {
  company: Company;
  portfolio: PortfolioItem[];
  categories?: Category[];
  isOwner?: boolean;
  activeListingsCount?: number;
}

export function CompanyProfileView({
  company,
  portfolio,
  categories = [],
  isOwner = false,
  activeListingsCount,
}: CompanyProfileViewProps) {
  const profilePath = getCompanyProfilePath(company);
  const isProducer = company.type === "producer";
  const selectedCategories = getCategoriesByIds(company.category_ids || [], categories);

  return (
    <div className="min-h-screen bg-ambient">
      <div className="relative h-48 bg-neutral-900 sm:h-56">
        {company.cover_image_url ? (
          <Image
            src={company.cover_image_url}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 gradient-hero" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profil başlığı */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-4 border-black bg-neutral-900">
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={company.name}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-xl object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 text-2xl font-semibold text-white">
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold text-white sm:text-3xl">{company.name}</h1>
                  <VerifiedBadge
                    verified={company.verified}
                    type={isProducer ? "producer" : "demand"}
                  />
                </div>
                {company.tagline && (
                  <p className="mt-1 text-neutral-400">{company.tagline}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    {isProducer ? (
                      <Factory className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <Building2 className="h-4 w-4 text-neutral-400" />
                    )}
                    {isProducer ? "Üretici Firma" : "Talep Sahibi"}
                  </span>
                  {company.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {company.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <ShareProfileButton url={profilePath} companyName={company.name} />
              {isOwner && (
                <Link href="/dashboard/firma">
                  <Badge variant="brand" className="cursor-pointer px-3 py-1.5 text-sm">
                    Profili Düzenle
                  </Badge>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sol: Hakkında + İletişim */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-medium text-white">Hakkında</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                {company.description || "Henüz açıklama eklenmemiş."}
              </p>

              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-neutral-400">
                {company.founded_year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-neutral-500" />
                    Kuruluş: {company.founded_year}
                  </div>
                )}
                {company.employee_count && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-neutral-500" />
                    {company.employee_count} çalışan
                  </div>
                )}
                {!isProducer && activeListingsCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-neutral-500" />
                    {activeListingsCount} aktif ilan
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-medium text-white">İletişim</h2>
              <div className="mt-3 space-y-2.5 text-sm">
                {company.website && (
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-300 hover:text-white"
                  >
                    <Globe className="h-4 w-4" />
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Phone className="h-4 w-4 text-neutral-500" />
                    {company.phone}
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Mail className="h-4 w-4 text-neutral-500" />
                    {company.email}
                  </div>
                )}
              </div>
            </div>

            {isProducer && selectedCategories.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="font-medium text-white">Üretim Alanları</h2>
                <div className="mt-3">
                  <CategoryBadges categories={selectedCategories} />
                </div>
              </div>
            )}
          </div>

          {/* Sağ: Önceki işler */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-medium text-white">
                {isProducer ? "Tamamlanan Projeler" : "Önceki İşler & Projeler"}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Firmanın daha önce gerçekleştirdiği çalışmalar
              </p>

              {portfolio.length === 0 ? (
                <p className="mt-8 text-center text-sm text-neutral-500">
                  Henüz proje paylaşılmamış.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-lg border border-white/10 transition-colors hover:border-white/15"
                    >
                      <div className="relative h-40 bg-white/5">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-neutral-600">
                            <Factory className="h-10 w-10" />
                          </div>
                        )}
                        {item.year && (
                          <span className="absolute right-2 top-2 rounded-lg border border-white/10 bg-black/70 px-2 py-0.5 text-xs font-medium text-neutral-300">
                            {item.year}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-white">{item.title}</h3>
                        {item.client_name && (
                          <p className="mt-0.5 text-xs text-neutral-500">{item.client_name}</p>
                        )}
                        {item.description && (
                          <p className="mt-2 text-sm leading-relaxed text-neutral-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
