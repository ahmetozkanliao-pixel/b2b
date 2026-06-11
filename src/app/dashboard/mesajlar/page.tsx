import Link from "next/link";
import { getSession } from "@/lib/auth/get-session";
import { getDemoChatRooms } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

export default async function MessagesPage() {
  const session = await getSession();

  let rooms: Array<{
    id: string;
    created_at: string;
    listing_title?: string;
    producer_name?: string;
    listing?: { title: string };
    producer_company?: { name: string };
    demand_company?: { name: string };
  }> = [];

  if (session?.isDemo && session.companyId) {
    rooms = getDemoChatRooms(session.companyId, session.role as "demand_owner" | "producer");
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: company } = await supabase
      .from("companies")
      .select("id, type")
      .eq("owner_id", user!.id)
      .single();

    if (company?.type === "producer") {
      const { data } = await supabase
        .from("chat_rooms")
        .select("*, listing:listings(title), demand_company:companies!chat_rooms_demand_company_id_fkey(name)")
        .eq("producer_company_id", company.id)
        .order("created_at", { ascending: false });
      rooms = data || [];
    } else {
      const { data } = await supabase
        .from("chat_rooms")
        .select("*, listing:listings(title), producer_company:companies!chat_rooms_producer_company_id_fkey(name)")
        .eq("demand_company_id", company?.id || "")
        .order("created_at", { ascending: false });
      rooms = data || [];
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
      <p className="mt-1 text-gray-500">Onaylanan başvurularınızın mesaj odaları</p>

      <div className="mt-6 space-y-3">
        {rooms.length > 0 ? (
          rooms.map((room) => {
            const partnerName =
              session?.role === "producer"
                ? (room as { demand_company_name?: string; demand_company?: { name: string } }).demand_company_name
                  || (room as { demand_company?: { name: string } }).demand_company?.name
                : room.producer_name || (room as { producer_company?: { name: string } }).producer_company?.name;
            const listingTitle = room.listing_title || room.listing?.title;

            return (
              <Link key={room.id} href={`/dashboard/mesajlar/${room.id}`}>
                <Card hover>
                  <CardContent className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                      <MessageCircle className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {partnerName || "Firma"}
                      </h3>
                      <p className="text-sm text-gray-500">{listingTitle}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatRelativeDate(room.created_at)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })
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
