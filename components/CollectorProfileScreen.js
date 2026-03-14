"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { useAuth } from "./AuthContext";

function sanitizeHandle(val) {
  if (!val) return "";
  return val.replace(/^@/, "").replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 30);
}

export default function CollectorProfileScreen({ collector, onBack }) {
  const { session } = useAuth();
  if (!collector) return null;

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!collector.user_id) return;
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/profile?userId=" + collector.user_id, { headers: session?.access_token ? { Authorization: "Bearer " + session.access_token } : {} });
        const data = await res.json();
        if (res.ok) setProfileData(data);
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [collector.user_id]);

  const pfpUrl = profileData?.pfp_url || collector.pfp_url || "";
  const name = profileData?.username || collector.display_name || collector.display || "Collector";
  const ig = sanitizeHandle(profileData?.instagram || collector.instagram || "");
  const tw = sanitizeHandle(profileData?.twitter || collector.twitter || "");
  const tk = sanitizeHandle(profileData?.tiktok || collector.tiktok || "");
  const badges = profileData?.badges || [];

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, color: C.text, padding: "0 0 100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "18px 16px 10px", gap: 12 }}>
        <div onClick={onBack} style={{
          ...skeuo, width: 36, height: 36, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 18,
        }}>{String.fromCodePoint(0x2190)}</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Collector</div>
      </div>

      {/* PFP + Name */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%", ...skeuo, overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, fontFamily: SERIF, border: "2px solid " + C.accent, marginBottom: 16,
        }}>
          {pfpUrl ? (
            <img src={pfpUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700 }}>{name}</div>
        {collector.rank && (
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.textDim, marginTop: 6, letterSpacing: 1 }}>
            RANK #{collector.rank}
          </div>
        )}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, padding: "4px 16px 14px" }}>
          {badges.map((b) => (
            <div key={b.badge.slug} style={{
              ...skeuo, borderRadius: 20, padding: "6px 14px",
              display: "flex", alignItems: "center", gap: 6,
              border: "1px solid " + C.accent + "33",
              background: "linear-gradient(180deg, rgba(228,188,74,0.06), transparent)"
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
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "0 16px 20px" }}>
        {[
          { label: "RANK", value: collector.rank ? "#" + collector.rank : "\u2014" },
          { label: "CARDS", value: collector.totalCards || 0 },
          { label: "SONGS", value: collector.uniqueSongs || 0 },
        ].map((s) => (
          <div key={s.label} style={{ ...skeuo, borderRadius: 14, padding: "14px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Social Links (read-only) */}
      {(ig || tw || tk) && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, color: C.textDim, marginBottom: 10 }}>SOCIAL LINKS</div>
          {[
            { icon: "\u{1F4F7}", label: "Instagram", value: ig, url: "https://instagram.com/" },
            { icon: "\u{1D54F}", label: "X / Twitter", value: tw, url: "https://x.com/" },
            { icon: "\u{1F3B5}", label: "TikTok", value: tk, url: "https://tiktok.com/@" },
          ]
            .filter((s) => s.value)
            .map((s) => (
              <div key={s.label} onClick={() => window.open(s.url + s.value.replace("@", ""), "_blank")} style={{
                ...skeuo, borderRadius: 12, padding: "12px 16px", marginBottom: 8,
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontFamily: SANS, fontSize: 15 }}>@{s.value.replace("@", "")}</div>
                </div>
                <div style={{ fontSize: 14, color: C.textDim }}>{String.fromCodePoint(0x2197)}</div>
              </div>
            ))}
        </div>
      )}

      {/* No socials message */}
      {!ig && !tw && !tk && !loadingProfile && (
        <div style={{ textAlign: "center", padding: "20px 16px", fontFamily: SANS, fontSize: 14, color: C.textDim }}>
          This collector hasn&apos;t added any social links yet.
        </div>
      )}
    </div>
  );
}
