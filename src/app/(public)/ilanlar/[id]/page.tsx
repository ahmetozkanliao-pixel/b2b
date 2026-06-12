import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import { DEMO_DEMAND_USER } from "@/lib/demo/config";
import { getCategoryLabel, producerMatchesListing } from "@/lib/categories";
import { getAppCategories } from "@/lib/get-categories";
import { getDemoCompany, getDemoListingById, getDemoMonthlyApplicationCount, hasDemoApplication } from "@/lib/demo/store";
import { canProducerApply, canUsePublicProfile, getRemainingApplications, PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT } from "@/lib/membership";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ApplyForm } from "@/components/applications/apply-form";
import { formatDate, formatBudget, getCompanyProfilePath } from "@/lib/utils";
import { MapPin, Calendar, Clock, Wallet, ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  if (isDemoMode()) {
    const listing = getDemoListingById(id);
    return { title: listing?.title || "İlan Detayı" };
  }

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("title")
    .eq("id", id)
    .single();

  return { title: listing?.title || "İlan Detayı" };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const categories = await getAppCategories();

  if (isDemoMode()) {
    const listing = getDemoListingById(id);
    if (!listing) notFound();

    const company = getDemoCompany(listing.company_id);
    const producerCompany = session?.companyId
      ? getDemoCompany(session.companyId)
      : null;
    const isProducer = session?.role === "producer";
    const alreadyApplied = session ? hasDemoApplication(id, session.id) : false;
    const categoryMatch = producerCompany
      ? producerMatchesListing(producerCompany, listing)
      : false;
    const monthlyCount = session ? getDemoMonthlyApplicationCount(session.id) : 0;
    const canApplyLimit = producerCompany
      ? canProducerApply(monthlyCount, producerCompany)
      : false;
    const remaining = producerCompany
      ? getRemainingApplications(monthlyCount, producerCompany)
      : null;
    const canApply =
      isProducer && session?.companyId && !alreadyApplied && categoryMatch && canApplyLimit;

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/ilanlar"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          İlanlara Dön
        </Link>

        <div className="mb-6">
          {listing.category_id && (
            <Badge variant="info">{getCategoryLabel(categories, listing.category_id)}</Badge>
          )}
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{listing.title}</h1>
          {listing.image_url && (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="mt-4 max-h-80 w-full rounded-xl object-cover"
            />
          )}
          <p className="mt-2 text-gray-500">
            {company && canUsePublicProfile(company) ? (
              <Link href={getCompanyProfilePath(company)} className="font-medium text-brand-600 hover:text-brand-700">
                {company.name}
              </Link>
            ) : (
              company?.name || "Firma"
            )}
            {company?.verified && " ✓ Doğrulanmış"}
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {listing.city && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {listing.city}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {formatDate(listing.created_at)}
          </div>
          {listing.delivery_time && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {listing.delivery_time}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Wallet className="h-4 w-4" />
            {formatBudget(listing.budget_min, listing.budget_max)}
          </div>
        </div>

        <Card className="mb-8">
          <CardContent>
            <h2 className="mb-3 text-lg font-semibold">Açıklama</h2>
            <p className="whitespace-pre-wrap text-gray-600">{listing.description}</p>
            {listing.technical_details && (
              <>
                <h2 className="mb-3 mt-6 text-lg font-semibold">Teknik Detaylar</h2>
                <p className="whitespace-pre-wrap text-gray-600">{listing.technical_details}</p>
              </>
            )}
          </CardContent>
        </Card>

        {isProducer && categoryMatch && !alreadyApplied && remaining !== null && (
          <p className="mb-4 text-sm text-slate-500">
            Bu ay kalan teklif hakkınız: <strong>{remaining}</strong> / {PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT}
          </p>
        )}

        {canApply && (
          <Card>
            <CardContent>
              <h2 className="mb-4 text-lg font-semibold">Bu İlana Başvur</h2>
              <ApplyForm
                listingId={listing.id}
                companyId={session!.companyId!}
                userId={session!.id}
                listingOwnerId={DEMO_DEMAND_USER.id}
                isDemo
              />
            </CardContent>
          </Card>
        )}

        {isProducer && categoryMatch && !alreadyApplied && !canApplyLimit && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">
                Aylık {PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT} teklif limitinize ulaştınız.
              </p>
              <Link
                href="/dashboard/ayarlar"
                className="mt-3 inline-block font-medium text-brand-600 hover:text-brand-700"
              >
                Pro&apos;ya yükselt — sınırsız teklif →
              </Link>
            </CardContent>
          </Card>
        )}

        {isProducer && !categoryMatch && !alreadyApplied && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">
                Bu ilan kategorisi üretim alanlarınızla eşleşmiyor.
              </p>
              <Link
                href="/dashboard/firma"
                className="mt-3 inline-block font-medium text-primary-600 hover:text-primary-700"
              >
                Kategorilerinizi Güncelleyin →
              </Link>
            </CardContent>
          </Card>
        )}

        {isProducer && alreadyApplied && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">Bu ilana zaten başvurdunuz.</p>
              <Link
                href="/dashboard/basvurularim"
                className="mt-3 inline-block font-medium text-primary-600 hover:text-primary-700"
              >
                Başvurularımı Gör →
              </Link>
            </CardContent>
          </Card>
        )}

        {!session && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">Başvurmak için üretici olarak giriş yapın.</p>
              <Link
                href="/giris"
                className="mt-3 inline-block font-medium text-primary-600 hover:text-primary-700"
              >
                Giriş Yap →
              </Link>
            </CardContent>
          </Card>
        )}

        {session?.role === "demand_owner" && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Bu sizin ilanınız. Başvuruları panelden yönetebilirsiniz.
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("*, category:categories(name), company:companies(id, slug, name, city, verified, type, membership_plan)")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (!listing) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  let canApply = false;
  let producerCompanyId = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "producer") {
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .eq("type", "producer")
        .single();

      if (company) {
        canApply = true;
        producerCompanyId = company.id;
      }
    }
  }

  const company = listing.company as {
    id: string;
    slug?: string | null;
    name: string;
    city: string;
    verified: boolean;
    type: "producer" | "demand_owner";
    membership_plan?: "free" | "pro";
  } | undefined;
  const category = listing.category as { name: string } | undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        {category && <Badge variant="info">{category.name}</Badge>}
        <h1 className="mt-3 text-3xl font-bold text-gray-900">{listing.title}</h1>
        <p className="mt-2 text-gray-500">
          {company && canUsePublicProfile(company) ? (
            <Link
              href={getCompanyProfilePath(company)}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              {company.name}
            </Link>
          ) : (
            company?.name || "Firma"
          )}
          {company?.verified && " ✓ Doğrulanmış"}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {listing.city && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {listing.city}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {formatDate(listing.created_at)}
        </div>
        {listing.delivery_time && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {listing.delivery_time}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Wallet className="h-4 w-4" />
          {formatBudget(listing.budget_min, listing.budget_max)}
        </div>
      </div>

      <Card className="mb-8">
        <CardContent>
          <h2 className="mb-3 text-lg font-semibold">Açıklama</h2>
          <p className="whitespace-pre-wrap text-gray-600">{listing.description}</p>
          {listing.technical_details && (
            <>
              <h2 className="mb-3 mt-6 text-lg font-semibold">Teknik Detaylar</h2>
              <p className="whitespace-pre-wrap text-gray-600">{listing.technical_details}</p>
            </>
          )}
        </CardContent>
      </Card>

      {canApply && (
        <Card>
          <CardContent>
            <h2 className="mb-4 text-lg font-semibold">Bu İlana Başvur</h2>
            <ApplyForm
              listingId={listing.id}
              companyId={producerCompanyId}
              userId={user!.id}
              listingOwnerId={listing.created_by}
            />
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Başvurmak için üretici olarak giriş yapın.</p>
            <a href="/giris" className="mt-3 inline-block text-primary-600 hover:text-primary-700 font-medium">
              Giriş Yap →
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
