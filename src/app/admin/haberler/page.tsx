import { getSession } from "@/lib/auth/get-session";
import { getAllDemoNews } from "@/lib/demo/store";
import { NewsForm } from "@/components/admin/news-form";

export default async function AdminNewsPage() {
  const session = await getSession();
  const articles = session?.isDemo ? getAllDemoNews() : [];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Haber Yönetimi</h1>
      <p className="mt-1 text-slate-500">
        Haberleri yayınlayın; ana sayfa ve haberler bölümünde görünsün
      </p>
      <div className="mt-6">
        <NewsForm articles={articles} isDemo={session?.isDemo} />
      </div>
    </div>
  );
}
