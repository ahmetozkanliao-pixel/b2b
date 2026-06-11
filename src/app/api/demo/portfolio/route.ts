import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import {
  addDemoPortfolioItem,
  createId,
  deleteDemoPortfolioItem,
  getDemoPortfolio,
  updateDemoPortfolioItem,
} from "@/lib/demo/store";

export async function GET() {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const items = getDemoPortfolio(session.companyId);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const item = addDemoPortfolioItem({
    id: createId("port"),
    company_id: session.companyId,
    title: body.title,
    description: body.description || null,
    image_url: body.image_url || null,
    year: body.year ? Number(body.year) : null,
    client_name: body.client_name || null,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ item });
}

export async function PATCH(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  }

  const item = updateDemoPortfolioItem(body.id, session.companyId, {
    title: body.title,
    description: body.description,
    image_url: body.image_url,
    year: body.year !== undefined ? Number(body.year) : undefined,
    client_name: body.client_name,
  });

  if (!item) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  }

  const ok = deleteDemoPortfolioItem(id, session.companyId);
  if (!ok) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
