import Link from "next/link";
import { getSession } from "@/lib/auth/get-session";
import { getDemoChatPreview, getDemoChatUnreadCount } from "@/lib/demo/store";
import type { DemoChatPreview } from "@/lib/demo/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { cn, formatRelativeDate } from "@/lib/utils";

export default async function MessagesPage() {
  const session = await getSession();

  let rooms: DemoChatPreview[] = [];
  let totalUnread = 0;

  if (session?.isDemo && session.companyId) {
    const role = session.role as "demand_owner" | "producer";
    rooms = getDemoChatPreview(session.companyId, session.id, role, 999);
    totalUnread = getDemoChatUnreadCount(session.companyId, session.id, role);
  } else if (session?.companyId && session.role !== "admin") {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const filterField =
      session.role === "producer" ? "producer_company_id" : "demand_company_id";
    const partnerField =
      session.role === "producer"
        ? "demand_company:companies!chat_rooms_demand_company_id_fkey(name)"
        : "producer_company:companies!chat_rooms_producer_company_id_fkey(name)";

    const { data: chatRooms } = await supabase
      .from("chat_rooms")
      .select(`id, created_at, listing:listings(title), ${partnerField}`)
      .eq(filterField, session.companyId)
      .order("created_at", { ascending: false });

    rooms = await Promise.all(
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
          .select("created_at, is_read, sender_id")
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

        return {
          id: typed.id,
          partnerName: demandCompany?.name || producerCompany?.name || "Firma",
          listingTitle: listing?.title || "İlan",
          lastMessage: null,
          lastMessageAt: last?.created_at ?? typed.created_at,
          unread: count ?? 0,
        };
      })
    );

    rooms.sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
    totalUnread = rooms.reduce((sum, r) => sum + r.unread, 0);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
      <p className="mt-1 text-gray-500">
        {totalUnread > 0
          ? `${totalUnread} okunmamış mesaj`
          : "Onaylanan başvurularınızın mesaj odaları"}
      </p>

      <div className="mt-6 space-y-3">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Link key={room.id} href={`/dashboard/mesajlar/${room.id}`}>
              <Card
                hover
                className={cn(room.unread > 0 && "border-primary-200 bg-primary-50/40")}
              >
                <CardContent className="flex items-center gap-4">
                  <div
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full",
                      room.unread > 0 ? "bg-primary-200" : "bg-primary-100"
                    )}
                  >
                    <MessageCircle
                      className={cn(
                        "h-5 w-5",
                        room.unread > 0 ? "text-primary-700" : "text-primary-600"
                      )}
                    />
                    {room.unread > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                        {room.unread}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={cn(
                          "font-semibold text-gray-900",
                          room.unread > 0 && "text-primary-900"
                        )}
                      >
                        {room.partnerName}
                      </h3>
                      {room.unread > 0 && <Badge variant="info">Yeni</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">{room.listingTitle}</p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {formatRelativeDate(room.lastMessageAt)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Henüz aktif mesaj odanız bulunmuyor. Başvurular onaylandığında mesajlaşma başlar.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
