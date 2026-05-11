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

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>1. WHAT IS THE SYMBIOSIS VAULT?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>The SYMBIOSIS Vault is the home for an ongoing collectible experience tied to the current Jack &amp; Jack era. Each order includes one physical Jack &amp; Jack photo card containing an NFC chip connected to the digital side of the SYMBIOSIS Vault experience.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>2. WHAT DOES THE NFC FEATURE DO?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Each card contains a unique digital chip that can unlock exclusive content and experiences through the app. This is a purely experimental feature that may get discontinued at any time.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>3. DO I NEED THE APP?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>No. The cards are first and foremost physical collectibles. The NFC chips &amp; app are simply an additional layer tied to certain cards and experiences.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>4. HOW DO I SCAN A CARD?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Open the app, press &apos;Scan Card&apos;, then tap the card near the top/back edge of your phone around the camera area. Some phones may require slightly different placement depending on the NFC reader location. A quick start guide is included with every order.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>5. ARE ALL CARDS THE SAME RARITY?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20, whiteSpace: "pre-line" }}>{"No.\n\u2022 Common \u2014 66%\n\u2022 Rare \u2014 33%\n\u2022 Ultra Rare \u2014 <1%\nCards are allocated randomly during pre-sale. Ultra Rare cards are inserted randomly and will never ship alone."}</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>6. ARE THERE DIFFERENT CARD TYPES?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Yes. There are different card styles including Jack G, Jack J and Jack &amp; Jack variants, with different combinations potentially unlocking different things over time.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>7. WHAT IS THE LEADERBOARD?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20, whiteSpace: "pre-line" }}>{"The leaderboard is currently a fun experimental metric inside the app.\n\u2022 Common = 1 point\n\u2022 Rare = 2 points\n\u2022 Ultra Rare = 5 points"}</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>8. CAN I TRADE CARDS?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Yes. Trading is encouraged within the community, though all trades are done at your own discretion. Make sure to disconnect the card from your app before shipping it out, so the person receiving it can scan the card into their Vault.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>9. WILL THERE BE FUTURE DROPS?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Yes. The Vault is designed as an ongoing experience throughout the SYMBIOSIS era, with plans that extend far beyond these drops and ideally connect to everything Jack &amp; Jack do.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>10. IS TRACKING INCLUDED?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Most shipments currently do not include tracking unless otherwise stated.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>11. SHIPPING ESTIMATES</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20, whiteSpace: "pre-line" }}>{"\u2022 US West Coast: 4\u201310 business days\n\u2022 US East Coast: 7\u201320 business days\n\u2022 Canada: 14\u201324 business days\n\u2022 Europe: 7\u201328 business days\n\u2022 Mexico: 14\u201328 business days\n\u2022 Latin America: 23\u201352 business days\n\u2022 Asia: 14\u201338 business days\n\u2022 Oceania: 20\u201338 business days\nShipping estimates may vary due to customs, local postal services, weather, holidays, or regional delays."}</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>12. MY ORDER HASN&apos;T ARRIVED YET</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20, whiteSpace: "pre-line" }}>{"Please check the shipping estimates first. If your package appears significantly delayed, contact info@jackandjack.store and include:\n\u2022 Full name\n\u2022 Order number\n\u2022 Shipping address"}</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>13. DO YOU SHIP WORLDWIDE?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>We currently ship to most territories worldwide, though some regions may occasionally be unavailable due to postal restrictions or delivery reliability.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>14. WILL THERE BE SIGNED CARDS?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Possibly. Future drops may contain signed, personalized, altered, or otherwise unique variants.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>15. ARE ALL SALES FINAL?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Yes. All sales are final. Prices are in USD.</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>16. WHERE CAN I ASK QUESTIONS OR TRADE?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20, whiteSpace: "pre-line" }}>{"The Discord community is currently the main hub for:\n\u2022 Trading\n\u2022 Pull reveals\n\u2022 Questions\n\u2022 Community discoveries\n\u2022 Vault discussions\n\u2022 Future teasers"}</div>
        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10 }}>STILL HAVE QUESTIONS?</div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 16 }}>We&apos;re here to help. Reach out and we&apos;ll get back to you.</div>
        <a href="mailto:info@jackandjack.store" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", ...skeuo.card, textDecoration: "none", color: C.textSec, fontFamily: MONO, fontSize: 12, letterSpacing: 1, marginBottom: 20, }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          info@jackandjack.store
        </a>
      </div>
    </div>
  );
}
