"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const HEARTBEAT_MS = 5000;
const TAB_KEY = "jemscreations:open-tabs";
const LOGOUT_KEY = "jemscreations:pending-logout";

type OpenTab = Record<string, number>;

function readTabs(): OpenTab {
  try {
    const now = Date.now();
    const tabs = JSON.parse(localStorage.getItem(TAB_KEY) ?? "{}") as OpenTab;
    return Object.fromEntries(Object.entries(tabs).filter(([, lastSeen]) => now - lastSeen < HEARTBEAT_MS * 3));
  } catch { return {}; }
}

function writeTabs(tabs: OpenTab) { localStorage.setItem(TAB_KEY, JSON.stringify(tabs)); }

export function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const tabId = crypto.randomUUID();
    let idleTimer: ReturnType<typeof setTimeout>;
    const supabase = createClient();

    const touchTab = () => {
      const tabs = readTabs();
      tabs[tabId] = Date.now();
      writeTabs(tabs);
      localStorage.removeItem(LOGOUT_KEY);
    };

    const signOut = async () => {
      localStorage.setItem(LOGOUT_KEY, String(Date.now()));
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.auth.signOut();
      router.replace("/login?reason=expired");
    };

    const resetIdleTimer = () => {
      touchTab();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => void signOut(), IDLE_TIMEOUT_MS);
    };

    const removeTab = () => {
      const tabs = readTabs();
      delete tabs[tabId];
      writeTabs(tabs);
      if (Object.keys(tabs).length === 0) {
        window.setTimeout(() => {
          if (Object.keys(readTabs()).length === 0) void signOut();
        }, 2000);
      }
    };

    const activityEvents = ["pointerdown", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) => window.addEventListener(event, resetIdleTimer, { passive: true }));
    const heartbeat = window.setInterval(touchTab, HEARTBEAT_MS);
    window.addEventListener("pagehide", removeTab);
    window.addEventListener("beforeunload", removeTab);
    touchTab();
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.clearInterval(heartbeat);
      activityEvents.forEach((event) => window.removeEventListener(event, resetIdleTimer));
      window.removeEventListener("pagehide", removeTab);
      window.removeEventListener("beforeunload", removeTab);
      removeTab();
    };
  }, [router]);

  return null;
}
