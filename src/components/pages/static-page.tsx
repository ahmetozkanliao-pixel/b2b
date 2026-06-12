interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

export function StaticPage({ title, children }: StaticPageProps) {
  return (
    <div className="public-content relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        <div className="prose-dark mt-8 max-w-none space-y-4">{children}</div>
      </div>
    </div>
  );
}
