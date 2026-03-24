"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { useAuth } from "./AuthContext";
import { MiniPhotoCard } from "./SharedComponents";
import { StarIcon } from "./Icons";

function sanitizeHandle(val) {
  if (!val) return "";
  return val.replace(/^@/, "").replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 30);
}

export default function CollectorProfileScreen({ collector, onBack }) {
  const { session } = useAuth();
  if (!collector) return null;

  const [profileData, setProfileData] = useState(null);
  const [collectorCards, setCollectorCards] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [resolvedRank, setResolvedRank] = useState(null);

  useEffect(() => {
    if (!collector.user_id) return;
    async function fetchAll() {
      try {
        const headers = session?.access_token ? { Authorization: "Bearer " + session.access_token } : {};
        const [profileRes, cardsRes, lbRes] = await Promise.all([
          fetch("/api/users/profile?userId=" + collector.user_id, { headers }),
          fetch("/api/users/cards?userId=" + collector.user_id, { headers }),
          fetch("/api/leaderboard", { headers }),
        ]);
        const profileJson = await profileRes.json();
        const cardsJson = await cardsRes.json();
        const lbJson = await lbRes.json();
        if (profileRes.ok) setProfileData(profileJson);
        if (cardsJson.cards) setCollectorCards(cardsJson.cards);
        if (lbJson.leaderboard) {
          const lbEntry = lbJson.leaderboard.find(e => e.user_id === collector.user_id);
          if (lbEntry) setResolvedRank(lbEntry.rank);
        }
      } catch (e) {
        console.error("Profile fetch error:", e);
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
  const rank = resolvedRank || collector.rank;

  const ultraRareCards = collectorCards.filter(c => c.rarity === "ultra_rare");
  const regularCards = collectorCards.filter(c => c.rarity !== "ultra_rare");
  const uniqueSongs = new Set(collectorCards.map(c => c.songId)).size;

  return (
    <div style={{ height: "100dvh", overflowY: "auto", background: C.bg, color: C.text, padding: "0 0 100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "18px 16px 10px", gap: 12 }}>
        <div onClick={onBack} style={{ ...skeuo, width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>{String.fromCodePoint(0x2190)}</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Collector</div>
      </div>

      {/* PFP + Name + Rank */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 12px" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", ...skeuo, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontFamily: SERIF, border: "2px solid " + C.accent, marginBottom: 14 }}>
          {pfpUrl ? (
            <img src={pfpUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{name}</div>
        {rank && (
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.textDim, letterSpacing: 1 }}>RANK #{rank}</div>
        )}
      </div>

      {/* Social Logo Icons */}
      {(ig || tw || tk) && (
        <div style={{ display: "flex", justifyContent: "center", gap: 14, padding: "10px 0 16px" }}>
          {ig && (
            <div onClick={() => window.open("https://instagram.com/" + ig, "_blank")} style={{ width: 46, height: 46, borderRadius: 13, cursor: "pointer", background: "linear-gradient(135deg, #feda75 0%, #fa7e1e 30%, #d62976 60%, #4f5bd5 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg>
            </div>
          )}
          {tw && (
            <div onClick={() => window.open("https://x.com/" + tw, "_blank")} style={{ width: 46, height: 46, borderRadius: 13, cursor: "pointer", background: "#000", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
          )}
          {tk && (
            <div onClick={() => window.open("https://tiktok.com/@" + tk, "_blank")} style={{ width: 46, height: 46, borderRadius: 13, cursor: "pointer", background: "#000", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/></svg>
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, padding: "4px 16px 14px" }}>
          {badges.map((b) => (
            <div key={b.badge.slug} style={{ ...skeuo, borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, border: "1px solid " + C.accent + "33", background: "linear-gradient(180deg, rgba(228,188,74,0.06), transparent)" }}>
              <span style={{ fontSize: 14 }}>{b.badge.icon}</span>
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.5, color: C.accent, fontWeight: 600 }}>{b.badge.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "0 16px 20px" }}>
        {[
          { label: "RANK", value: rank ? "#" + rank : "\u2014" },
          { label: "CARDS", value: collectorCards.length },
          { label: "SONGS", value: uniqueSongs },
        ].map((s) => (
          <div key={s.label} style={{ ...skeuo, borderRadius: 14, padding: "14px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 1/1 Ultra Rares — same grid as regular cards, slightly larger with gold glow */}
      {!loadingCards && ultraRareCards.length > 0 && (
        <div style={{ padding: "0 16px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <StarIcon size={9} color={C.megaGold} />
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, color: C.megaGold }}>
              1 OF 1{ultraRareCards.length > 1 ? " \u00b7 " + ultraRareCards.length : ""}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {ultraRareCards.map((card) => (
              <div key={card.chipId} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, pointerEvents: "none" }}>
                <div style={{ transform: "scale(1.1)", filter: "drop-shadow(0 0 6px rgba(228,188,74,0.55))" }}>
                  <MiniPhotoCard
                    perspective={card.perspective}
                    rarity={card.rarity}
                    isBooster={card.type === "booster"}
                    imageUrl={card.imageUrl}
                    onClick={() => {}}
                  />
                </div>
                <div style={{ fontFamily: MONO, fontSize: 7, color: C.megaGold, letterSpacing: 1, textAlign: "center", lineHeight: 1.4, marginTop: 4 }}>
                  {card.songNum} {card.perspective === "J&J" ? "J&J" : (card.perspective.split(" ")[1] || card.perspective)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Cards Grid */}
      {!loadingCards && regularCards.length > 0 && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, color: C.textDim, marginBottom: 14 }}>
            COLLECTION \u00b7 {regularCards.length} CARDS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {regularCards.map((card) => (
              <div key={card.chipId} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, pointerEvents: "none" }}>
                <MiniPhotoCard
                  perspective={card.perspective}
                  rarity={card.rarity}
                  isBooster={card.type === "booster"}
                  imageUrl={card.imageUrl}
                  onClick={() => {}}
                />
                <div style={{ fontFamily: MONO, fontSize: 7, color: C.textDim, letterSpacing: 1, textAlign: "center", lineHeight: 1.4 }}>
                  {card.songNum} {card.perspective === "J&J" ? "J&J" : (card.perspective.split(" ")[1] || card.perspective)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}