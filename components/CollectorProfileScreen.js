"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { useAuth } from "./AuthContext";
import { MiniPhotoCard } from "./SharedComponents";

function sanitizeHandle(val) {
  if (!val) return "";
  return val.replace(/^@/, "").replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 30);
}

export default function CollectorProfileScreen({ collector, onBack }) {
  const { session } = useAuth();
  if (!collector) return null;

  const [profileData, setProfileData] = useState(null);
  const [fetchedStats, setFetchedStats] = useState(null);
  const [collectorCards, setCollectorCards] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    if (!collector.user_id) return;
    const headers = session?.access_token ? { Authorization: "Bearer " + session.access_token } : {};
    const needsStats = collector.totalCards === undefined;

    async function fetchAll() {
      try {
        const [profileRes, cardsRes, statsRes] = await Promise.all([
          fetch("/api/users/profile?userId=" + collector.user_id, { headers }),
          fetch("/api/users/cards?userId=" + collector.user_id, { headers }),
          needsStats
            ? fetch("/api/users/stats?userId=" + collector.user_id, { headers })
            : Promise.resolve(null),
        ]);
        if (profileRes.ok) setProfileData(await profileRes.json());
        if (cardsRes.ok) {
          const d = await cardsRes.json();
          setCollectorCards(d.cards || []);
        }
        if (statsRes && statsRes.ok) setFetchedStats(await statsRes.json());
      } catch (e) {
        console.error("Collector profile fetch error:", e);
      } finally {
        setLoadingProfile(false);
        setLoadingCards(false);
      }
    }
    fetchAll();
  }, [collector.user_id]);

  const pfpUrl = profileData?.pfp_url || collector.pfp_url || "";
  const name = profileData?.username || collector.display_name || collector.display || "Collector";
  const ig = sanitizeHandle(profileData?.instagram || collector.instagram || "");
  const tw = sanitizeHandle(profileData?.twitter || collector.twitter || "");
  const tk = sanitizeHandle(profileData?.tiktok || collector.tiktok || "");
  const badges = profileData?.badges || [];

  const totalCards = collector.totalCards !== undefined ? collector.totalCards : (fetchedStats?.totalCards || 0);
  const uniqueSongs = collector.uniqueSongs !== undefined ? collector.uniqueSongs : (fetchedStats?.uniqueSongs || 0);
  const rank = collector.rank !== undefined ? collector.rank : (fetchedStats?.rank || null);

  return (
    <div style={{ height: "100dvh", overflowY: "auto", background: C.bg, color: C.text, padding: "0 0 100px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "18px 16px 10px", gap: 12 }}>
        <div onClick={onBack} style={{
          ...skeuo, width: 36, height: 36, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 18,
        }}>{String.fromCodePoint(0x2190)}</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Collector</div>
      </div>

      {/* PFP + Name + Rank */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 12px" }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%", ...skeuo, overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, fontFamily: SERIF, border: "2px solid " + C.accent, marginBottom: 14,
        }}>
          {pfpUrl ? (
            <img src={pfpUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{name}</div>
        {rank && (
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.textDim, letterSpacing: 1 }}>
            RANK #{rank}
          </div>
        )}
      </div>

      {/* Social Logo Icons */}
      {(ig || tw || tk) && (
        <div style={{ display: "flex", justifyContent: "center", gap: 14, padding: "10px 0 16px" }}>
          {ig && (
            <div
              onClick={() => window.open("https://instagram.com/" + ig, "_blank")}
              style={{
                width: 46, height: 46, borderRadius: 13, cursor: "pointer",
                background: "linear-gradient(135deg, #feda75 0%, #fa7e1e 30%, #d62976 60%, #4f5bd5 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
              </svg>
            </div>
          )}
          {tw && (
            <div
              onClick={() => window.open("https://x.com/" + tw, "_blank")}
              style={{
                width: 46, height: 46, borderRadius: 13, cursor: "pointer",
                background: "#000",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
          )}
          {tk && (
            <div
              onClick={() => window.open("https://tiktok.com/@" + tk, "_blank")}
              style={{
                width: 46, height: 46, borderRadius: 13, cursor: "pointer",
                background: "#010101",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.43a8.16 8.16 0 0 0 4.77 1.52V7.48a4.85 4.85 0 0 1-1-.79z"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, padding: "4px 16px 16px" }}>
          {badges.map((b) => (
            <div key={b.badge.slug} style={{
              ...skeuo, borderRadius: 20, padding: "6px 14px",
              display: "flex", alignItems: "center", gap: 6,
              border: "1px solid " + C.accent + "33",
              background: "linear-gradient(180deg, rgba(228,188,74,0.06), transparent)",
            }}>
              <span style={{ fontSize: 14 }}>{b.badge.icon}</span>
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.5, color: C.accent, fontWeight: 600 }}>
                {b.badge.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "0 16px 24px" }}>
        {[
          { label: "RANK", value: rank ? "#" + rank : "—" },
          { label: "CARDS", value: totalCards },
          { label: "SONGS", value: uniqueSongs },
        ].map((s) => (
          <div key={s.label} style={{ ...skeuo, borderRadius: 14, padding: "14px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      {!loadingCards && collectorCards.length > 0 && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, color: C.textDim, marginBottom: 14 }}>
            COLLECTION · {collectorCards.length} CARD{collectorCards.length !== 1 ? "S" : ""}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {collectorCards.map((card) => (
              <div key={card.chipId} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, pointerEvents: "none" }}>
                <MiniPhotoCard
                  perspective={card.perspective}
                  rarity={card.rarity}
                  isBooster={card.type === "booster"}
                  imageUrl={card.imageUrl}
                  onClick={() => {}}
                />
                <div style={{ fontFamily: MONO, fontSize: 7, color: C.textDim, letterSpacing: 1, textAlign: "center", lineHeight: 1.4 }}>
                  {card.songNum} {card.perspective === "J&J" ? "J&J" : card.perspective.split(" ")[1]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
            }
