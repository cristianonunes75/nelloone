import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "nello_visitor_session";
const HEARTBEAT_INTERVAL = 60000; // 60 seconds
const VISIBILITY_DEBOUNCE = 5000; // 5 seconds debounce for visibility changes

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function useVisitorTracking() {
  const heartbeatRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    sessionIdRef.current = sessionId;

    const registerVisitor = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Upsert visitor record
        await supabase.from("site_visitors").upsert(
          {
            session_id: sessionId,
            page_path: window.location.pathname,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
            is_mobile: isMobileDevice(),
            user_id: user?.id || null,
            last_seen_at: new Date().toISOString(),
            is_active: true,
          },
          { onConflict: "session_id" }
        );
      } catch (error) {
        // Silently fail - tracking shouldn't break the app
        console.debug("Visitor tracking error:", error);
      }
    };

    const sendHeartbeat = async () => {
      try {
        await supabase
          .from("site_visitors")
          .update({
            page_path: window.location.pathname,
            last_seen_at: new Date().toISOString(),
            is_active: true,
          })
          .eq("session_id", sessionIdRef.current);
      } catch (error) {
        console.debug("Heartbeat error:", error);
      }
    };

    const markInactive = async () => {
      try {
        await supabase
          .from("site_visitors")
          .update({ is_active: false })
          .eq("session_id", sessionIdRef.current);
      } catch (error) {
        console.debug("Mark inactive error:", error);
      }
    };

    // Initial registration
    registerVisitor();

    // Start heartbeat
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // Handle visibility change with debounce
    let visibilityTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleVisibilityChange = () => {
      if (visibilityTimeout) clearTimeout(visibilityTimeout);
      visibilityTimeout = setTimeout(() => {
        if (document.hidden) {
          markInactive();
        } else {
          sendHeartbeat();
        }
      }, VISIBILITY_DEBOUNCE);
    };

    // Handle page unload
    const handleUnload = () => {
      markInactive();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      if (visibilityTimeout) clearTimeout(visibilityTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
      markInactive();
    };
  }, []);
}
