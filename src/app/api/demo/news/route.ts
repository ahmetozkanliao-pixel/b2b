import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import { addDemoNews, createId, deleteDemoNews, getAllDemoNews } from "@/lib/demo/store";
import { slugify } from "@/lib/utils";

export async function GET() {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  return NextResponse.json({ articles: getAllDemoNews() });
}

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Sadece admin haber yayınlayabilir." }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "Başlık ve içerik zorunludur." }, { status: 400 });
  }

  const slug = body.slug?.trim() || slugify(body.title);
  const now = new Date().toISOString();

  const article = addDemoNews({
    id: createId("news"),
    title: body.title.trim(),
    slug,
    summary: body.summary?.trim() || null,
    content: body.content.trim(),
    cover_image: body.cover_image?.trim() || null,
    published_at: body.publish !== false ? now : null,
    created_at: now,
    is_published: body.publish !== false,
    author_name: session.full_name || "Admin",
  });

  return NextResponse.json({ article });
}

export async function DELETE(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  }

  const ok = deleteDemoNews(id);
  if (!ok) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
