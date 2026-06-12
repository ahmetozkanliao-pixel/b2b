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
    <div className="min-h-screen bg-slate-50">
      {/* Kapak */}
      <div className="relative h-48 bg-primary-900 sm:h-56">
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
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profil başlığı */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-card">
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
                  <div className="flex h-full w-full items-center justify-center rounded-xl gradient-brand text-2xl font-bold text-white">
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{company.name}</h1>
                  <VerifiedBadge
                    verified={company.verified}
                    type={isProducer ? "producer" : "demand"}
                  />
                </div>
                {company.tagline && (
                  <p className="mt-1 text-slate-500">{company.tagline}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    {isProducer ? (
                      <Factory className="h-4 w-4 text-brand-600" />
                    ) : (
                      <Building2 className="h-4 w-4 text-primary-600" />
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
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
              <h2 className="font-semibold text-slate-900">Hakkında</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {company.description || "Henüz açıklama eklenmemiş."}
              </p>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                {company.founded_year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Kuruluş: {company.founded_year}
                  </div>
                )}
                {company.employee_count && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    {company.employee_count} çalışan
                  </div>
                )}
                {!isProducer && activeListingsCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    {activeListingsCount} aktif ilan
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
              <h2 className="font-semibold text-slate-900">İletişim</h2>
              <div className="mt-3 space-y-2.5 text-sm">
                {company.website && (
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-600 hover:text-brand-700"
                  >
                    <Globe className="h-4 w-4" />
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {company.phone}
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {company.email}
                  </div>
                )}
              </div>
            </div>

            {isProducer && selectedCategories.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
                <h2 className="font-semibold text-slate-900">Üretim Alanları</h2>
                <div className="mt-3">
                  <CategoryBadges categories={selectedCategories} />
                </div>
              </div>
            )}
          </div>

          {/* Sağ: Önceki işler */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-slate-900">
                {isProducer ? "Tamamlanan Projeler" : "Önceki İşler & Projeler"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Firmanın daha önce gerçekleştirdiği çalışmalar
              </p>

              {portfolio.length === 0 ? (
                <p className="mt-8 text-center text-sm text-slate-400">
                  Henüz proje paylaşılmamış.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-xl border border-slate-200/80 transition-shadow hover:shadow-card-hover"
                    >
                      <div className="relative h-40 bg-slate-100">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-300">
                            <Factory className="h-10 w-10" />
                          </div>
                        )}
                        {item.year && (
                          <span className="absolute right-2 top-2 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700">
                            {item.year}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                        {item.client_name && (
                          <p className="mt-0.5 text-xs text-slate-400">{item.client_name}</p>
                        )}
                        {item.description && (
                          <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
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
