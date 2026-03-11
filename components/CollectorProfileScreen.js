"use client";
import { C, SERIF, SANS, MONO, skeuo } from "./design";

export default function CollectorProfileScreen({ collector, onBack }) {
  if (!collector) return null;

  const pfpUrl = collector.pfp_url || "";
  const name = collector.display_name || collector.display || "Collector";
  const ig = collector.instagram || "";
  const tw = collector.twitter || "";
  const tk = collector.tiktok || "";

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
        >\u2190</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Collector</div>
      </div>

      {/* PFP + Name */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%", ...skeuo,
          overflow: "hidden", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 36, fontFamily: SERIF,
          border: "2px solid " + C.accent, marginBottom: 16,
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

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "0 16px 20px" }}>
        {[
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
              <div
                key={s.label}
                onClick={() => window.open(s.url + s.value.replace("@", ""), "_blank")}
                style={{
                  ...skeuo, borderRadius: 12, padding: "12px 16px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontFamily: SANS, fontSize: 15 }}>@{s.value.replace("@", "")}</div>
                </div>
                <div style={{ fontSize: 14, color: C.textDim }}>\u2197</div>
              </div>
            ))}
        </div>
      )}

      {/* No socials message */}
      {!ig && !tw && !tk && (
        <div style={{ textAlign: "center", padding: "20px 16px", fontFamily: SANS, fontSize: 14, color: C.textDim }}>
          This collector hasn't added any social links yet.
        </div>
      )}
    </div>
  );
}
