import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { getDemoChatRoom, getDemoMessages } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import { ChatRoom } from "@/components/chat/chat-room";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const session = await getSession();
  if (!session) return null;

  let listingTitle = "Mesaj Odası";
  let messages: import("@/types").Message[] = [];
  let isDemo = session.isDemo;

  if (session.isDemo) {
    const room = getDemoChatRoom(roomId);
    if (!room) notFound();
    listingTitle = room.listing_title;
    messages = getDemoMessages(roomId);
  } else {
    const supabase = await createClient();
    const { data: room } = await supabase
      .from("chat_rooms")
      .select("*, listing:listings(title)")
      .eq("id", roomId)
      .single();

    if (!room) notFound();

    listingTitle = (room as { listing?: { title: string } }).listing?.title || listingTitle;

    const { data } = await supabase
      .from("messages")
      .select("*, sender:profiles(full_name)")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    messages = data || [];
    isDemo = false;
  }

  return (
    <div>
      <Link
        href="/dashboard/mesajlar"
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Mesajlara Dön
      </Link>
      <h1 className="mb-4 text-xl font-bold text-gray-900">{listingTitle}</h1>
      <ChatRoom
        roomId={roomId}
        currentUserId={session.id}
        initialMessages={messages}
        isDemo={isDemo}
      />
    </div>
  );
}
