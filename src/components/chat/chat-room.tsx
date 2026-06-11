"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeDate, formatCurrency } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatRoomProps {
  roomId: string;
  currentUserId: string;
  initialMessages: Message[];
  isDemo?: boolean;
}

export function ChatRoom({ roomId, currentUserId, initialMessages, isDemo = false }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (isDemo) return;

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase, isDemo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!newMessage.trim()) return;
    setSending(true);

    if (isDemo) {
      const res = await fetch("/api/demo/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, content: newMessage.trim(), type: "text" }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      setNewMessage("");
      setSending(false);
      return;
    }

    await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: currentUserId,
      type: "text",
      content: newMessage.trim(),
    });

    setNewMessage("");
    setSending(false);
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-xl border border-gray-200 bg-white">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isOwn
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.type === "offer" && msg.offer_amount && (
                  <div className="mb-1 rounded-lg bg-white/20 px-3 py-2 text-sm font-semibold">
                    Teklif: {formatCurrency(msg.offer_amount)}
                  </div>
                )}
                {msg.type === "file" || msg.type === "pdf" || msg.type === "image" ? (
                  <a
                    href={msg.file_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 underline"
                  >
                    <FileText className="h-4 w-4" />
                    {msg.file_name || "Dosya"}
                  </a>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <p
                  className={`mt-1 text-xs ${
                    isOwn ? "text-primary-200" : "text-gray-400"
                  }`}
                >
                  {formatRelativeDate(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Dosya ekle (yakında)"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Mesajınızı yazın..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <Button size="sm" onClick={sendMessage} disabled={sending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
