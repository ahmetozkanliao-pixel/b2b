interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

export function StaticPage({ title, children }: StaticPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <div className="prose prose-gray mt-8 max-w-none">{children}</div>
    </div>
  );
}
