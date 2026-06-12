import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminSettingsPage() {
  const session = await getSession();
  const demo = isDemoMode();

  const settings = [
    { label: "Platform Adı", value: "B2B Üretim & Tedarik" },
    { label: "Çalışma Modu", value: demo ? "Demo (yerel veri)" : "Canlı (Supabase)" },
    { label: "Varsayılan Dil", value: "Türkçe" },
    { label: "E-posta Bildirimleri", value: "Aktif" },
    { label: "Firma Onay Süreci", value: "Manuel (admin onayı)" },
    { label: "Üretici Başvuru Limiti", value: "Basic: 10/ay · Pro: sınırsız" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
      <p className="mt-1 text-gray-500">Platform genel yapılandırması</p>

      {demo && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Demo modunda ayarlar salt okunurdur. Canlı ortamda Supabase üzerinden yönetilir.
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Genel Bilgiler</h2>
            <Badge variant={demo ? "warning" : "success"}>{demo ? "Demo" : "Canlı"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100">
          {settings.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Oturum</h2>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <p>
            <span className="text-gray-500">Giriş yapan:</span>{" "}
            <strong>{session?.full_name}</strong> ({session?.email})
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
