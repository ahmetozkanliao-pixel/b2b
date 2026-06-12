import { getSession } from "@/lib/auth/get-session";
import { getAdminCategories } from "@/lib/get-categories";
import { CategoryAdmin } from "@/components/admin/category-admin";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Kategori Yönetimi</h1>
      <p className="mt-1 text-slate-500">
        İlan ve firma eşleşmesinde kullanılan ana ve alt kategorileri yönetin
      </p>
      <div className="mt-6">
        <CategoryAdmin categories={categories} isDemo={session?.isDemo} />
      </div>
    </div>
  );
}
