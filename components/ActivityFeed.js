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
  card_linked: "✦",
  card_unlinked: "↻",
  user_joined: "★",
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

export default function ActivityFeed({ session }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [session]);

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
        <div style={{ fontSize: 28, marginBottom: 12 }}>📡</div>
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
      <div style={{
        fontSize: 9, fontFamily: MONO, letterSpacing: 3, color: C.textDim,
        padding: "8px 0 12px", textTransform: "uppercase",
      }}>
        Live Activity
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
            {EVENT_ICONS[item.event_type] || "✦"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontFamily: SANS, color: C.cream,
              lineHeight: 1.4,
            }}>
              {formatEvent(item)}
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
