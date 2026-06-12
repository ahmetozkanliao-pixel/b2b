import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { getDemoChatPreview, getDemoChatUnreadCount } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await getSession();
  if (!session?.companyId || session.role === "admin") {
    return NextResponse.json({ rooms: [], totalUnread: 0 });
  }

  if (session.isDemo) {
    const role = session.role as "demand_owner" | "producer";
    const rooms = getDemoChatPreview(session.companyId, session.id, role);
    const totalUnread = getDemoChatUnreadCount(session.companyId, session.id, role);
    return NextResponse.json({ rooms, totalUnread });
  }

  const supabase = await createClient();
  const partnerField =
    session.role === "producer" ? "demand_company:companies!chat_rooms_demand_company_id_fkey(name)" : "producer_company:companies!chat_rooms_producer_company_id_fkey(name)";

  const filterField =
    session.role === "producer" ? "producer_company_id" : "demand_company_id";

  const { data: chatRooms } = await supabase
    .from("chat_rooms")
    .select(`id, created_at, listing:listings(title), ${partnerField}`)
    .eq(filterField, session.companyId)
    .order("created_at", { ascending: false })
    .limit(3);

  const rooms = await Promise.all(
    (chatRooms || []).map(async (room) => {
      const typed = room as unknown as {
        id: string;
        created_at: string;
        listing?: { title: string } | { title: string }[];
        demand_company?: { name: string } | { name: string }[];
        producer_company?: { name: string } | { name: string }[];
      };

      const listing = Array.isArray(typed.listing) ? typed.listing[0] : typed.listing;
      const demandCompany = Array.isArray(typed.demand_company)
        ? typed.demand_company[0]
        : typed.demand_company;
      const producerCompany = Array.isArray(typed.producer_company)
        ? typed.producer_company[0]
        : typed.producer_company;

      const { data: messages } = await supabase
        .from("messages")
        .select("content, type, file_name, created_at, is_read, sender_id")
        .eq("room_id", typed.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const last = messages?.[0];
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("room_id", typed.id)
        .eq("is_read", false)
        .neq("sender_id", session.id);

      let lastMessage = last?.content ?? null;
      if (!lastMessage && last?.type === "offer") lastMessage = "Teklif gönderildi";
      if (!lastMessage && last?.type === "file") lastMessage = last.file_name || "Dosya gönderildi";

      return {
        id: typed.id,
        partnerName: demandCompany?.name || producerCompany?.name || "Firma",
        listingTitle: listing?.title || "İlan",
        lastMessage,
        lastMessageAt: last?.created_at ?? typed.created_at,
        unread: count ?? 0,
      };
    })
  );

  const totalUnread = rooms.reduce((sum, r) => sum + r.unread, 0);
  return NextResponse.json({ rooms, totalUnread });
}
