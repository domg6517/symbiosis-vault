"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { useAuth } from "./AuthContext";

export default function LeaderboardScreen({ onBack, onViewCollector }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    fetch("/api/leaderboard", { headers: session?.access_token ? { Authorization: "Bearer " + session.access_token } : {} })
      .then((r) => r.json())
      .then((d) => {
        setLeaders(d.leaderboard || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const medal = (rank) =>
    rank === 1 ? "\u{1F947}" : rank === 2 ? "\u{1F948}" : rank === 3 ? "\u{1F949}" : rank;

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, color: C.text, padding: "0 0 100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "18px 16px 10px", gap: 12 }}>
        <div
          onClick={onBack}
          style={{
            ...skeuo, width: 36, height: 36, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 18,
          }}
        >←</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Leaderboard</div>
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: 3,
        color: C.textDim, textAlign: "center", padding: "4px 0 16px",
      }}>TOP COLLECTORS</div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, fontFamily: SANS, color: C.textDim }}>
          Loading...
        </div>
      ) : leaders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, fontFamily: SANS, color: C.textDim }}>
          No collectors yet. Be the first to scan a card!
        </div>
      ) : (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {leaders.map((entry) => (
            <div
              key={entry.user_id}
              onClick={() => onViewCollector && onViewCollector(entry)}
              style={{
                ...skeuo, borderRadius: 14, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 14,
                border: entry.rank <= 3 ? "1px solid " + C.accent : undefined,
                cursor: "pointer",
              }}
            >
              {/* Rank */}
              <div style={{
                fontFamily: SERIF, fontSize: entry.rank <= 3 ? 28 : 18,
                fontWeight: 700, minWidth: 38, textAlign: "center",
              }}>{medal(entry.rank)}</div>

              {/* PFP */}
              <div style={{
                width: 38, height: 38, borderRadius: "50%", ...skeuo,
                overflow: "hidden", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, fontFamily: SERIF,
                border: "1px solid " + C.accent, flexShrink: 0,
              }}>
                {entry.pfp_url ? (
                  <img src={entry.pfp_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                ) : (
                  (entry.display || "C").charAt(0).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600 }}>
                  {entry.display}
                </div>
                <div style={{
                  fontFamily: MONO, fontSize: 11, color: C.textDim,
                  marginTop: 3, letterSpacing: 1,
                }}>
                  {entry.points || entry.totalCards} PTS · {entry.totalCards} CARD{entry.totalCards !== 1 ? "S" : ""}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ fontSize: 16, color: C.textDim }}>›</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
