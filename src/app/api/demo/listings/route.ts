import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import { getDemoCategories } from "@/lib/demo/store";
import { processListingImageField } from "@/lib/demo/listing-image-storage";
import {
  addDemoListing,
  addDemoNotification,
  createId,
  getDemoListingForOwner,
  notifyMatchingProducersForListing,
  updateDemoListing,
} from "@/lib/demo/store";
import type { Listing } from "@/types";
import { isInlineImageData } from "@/lib/demo/listing-image-storage";

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.role !== "demand_owner") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const category = getDemoCategories().find((c) => c.id === body.category_id) ?? null;
  const listingId = createId("listing");

  let imageUrl: string | null = null;
  try {
    imageUrl = processListingImageField(
      listingId,
      typeof body.image_url === "string" ? body.image_url : null
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Görsel kaydedilemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const listing: Listing = {
    id: listingId,
    company_id: session.companyId!,
    category_id: (body.category_id as string) || null,
    title: body.title as string,
    description: body.description as string,
    technical_details: (body.technical_details as string) || null,
    image_url: imageUrl,
    budget_min: body.budget_min ? Number(body.budget_min) : null,
    budget_max: body.budget_max ? Number(body.budget_max) : null,
    delivery_time: (body.delivery_time as string) || null,
    city: (body.city as string) || null,
    application_deadline: (body.application_deadline as string) || null,
    status: (body.status as Listing["status"]) || "active",
    view_count: 0,
    created_at: new Date().toISOString(),
    category: category ?? undefined,
  };

  addDemoListing(listing);

  if (listing.status === "active") {
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
    notifyMatchingProducersForListing(listing);
  }

  return NextResponse.json({ ok: true, listing });
}

export async function PATCH(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.role !== "demand_owner" || !session.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const listingId = body.listingId as string;
  if (!listingId) {
    return NextResponse.json({ error: "listingId gerekli." }, { status: 400 });
  }

  const existing = getDemoListingForOwner(listingId, session.companyId);
  if (!existing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  if (existing.status === "cancelled") {
    return NextResponse.json({ error: "İptal edilmiş ilan güncellenemez." }, { status: 400 });
  }

  const newStatus = body.status as Listing["status"] | undefined;

  if (newStatus === "cancelled") {
    if (existing.status !== "active" && existing.status !== "draft") {
      return NextResponse.json({ error: "Bu ilan iptal edilemez." }, { status: 400 });
    }

    const listing = updateDemoListing(listingId, { status: "cancelled" });
    return NextResponse.json({ ok: true, listing });
  }

  if (existing.status === "closed") {
    return NextResponse.json({ error: "Kapanmış ilan düzenlenemez." }, { status: 400 });
  }

  const category = getDemoCategories().find((c) => c.id === body.category_id) ?? null;

  let imageUrl = existing.image_url ?? null;
  if (body.image_url !== undefined) {
    const rawImage = typeof body.image_url === "string" ? body.image_url : null;
    if (!rawImage) {
      imageUrl = null;
    } else if (isInlineImageData(rawImage)) {
      try {
        imageUrl = processListingImageField(listingId, rawImage);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Görsel kaydedilemedi.";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } else {
      imageUrl = rawImage;
    }
  }

  const becameActive =
    newStatus === "active" && existing.status !== "active";

  const listing = updateDemoListing(listingId, {
    title: (body.title as string) ?? existing.title,
    category_id: (body.category_id as string) || existing.category_id,
    description: (body.description as string) ?? existing.description,
    technical_details:
      body.technical_details !== undefined
        ? (body.technical_details as string) || null
        : existing.technical_details,
    image_url: imageUrl,
    budget_min: body.budget_min !== undefined && body.budget_min !== null && body.budget_min !== ""
      ? Number(body.budget_min)
      : body.budget_min === null || body.budget_min === ""
        ? null
        : existing.budget_min,
    budget_max: body.budget_max !== undefined && body.budget_max !== null && body.budget_max !== ""
      ? Number(body.budget_max)
      : body.budget_max === null || body.budget_max === ""
        ? null
        : existing.budget_max,
    delivery_time:
      body.delivery_time !== undefined
        ? (body.delivery_time as string) || null
        : existing.delivery_time,
    city: body.city !== undefined ? (body.city as string) || null : existing.city,
    application_deadline:
      body.application_deadline !== undefined
        ? (body.application_deadline as string) || null
        : existing.application_deadline,
    status: newStatus && ["draft", "active"].includes(newStatus) ? newStatus : existing.status,
    category: category ?? undefined,
  });

  if (listing && becameActive) {
    notifyMatchingProducersForListing(listing);
  }

  return NextResponse.json({ ok: true, listing });
}
