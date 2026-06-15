"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, GitCompare, MessageCircle, Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { cn, formatCurrency, formatDate, getCompanyProfilePath } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

export interface CompareApplication {
  id: string;
  listingId: string;
  listingTitle: string;
  producerName: string;
  producerCity: string | null;
  producerCompanyId: string;
  producerSlug?: string | null;
  verified: boolean;
  isPro: boolean;
  profilePublic: boolean;
  proposedBudget: number | null;
  proposedDelivery: string | null;
  status: ApplicationStatus;
  createdAt: string;
  coverLetter: string | null;
  chatRoomId?: string;
}

interface ApplicationCompareProps {
  groups: Array<{
    listingId: string;
    listingTitle: string;
    applications: CompareApplication[];
  }>;
}

const MAX_COMPARE = 5;

const statusLabels: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  pending: { label: "Bekliyor", variant: "warning" },
  approved: { label: "Onaylandı", variant: "success" },
  rejected: { label: "Reddedildi", variant: "danger" },
  withdrawn: { label: "Geri Çekildi", variant: "default" },
  agreed: { label: "Anlaşıldı", variant: "success" },
  no_agreement: { label: "Anlaşılamadı", variant: "default" },
};

const messageableStatuses = new Set(["approved", "agreed", "no_agreement"]);

type SortKey = "price_asc" | "price_desc" | "date_desc" | "date_asc" | "name_asc";

function lowestBudget(apps: CompareApplication[]) {
  const values = apps.map((a) => a.proposedBudget).filter((v): v is number => v != null);
  if (!values.length) return null;
  return Math.min(...values);
}

function sortApplications(apps: CompareApplication[], sort: SortKey): CompareApplication[] {
  const sorted = [...apps];
  sorted.sort((a, b) => {
    switch (sort) {
      case "price_asc": {
        const av = a.proposedBudget ?? Number.POSITIVE_INFINITY;
        const bv = b.proposedBudget ?? Number.POSITIVE_INFINITY;
        return av - bv;
      }
      case "price_desc": {
        const av = a.proposedBudget ?? Number.NEGATIVE_INFINITY;
        const bv = b.proposedBudget ?? Number.NEGATIVE_INFINITY;
        return bv - av;
      }
      case "date_desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "date_asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name_asc":
        return a.producerName.localeCompare(b.producerName, "tr");
      default:
        return 0;
    }
  });
  return sorted;
}

function defaultSelectedIds(apps: CompareApplication[]): Set<string> {
  const ids = apps.slice(0, Math.min(4, apps.length)).map((a) => a.id);
  return new Set(ids);
}

export function ApplicationCompare({ groups }: ApplicationCompareProps) {
  const comparableGroups = groups.filter((g) => g.applications.length >= 2);
  if (!comparableGroups.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitCompare className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-semibold text-gray-900">Teklif Karşılaştırma</h2>
      </div>

      {comparableGroups.map((group) => (
        <CompareGroupCard key={group.listingId} group={group} />
      ))}
    </div>
  );
}

function CompareGroupCard({
  group,
}: {
  group: {
    listingId: string;
    listingTitle: string;
    applications: CompareApplication[];
  };
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [sort, setSort] = useState<SortKey>("price_asc");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [proOnly, setProOnly] = useState(false);
  const [hasPriceOnly, setHasPriceOnly] = useState(false);
  const [messageableOnly, setMessageableOnly] = useState(false);
  const [profileOnly, setProfileOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
    defaultSelectedIds(sortApplications(group.applications, "price_asc"))
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = group.applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (verifiedOnly && !app.verified) return false;
      if (proOnly && !app.isPro) return false;
      if (hasPriceOnly && app.proposedBudget == null) return false;
      if (messageableOnly && !(messageableStatuses.has(app.status) && app.chatRoomId)) return false;
      if (profileOnly && !app.profilePublic) return false;
      if (!q) return true;
      const haystack = `${app.producerName} ${app.producerCity ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
    return sortApplications(result, sort);
  }, [group.applications, search, statusFilter, sort, verifiedOnly, proOnly, hasPriceOnly, messageableOnly, profileOnly]);

  const compared = filtered.filter((app) => selectedIds.has(app.id));
  const minBudget = lowestBudget(compared);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (next.size >= MAX_COMPARE) return prev;
      next.add(id);
      return next;
    });
  }

  function selectTop(n: number) {
    setSelectedIds(new Set(filtered.slice(0, Math.min(n, MAX_COMPARE)).map((a) => a.id)));
  }

  function selectLowestPriced() {
    const withPrice = filtered.filter((a) => a.proposedBudget != null);
    setSelectedIds(new Set(withPrice.slice(0, MAX_COMPARE).map((a) => a.id)));
  }

  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

  return (
    <Card className="border-brand-100">
      <CardHeader className="pb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">İlan</p>
        <h3 className="text-base font-semibold text-slate-900">{group.listingTitle}</h3>
        <p className="text-sm text-slate-500">
          {group.applications.length} teklif · {filtered.length} listeleniyor ·{" "}
          {compared.length} karşılaştırmada
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-brand-600" />
            Filtrele ve sırala
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Firma veya şehir ara..."
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "all")}
              className={selectClass}
              aria-label="Durum filtresi"
            >
              <option value="all">Tüm durumlar</option>
              {Object.entries(statusLabels).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={selectClass}
              aria-label="Sıralama"
            >
              <option value="price_asc">Fiyat: düşükten yükseğe</option>
              <option value="price_desc">Fiyat: yüksekten düşüğe</option>
              <option value="date_desc">Tarih: en yeni</option>
              <option value="date_asc">Tarih: en eski</option>
              <option value="name_asc">Firma adı (A-Z)</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
              Doğrulanmış
            </FilterChip>
            <FilterChip active={proOnly} onClick={() => setProOnly((v) => !v)}>
              Pro tedarikçi
            </FilterChip>
            <FilterChip active={hasPriceOnly} onClick={() => setHasPriceOnly((v) => !v)}>
              Fiyatı olanlar
            </FilterChip>
            <FilterChip active={messageableOnly} onClick={() => setMessageableOnly((v) => !v)}>
              Mesaj açık
            </FilterChip>
            <FilterChip active={profileOnly} onClick={() => setProfileOnly((v) => !v)}>
              Profili olanlar
            </FilterChip>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200/80 pt-3">
            <QuickAction onClick={() => selectLowestPriced()}>En düşük fiyatlıları seç</QuickAction>
            <QuickAction onClick={() => selectTop(3)}>İlk 3&apos;ü seç</QuickAction>
            <QuickAction onClick={() => selectTop(MAX_COMPARE)}>İlk 5&apos;i seç</QuickAction>
            <QuickAction onClick={() => selectTop(filtered.length)}>Filtrelenenleri seç (max {MAX_COMPARE})</QuickAction>
            <QuickAction onClick={() => setSelectedIds(new Set())}>Seçimi temizle</QuickAction>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Karşılaştırmaya ekle (en fazla {MAX_COMPARE})
          </p>
          <div className="max-h-52 space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
            {filtered.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-slate-500">
                Filtrelere uygun teklif bulunamadı.
              </p>
            ) : (
              filtered.map((app) => {
                const checked = selectedIds.has(app.id);
                const disabled = !checked && selectedIds.size >= MAX_COMPARE;
                const status = statusLabels[app.status] || statusLabels.pending;
                const canMessage = messageableStatuses.has(app.status) && !!app.chatRoomId;

                return (
                  <div
                    key={app.id}
                    className={cn(
                      "flex flex-col gap-2 rounded-lg px-2 py-2 transition-colors sm:flex-row sm:items-center",
                      checked && "bg-brand-50/60 ring-1 ring-brand-200/60",
                      !checked && "hover:bg-slate-50"
                    )}
                  >
                    <label
                      className={cn(
                        "flex min-w-0 flex-1 cursor-pointer items-center gap-3",
                        disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleSelect(app.id)}
                        className="h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate text-sm font-medium text-slate-900">
                            {app.producerName}
                          </span>
                          {app.verified && <VerifiedBadge verified type="producer" />}
                          {app.isPro && <Badge variant="brand">Pro</Badge>}
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          {app.producerCity || "—"}
                          {app.proposedBudget != null && ` · ${formatCurrency(app.proposedBudget)}`}
                          {app.proposedDelivery && ` · ${app.proposedDelivery}`}
                        </p>
                      </div>
                    </label>

                    <div className="flex shrink-0 flex-wrap gap-1.5 pl-7 sm:pl-0">
                      {app.profilePublic && (
                        <Link
                          href={getCompanyProfilePath({
                            id: app.producerCompanyId,
                            slug: app.producerSlug,
                          })}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700"
                        >
                          <Building2 className="h-3.5 w-3.5" />
                          Firma profilini göster
                        </Link>
                      )}
                      {canMessage && (
                        <Link
                          href={`/dashboard/mesajlar/${app.chatRoomId}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-2.5 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Mesaja git
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {compared.length >= 2 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                  <th className="pb-3 pl-4 pr-4 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Kriter
                  </th>
                  {compared.map((app) => (
                    <th
                      key={app.id}
                      className="min-w-[140px] px-3 pb-3 pt-3 text-xs font-semibold text-slate-700"
                    >
                      {app.profilePublic ? (
                        <Link
                          href={getCompanyProfilePath({
                            id: app.producerCompanyId,
                            slug: app.producerSlug,
                          })}
                          className="text-brand-600 hover:text-brand-700"
                          target="_blank"
                        >
                          {app.producerName}
                        </Link>
                      ) : (
                        app.producerName
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <CompareRow label="Şehir">
                  {compared.map((app) => (
                    <td key={app.id} className="px-3 py-3 text-slate-600">
                      {app.producerCity || "—"}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Teklif">
                  {compared.map((app) => (
                    <td
                      key={app.id}
                      className={`px-3 py-3 font-semibold ${
                        app.proposedBudget != null && app.proposedBudget === minBudget
                          ? "text-emerald-700"
                          : "text-slate-900"
                      }`}
                    >
                      {app.proposedBudget != null ? formatCurrency(app.proposedBudget) : "—"}
                      {app.proposedBudget != null && app.proposedBudget === minBudget && (
                        <span className="ml-1 text-[10px] font-medium text-emerald-600">
                          en düşük
                        </span>
                      )}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Teslim">
                  {compared.map((app) => (
                    <td key={app.id} className="px-3 py-3 text-slate-600">
                      {app.proposedDelivery || "—"}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Güven">
                  {compared.map((app) => (
                    <td key={app.id} className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        <VerifiedBadge verified={app.verified} type="producer" />
                        {app.isPro && <Badge variant="brand">Pro</Badge>}
                        {!app.verified && !app.isPro && <span className="text-slate-400">—</span>}
                      </div>
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Durum">
                  {compared.map((app) => {
                    const status = statusLabels[app.status] || statusLabels.pending;
                    return (
                      <td key={app.id} className="px-3 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                    );
                  })}
                </CompareRow>
                <CompareRow label="Tarih">
                  {compared.map((app) => (
                    <td key={app.id} className="px-3 py-3 text-slate-500">
                      {formatDate(app.createdAt)}
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Ön yazı">
                  {compared.map((app) => (
                    <td key={app.id} className="px-3 py-3 align-top text-slate-600">
                      <p className="line-clamp-3 max-w-[200px]">{app.coverLetter || "—"}</p>
                    </td>
                  ))}
                </CompareRow>
                <CompareRow label="Mesaj">
                  {compared.map((app) => (
                    <td key={app.id} className="px-3 py-3">
                      {messageableStatuses.has(app.status) && app.chatRoomId ? (
                        <Link
                          href={`/dashboard/mesajlar/${app.chatRoomId}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Git
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  ))}
                </CompareRow>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            Yan yana karşılaştırmak için listeden en az 2 teklif seçin.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-brand-400 bg-brand-50 text-brand-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      )}
    >
      {children}
    </button>
  );
}

function QuickAction({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700"
    >
      {children}
    </button>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td className="whitespace-nowrap py-3 pl-4 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </td>
      {children}
    </tr>
  );
}
