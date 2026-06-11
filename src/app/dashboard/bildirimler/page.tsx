import { getSession } from "@/lib/auth/get-session";
import { getDemoNotifications } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationActions } from "@/components/dashboard/notification-actions";
import { formatRelativeDate } from "@/lib/utils";
import { Bell } from "lucide-react";
import Link from "next/link";

export default async function NotificationsPage() {
  const session = await getSession();

  let notifications: import("@/types").Notification[] = [];

  if (session?.isDemo) {
    notifications = getDemoNotifications(session.id);
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(50);
    notifications = data || [];
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
          <p className="mt-1 text-gray-500">
            {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : "Tüm bildirimleriniz"}
          </p>
        </div>
        {session?.isDemo && unreadCount > 0 && <NotificationActions />}
      </div>

      <div className="mt-6 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card key={notif.id} className={notif.is_read ? "opacity-70" : ""}>
              <CardContent className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <Bell className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    {!notif.is_read && <Badge variant="info">Yeni</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-xs text-gray-400">
                      {formatRelativeDate(notif.created_at)}
                    </p>
                    {notif.link && (
                      <Link href={notif.link} className="text-xs font-medium text-primary-600 hover:text-primary-700">
                        Görüntüle →
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Henüz bildiriminiz bulunmuyor.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
