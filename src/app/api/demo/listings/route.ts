import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode, DEMO_CATEGORIES } from "@/lib/demo/config";
import { addDemoListing, addDemoNotification, createId } from "@/lib/demo/store";
import type { Listing } from "@/types";

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.role !== "demand_owner") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const category = DEMO_CATEGORIES.find((c) => c.id === body.category_id) ?? null;

  const listing: Listing = {
    id: createId("listing"),
    company_id: session.companyId!,
    category_id: body.category_id || null,
    title: body.title,
    description: body.description,
    technical_details: body.technical_details || null,
    budget_min: body.budget_min ? Number(body.budget_min) : null,
    budget_max: body.budget_max ? Number(body.budget_max) : null,
    delivery_time: body.delivery_time || null,
    city: body.city || null,
    application_deadline: body.application_deadline || null,
    status: body.status || "active",
    view_count: 0,
    created_at: new Date().toISOString(),
    category: category ?? undefined,
  };

  addDemoListing(listing);

  if (body.status === "active") {
    addDemoNotification({
      id: createId("notif"),
      user_id: session.id,
      type: "new_listing",
      title: "İlan Yayınlandı",
      message: `"${listing.title}" ilanınız yayına alındı.`,
      link: "/dashboard/ilanlar",
      is_read: false,
      created_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true, listing });
}
