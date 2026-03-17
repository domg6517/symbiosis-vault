"use client";
import { C, SERIF, SANS, MONO, skeuo } from "./design";

export default function FAQScreen({ onBack }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      overflowY: "auto", WebkitOverflowScrolling: "touch",
      background: C.bg, color: C.text, padding: "0 0 40px",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "14px 16px 6px",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
        gap: 12,
      }}>
        <div onClick={onBack} style={{
          ...skeuo, width: 36, height: 36, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 18,
        }}>{String.fromCodePoint(0x2190)}</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>FAQ</div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.textDim, textAlign: "center", marginBottom: 28 }}>
          FREQUENTLY ASKED QUESTIONS
        </div>

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>HOW DO I COLLECT?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>
          During the limited release window, scan any Jack & Jack NFC collectible to add it to your vault. Each physical card holds a unique chip - tap it with your phone and the card is yours. Build your collection before the window closes.
        </div>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>LEADERBOARD SCORING</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>
          Every card you collect earns points toward your rank. Common cards are worth 1 point, Rare cards earn 2 points, and Ultra Rares are worth 5 points. The more you collect, the higher you climb.
        </div>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>STILL HAVE QUESTIONS?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 16 }}>
          We're here to help. Reach out and we'll get back to you.
        </div>

        <a href="mailto:info@jackandjack.store" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px", ...skeuo.card, textDecoration: "none",
          color: C.textSec, fontFamily: MONO, fontSize: 12, letterSpacing: 1, marginBottom: 20,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          info@jackandjack.store
        </a>
      </div>
    </div>
  );
}
