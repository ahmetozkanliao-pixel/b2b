"use client";

import Link from "next/link";
import { GitCompare, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { formatCurrency, formatDate, getCompanyProfilePath } from "@/lib/utils";
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

const statusLabels: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  pending: { label: "Bekliyor", variant: "warning" },
  approved: { label: "Onaylandı", variant: "success" },
  rejected: { label: "Reddedildi", variant: "danger" },
  withdrawn: { label: "Geri Çekildi", variant: "default" },
  agreed: { label: "Anlaşıldı", variant: "success" },
  no_agreement: { label: "Anlaşılamadı", variant: "default" },
};

const messageableStatuses = new Set(["approved", "agreed", "no_agreement"]);

function lowestBudget(apps: CompareApplication[]) {
  const values = apps.map((a) => a.proposedBudget).filter((v): v is number => v != null);
  if (!values.length) return null;
  return Math.min(...values);
}

export function ApplicationCompare({ groups }: ApplicationCompareProps) {
  const comparableGroups = groups.filter((g) => g.applications.length >= 2);
  if (!comparableGroups.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitCompare className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-semibold text-gray-900">Başvuru Karşılaştırma</h2>
      </div>

      {comparableGroups.map((group) => {
        const minBudget = lowestBudget(group.applications);

        return (
          <Card key={group.listingId} className="border-brand-100">
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                İlan
              </p>
              <h3 className="text-base font-semibold text-slate-900">{group.listingTitle}</h3>
              <p className="text-sm text-slate-500">
                {group.applications.length} başvuru yan yana karşılaştırılıyor
              </p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Kriter
                    </th>
                    {group.applications.map((app) => (
                      <th
                        key={app.id}
                        className="pb-3 px-3 text-xs font-semibold text-slate-700 min-w-[140px]"
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
                    {group.applications.map((app) => (
                      <td key={app.id} className="py-3 px-3 text-slate-600">
                        {app.producerCity || "—"}
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label="Teklif">
                    {group.applications.map((app) => (
                      <td
                        key={app.id}
                        className={`py-3 px-3 font-semibold ${
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
                    {group.applications.map((app) => (
                      <td key={app.id} className="py-3 px-3 text-slate-600">
                        {app.proposedDelivery || "—"}
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label="Güven">
                    {group.applications.map((app) => (
                      <td key={app.id} className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          <VerifiedBadge verified={app.verified} type="producer" />
                          {app.isPro && <Badge variant="brand">Pro</Badge>}
                          {!app.verified && !app.isPro && (
                            <span className="text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label="Durum">
                    {group.applications.map((app) => {
                      const status = statusLabels[app.status] || statusLabels.pending;
                      return (
                        <td key={app.id} className="py-3 px-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                      );
                    })}
                  </CompareRow>
                  <CompareRow label="Tarih">
                    {group.applications.map((app) => (
                      <td key={app.id} className="py-3 px-3 text-slate-500">
                        {formatDate(app.createdAt)}
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label="Ön yazı">
                    {group.applications.map((app) => (
                      <td key={app.id} className="py-3 px-3 text-slate-600 align-top">
                        <p className="line-clamp-3 max-w-[200px]">{app.coverLetter || "—"}</p>
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label="Mesaj">
                    {group.applications.map((app) => (
                      <td key={app.id} className="py-3 px-3">
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
            </CardContent>
          </Card>
        );
      })}
    </div>
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
      <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">
        {label}
      </td>
      {children}
    </tr>
  );
}
