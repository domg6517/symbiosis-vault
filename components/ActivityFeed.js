"use client";
import { useState, useEffect } from "react";
import { C, SANS, SERIF, MONO, skeuo } from "./design";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h ago";
  const days = Math.floor(hours / 24);
  return days + "d ago";
}

const EVENT_ICONS = {
  card_linked: "â¦",
  card_unlinked: "â»",
  user_joined: "â",
};

const EVENT_COLORS = {
  card_linked: C.teal,
  card_unlinked: C.textDim,
  user_joined: C.accent,
};

function formatEvent(item) {
  const name = item.display_name || "A collector";
  switch (item.event_type) {
    case "card_linked":
      return name + " scanned a " + (item.card_rarity || "") + " card";
    case "card_unlinked":
      return name + " released a card for trade";
    case "user_joined":
      return name + " joined the Vault";
    default:
      return name + " did something";
  }
}

function formatEventAction(item) {
  switch (item.event_type) {
    case "card_linked":
      return "scanned a " + (item.card_rarity || "") + " card";
    case "card_unlinked":
      return "released a card for trade";
    case "user_joined":
      return "joined the Vault";
    default:
      return "did something";
  }
}


export default function ActivityFeed({ session, onViewCollector }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 10000);
    return () => clearInterval(interval);
  }, [session]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchActivity();
    setRefreshing(false);
  }

  async function fetchActivity() {
    try {
      const headers = {};
      if (session?.access_token) {
        headers.Authorization = "Bearer " + session.access_token;
      }
      const res = await fetch("/api/activity", { headers });
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (e) {
      console.error("Activity fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontFamily: MONO, color: C.textDim, letterSpacing: 2 }}>
          LOADING FEED...
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>ð¡</div>
        <div style={{ fontSize: 14, fontFamily: SANS, color: C.textSec, marginBottom: 6 }}>
          No activity yet
        </div>
        <div style={{ fontSize: 12, fontFamily: SANS, color: C.textDim, lineHeight: 1.5 }}>
          Scan a card to be the first on the feed
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 12px" }}>
        <div style={{ fontSize: 9, fontFamily: MONO, letterSpacing: 3, color: C.textDim, textTransform: "uppercase" }}>
          Live Activity
        </div>
        <div onClick={handleRefresh} style={{
          fontSize: 9, fontFamily: MONO, letterSpacing: 1,
          color: refreshing ? C.textDim : C.accent, cursor: "pointer",
          padding: "4px 10px", borderRadius: 6,
          border: "1px solid " + (refreshing ? "rgba(255,255,255,0.06)" : C.accent + "44"),
          transition: "all 0.2s ease", opacity: refreshing ? 0.5 : 1,
        }}>
          {refreshing ? "REFRESHING..." : "REFRESH \u21BB"}
        </div>
      </div>
      {events.map((item, i) => (
        <div key={item.id || i} style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "12px 0",
          borderBottom: i < events.length - 1 ? "1px solid " + C.border : "none",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            ...skeuo.inset,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0,
            color: EVENT_COLORS[item.event_type] || C.textDim,
          }}>
            {EVENT_ICONS[item.event_type] || "â¦"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontFamily: SANS, color: C.cream,
              lineHeight: 1.4,
            }}>
              <span onClick={() => onViewCollector && onViewCollector({ user_id: item.user_id, display_name: item.display_name })} style={{ color: C.accent, cursor: "pointer", fontWeight: 600 }}>{item.display_name || "A collector"}</span>{" "}{formatEventAction(item)}
            </div>
            {item.card_perspective && (
              <div style={{
                fontSize: 10, fontFamily: MONO, color: C.accent,
                letterSpacing: 0.5, marginTop: 3,
              }}>
                {item.card_perspective}
              </div>
            )}
          </div>
          <div style={{
            fontSize: 10, fontFamily: MONO, color: C.textDim,
            flexShrink: 0, letterSpacing: 0.3,
          }}>
            {timeAgo(item.created_at)}
          </div>
        </div>
      ))}
    </div>
  );
}
