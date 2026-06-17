import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import {
  addDemoMessage,
  createId,
  getDemoChatRoom,
  getDemoMessages,
  markDemoMessagesAsRead,
} from "@/lib/demo/store";

export async function GET(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const roomId = new URL(request.url).searchParams.get("roomId");
  if (!roomId) {
    return NextResponse.json({ error: "roomId gerekli." }, { status: 400 });
  }

  const room = getDemoChatRoom(roomId);
  if (!room) {
    return NextResponse.json({ error: "Oda bulunamadı." }, { status: 404 });
  }

  const messages = getDemoMessages(roomId);
  return NextResponse.json({ messages, room });
}

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const { roomId, content, type = "text", offer_amount } = body;

  const room = getDemoChatRoom(roomId);
  if (!room) {
    return NextResponse.json({ error: "Oda bulunamadı." }, { status: 404 });
  }

  const message = addDemoMessage({
    id: createId("msg"),
    room_id: roomId,
    sender_id: session.id,
    type,
    content: content || null,
    file_url: null,
    file_name: null,
    offer_amount: offer_amount ? Number(offer_amount) : null,
    is_read: false,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, message });
}

export async function PATCH(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const { roomId } = body as { roomId: string };

  if (!roomId) {
    return NextResponse.json({ error: "roomId gerekli." }, { status: 400 });
  }

  const room = getDemoChatRoom(roomId);
  if (!room) {
    return NextResponse.json({ error: "Oda bulunamadı." }, { status: 404 });
  }

  markDemoMessagesAsRead(roomId, session.id);
  return NextResponse.json({ ok: true });
}
