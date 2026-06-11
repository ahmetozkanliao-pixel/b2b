import { getSession } from "@/lib/auth/get-session";
import { getDemoCatalogs } from "@/lib/demo/store";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function CatalogPage() {
  const session = await getSession();
  if (!session) return null;

  const catalogs = session.isDemo && session.companyId
    ? getDemoCatalogs(session.companyId)
    : [];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Katalog</h1>
          <p className="mt-1 text-gray-500">Ürün kataloglarınızı ve sertifikalarınızı yönetin</p>
        </div>
        <Button variant="outline" disabled>
          <Upload className="h-4 w-4" />
          Yükle (yakında)
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {catalogs.length > 0 ? (
          catalogs.map((item) => (
            <Card key={item.id} hover>
              <CardContent className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {item.file_name} &middot; {formatDate(item.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Henüz katalog yüklenmemiş.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
