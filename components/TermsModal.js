"use client";
import { useState } from "react";
import { C, SANS, SERIF, MONO, skeuo } from "./design";

export default function TermsModal({ onAccept }) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 40) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    try { localStorage.setItem("termsAccepted", "true"); } catch (e) {}
    onAccept();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.85)", zIndex: 10000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: SANS,
    }}>
      <div style={{
        ...skeuo, background: C.bg, borderRadius: 16,
        maxWidth: 420, width: "100%", maxHeight: "85vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 12px", borderBottom: "1px solid " + C.border,
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: SERIF, fontSize: 20, color: C.accent,
            letterSpacing: 1, marginBottom: 4,
          }}>TERMS & CONDITIONS</div>
          <div style={{
            fontFamily: MONO, fontSize: 10, color: C.textDim,
            letterSpacing: 2, textTransform: "uppercase",
          }}>Jack & Jack LLC</div>
        </div>

        {/* Scrollable content */}
        <div
          onScroll={handleScroll}
          style={{
            flex: 1, overflowY: "auto", padding: "16px 24px",
            fontSize: 13, lineHeight: 1.6, color: C.cream,
            WebkitOverflowScrolling: "touch",
          }}
        >
          <p style={{ marginBottom: 14, fontWeight: 600, color: C.accent }}>
            Welcome to Symbiosis Vault! Please read and accept the following terms before continuing.
          </p>

          <Section title="1. Entertainment Purpose Only">
            Symbiosis Vault and all associated NFC collectible cards are created purely for entertainment and fan engagement purposes. This platform carries no financial value, no monetary incentives, and no investment opportunity of any kind. Collectible cards cannot be redeemed, exchanged, or traded for money, cryptocurrency, or any other form of currency.
          </Section>

          <Section title="2. No Warranties">
            This app is provided on an "as-is" and "as-available" basis. Jack & Jack LLC makes no warranties, expressed or implied, regarding the reliability, availability, or functionality of the platform. The app may experience downtime, bugs, crashes, or may be discontinued at any time without prior notice.
          </Section>

          <Section title="3. Beta / Experimental Status">
            Symbiosis Vault is currently in an experimental testing phase. Features may change, break, or be removed entirely. Your collection data, account, or progress may be reset or lost at any time. By using this app, you acknowledge and accept these risks.
          </Section>

          <Section title="4. Limitation of Liability">
            Jack & Jack LLC, its members, affiliates, and partners shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of or inability to use this application, including but not limited to loss of data, loss of access, or device issues.
          </Section>

          <Section title="5. User Data">
            We may collect basic account information (email address) and usage data to operate the platform. We will not sell your personal data to third parties. By creating an account, you consent to the collection and processing of this data for app functionality.
          </Section>

          <Section title="6. Intellectual Property">
            All content, designs, music references, artwork, and branding within Symbiosis Vault are the property of Jack & Jack LLC or used under license. Unauthorized reproduction, distribution, or commercial use of any content is strictly prohibited.
          </Section>

          <Section title="7. Modifications">
            Jack & Jack LLC reserves the right to modify, update, or discontinue any aspect of Symbiosis Vault, including these Terms & Conditions, at any time and without prior notice. Continued use of the app after any changes constitutes acceptance of the revised terms.
          </Section>

          <Section title="8. Governing Law">
            These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law provisions.
          </Section>

          <p style={{ marginTop: 16, fontSize: 11, color: C.textDim, fontStyle: "italic" }}>
            Last updated: March 2026
          </p>
        </div>

        {/* Accept button */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid " + C.border,
          textAlign: "center",
        }}>
          <button
            onClick={handleAccept}
            style={{
              width: "100%", padding: "14px 0",
              background: C.accent, color: "#000",
              border: "none", borderRadius: 10,
              fontFamily: SERIF, fontSize: 15, fontWeight: 700,
              letterSpacing: 1, cursor: "pointer",
              textTransform: "uppercase",
              opacity: 1,
              transition: "opacity 0.2s",
            }}
          >
            I Agree & Accept
          </button>
          <div style={{
            marginTop: 8, fontSize: 10, color: C.textDim,
            fontFamily: MONO, letterSpacing: 0.5,
          }}>
            By tapping above, you agree to these terms
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: SERIF, fontSize: 13, fontWeight: 600,
        color: C.accent, marginBottom: 6, letterSpacing: 0.3,
      }}>{title}</div>
      <div style={{ color: C.cream, opacity: 0.85 }}>{children}</div>
    </div>
  );
}
