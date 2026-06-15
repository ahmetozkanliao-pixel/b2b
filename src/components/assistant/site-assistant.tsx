"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

function renderMessageContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split("\n").map((line, lineIndex, lines) => (
      <span key={`${index}-${lineIndex}`}>
        {line}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    ));
  });
}

export function SiteAssistant() {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geminiEnabled, setGeminiEnabled] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPanel =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  const isAuthPage =
    pathname === "/giris" ||
    pathname === "/kayit" ||
    pathname === "/sifremi-unuttum" ||
    pathname === "/sifre-yenile";

  useEffect(() => {
    fetch("/api/assistant")
      .then((res) => res.json())
      .then((data) => setGeminiEnabled(Boolean(data.geminiEnabled)))
      .catch(() => setGeminiEnabled(false));
  }, []);

  useEffect(() => {
    if (!open || initialized) return;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: t("assistant.welcome"),
      },
    ]);
    setInitialized(true);
  }, [open, initialized, t]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const history = messages
      .filter((message) => message.id !== "welcome")
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          locale,
          history,
        }),
      });

      const data = await res.json();
      const replyContent =
        res.ok && data.reply
          ? data.reply
          : t("assistant.error");

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: replyContent,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: t("assistant.error"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  return (
    <div
      className={cn(
        "fixed z-[45] flex flex-col items-end gap-3",
        isPanel
          ? "bottom-[calc(3.5rem+1rem+env(safe-area-inset-bottom))] right-4 sm:bottom-[calc(4.75rem+1rem+env(safe-area-inset-bottom))]"
          : "bottom-4 right-4 sm:bottom-6 sm:right-6"
      )}
    >
      {open && (
        <div className="flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 sm:w-[24rem]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-brand-50/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-white shadow-soft">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t("assistant.title")}</p>
                <p className="text-xs text-slate-500">
                  {geminiEnabled ? t("assistant.subtitleGemini") : t("assistant.subtitle")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              aria-label={t("assistant.close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="max-h-[min(50vh,20rem)] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "rounded-br-md bg-brand-600 text-white"
                      : "rounded-bl-md border border-slate-100 bg-slate-50 text-slate-700"
                  )}
                >
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("assistant.thinking")}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-3 py-2">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("assistant.placeholder")}
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-brand text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-40"
                aria-label={t("assistant.send")}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>

            <p className="pt-2 text-center text-[10px] text-slate-400">
              {t("assistant.disclaimer")}{" "}
              <Link href="/sss" className="underline hover:text-slate-600">
                {t("nav.faq")}
              </Link>
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center shadow-lg transition-all duration-200",
          open
            ? "h-14 w-14 justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700"
            : isAuthPage
              ? "h-14 w-14 justify-center rounded-full gradient-brand text-white shadow-soft hover:opacity-90"
              : "gap-2 rounded-full border border-white/80 bg-white pl-4 pr-1.5 py-1.5 text-slate-800 hover:shadow-xl"
        )}
        aria-label={open ? t("assistant.close") : t("assistant.open")}
        aria-expanded={open}
      >
        {!open && !isAuthPage && (
          <span className="max-w-[9.5rem] text-left text-sm font-semibold leading-tight text-slate-800 sm:max-w-none sm:whitespace-nowrap">
            {t("assistant.fabLabel")}
          </span>
        )}
        <span
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white",
            open ? "bg-transparent" : "gradient-brand shadow-soft"
          )}
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-5 w-5" />}
        </span>
      </button>
    </div>
  );
}
