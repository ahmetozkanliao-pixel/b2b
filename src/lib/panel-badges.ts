import type { AppSession } from "@/lib/auth/get-session";
import { getDemoChatUnreadCount, getDemoNotifications } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";

export interface PanelBadges {
  messages: number;
  notifications: number;
}

const EMPTY_BADGES: PanelBadges = { messages: 0, notifications: 0 };

export async function getPanelBadges(session: AppSession): Promise<PanelBadges> {
  if (session.role === "admin") {
    return EMPTY_BADGES;
  }

  if (session.isDemo) {
    const role = session.role as "demand_owner" | "producer";
    const messages =
      session.companyId != null
        ? getDemoChatUnreadCount(session.companyId, session.id, role)
        : 0;
    const notifications = getDemoNotifications(session.id).filter((n) => !n.is_read).length;
    return { messages, notifications };
  }

  const supabase = await createClient();

  const { count: notificationCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.id)
    .eq("is_read", false);

  let messages = 0;

  if (session.companyId) {
    const filterField =
      session.role === "producer" ? "producer_company_id" : "demand_company_id";

    const { data: chatRooms } = await supabase
      .from("chat_rooms")
      .select("id")
      .eq(filterField, session.companyId);

    const roomIds = (chatRooms ?? []).map((room) => room.id);

    if (roomIds.length > 0) {
      const { count: messageCount } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .in("room_id", roomIds)
        .eq("is_read", false)
        .neq("sender_id", session.id);

      messages = messageCount ?? 0;
    }
  }

  return {
    messages,
    notifications: notificationCount ?? 0,
  };
}
