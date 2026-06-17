"use client";

import { useEffect, useRef } from "react";

type IncomingMessage =
  | { type: "PUSH_TOKEN"; token: string }
  | { type: string; [key: string]: unknown };

function isInReactNativeWebView() {
  const candidate = (window as unknown as { ReactNativeWebView?: { postMessage?: unknown } })
    .ReactNativeWebView?.postMessage;
  return typeof candidate === "function";
}

export function MobileBridge() {
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!isInReactNativeWebView()) return;

    async function requestTokenIfLoggedIn() {
      if (requestedRef.current) return;
      requestedRef.current = true;

      const sessionRes = await fetch("/api/auth/session", { cache: "no-store" }).catch(() => null);
      const sessionData = (await sessionRes?.json().catch(() => null)) as { user?: { id: string } } | null;
      if (!sessionData?.user?.id) return;

      const rnWebView = (window as unknown as { ReactNativeWebView?: { postMessage?: (msg: string) => void } })
        .ReactNativeWebView;
      rnWebView?.postMessage?.(JSON.stringify({ type: "REQUEST_PUSH_TOKEN" }));
    }

    void requestTokenIfLoggedIn();
  }, []);

  useEffect(() => {
    if (!isInReactNativeWebView()) return;

    async function onMessage(event: MessageEvent) {
      if (typeof event.data !== "string") return;
      let payload: IncomingMessage | null = null;
      try {
        payload = JSON.parse(event.data) as IncomingMessage;
      } catch {
        return;
      }

      if (payload?.type === "PUSH_TOKEN" && typeof payload.token === "string") {
        await fetch("/api/push/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: payload.token,
            platform:
              typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent)
                ? "ios"
                : "android",
          }),
        }).catch(() => null);
      }
    }

    window.addEventListener("message", onMessage);
    // Android WebView sometimes uses document events; keep only standard for now.
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}

