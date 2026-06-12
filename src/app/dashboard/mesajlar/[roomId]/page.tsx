import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import {
  getDemoApplicationById,
  getDemoChatRoom,
  getDemoMessages,
} from "@/lib/demo/store";
import { ChatRoom } from "@/components/chat/chat-room";
import { DealActions } from "@/components/applications/deal-actions";
import type { ApplicationStatus } from "@/types";
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
  let applicationId = "";
  let applicationStatus: ApplicationStatus = "approved";
  let listingId = "";
  let applicantUserId = "";

  if (session.isDemo) {
    const room = getDemoChatRoom(roomId);
    if (!room) notFound();
    listingTitle = room.listing_title;
    listingId = room.listing_id;
    applicationId = room.application_id;
    messages = getDemoMessages(roomId);

    const application = getDemoApplicationById(room.application_id);
    if (application) {
      applicationStatus = application.status;
      applicantUserId = application.applicant_id;
    }
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: room } = await supabase
      .from("chat_rooms")
      .select("*, listing:listings(title, id), application:applications(id, status, applicant_id)")
      .eq("id", roomId)
      .single();

    if (!room) notFound();

    const typedRoom = room as {
      listing?: { title: string; id: string };
      application?: { id: string; status: ApplicationStatus; applicant_id: string };
      application_id?: string;
      listing_id?: string;
    };

    listingTitle = typedRoom.listing?.title || listingTitle;
    listingId = typedRoom.listing?.id || typedRoom.listing_id || "";
    applicationId = typedRoom.application?.id || typedRoom.application_id || "";
    applicationStatus = typedRoom.application?.status || "approved";
    applicantUserId = typedRoom.application?.applicant_id || "";

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
      {applicationId && (
        <div className="mb-4">
          <DealActions
            applicationId={applicationId}
            applicationStatus={applicationStatus}
            listingId={listingId}
            applicantUserId={applicantUserId}
            isDemandOwner={session.role === "demand_owner"}
            isDemo={isDemo}
          />
        </div>
      )}
      <ChatRoom
        roomId={roomId}
        currentUserId={session.id}
        initialMessages={messages}
        isDemo={isDemo}
      />
    </div>
  );
}
