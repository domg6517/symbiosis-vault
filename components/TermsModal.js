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
    try {
      localStorage.setItem("termsAccepted", "true");
      localStorage.setItem("termsAcceptedAt", new Date().toISOString());
      localStorage.setItem("termsVersion", "2.0");
    } catch (e) {}

    // Log acceptance server-side (fire and forget)
    try {
      fetch("/api/terms/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: "2.0" }),
      }).catch(() => {});
    } catch (e) {}

    onAccept();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)",
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          ...skeuo,
          background: C.bg,
          borderRadius: 16,
          maxWidth: 420,
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 12px",
            borderBottom: "1px solid " + C.border,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              color: C.accent,
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            TERMS & CONDITIONS
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: C.textDim,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Jack & Jack LLC {String.fromCharCode(183)} Version 2.0
          </div>
        </div>

        {/* Scrollable content */}
        <div
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 24px",
            fontSize: 13,
            lineHeight: 1.6,
            color: C.cream,
            WebkitOverflowScrolling: "touch",
          }}
        >
          <p style={{ marginBottom: 14, fontWeight: 600, color: C.accent }}>
            Welcome to Symbiosis Vault! Please read and accept the following terms before continuing.
          </p>

          <Section title="1. Acceptance of Terms">
            By creating an account or using Symbiosis Vault, you agree to be bound by these Terms & Conditions, our Privacy Policy, and all applicable laws and regulations. If you do not agree, you must not use this application. These terms constitute a legally binding agreement between you and Jack & Jack LLC.
          </Section>

          <Section title="2. Eligibility & Age Requirement">
            You must be at least 16 years of age to create an account and use Symbiosis Vault. Users between 13 and 15 must have verifiable parental or guardian consent. By creating an account, you represent and warrant that you meet this age requirement. Jack & Jack LLC reserves the right to terminate accounts that do not meet this requirement.
          </Section>

          <Section title="3. Entertainment Purpose Only">
            Symbiosis Vault and all associated NFC collectible cards are created purely for entertainment and fan engagement purposes. This platform carries no financial value, no monetary incentives, and no investment opportunity of any kind. Collectible cards cannot be redeemed, exchanged, or traded for money, cryptocurrency, or any other form of currency. No aspect of this platform constitutes a financial product, security, or gambling service.
          </Section>

          <Section title="4. User Accounts & Responsibilities">
            You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to update it as needed. You must not share your account, impersonate others, or create multiple accounts. You are solely responsible for all activity under your account.
          </Section>

          <Section title="5. NFC Collectible Cards">
            Physical NFC cards are collectible items only. Jack & Jack LLC does not guarantee the functionality of NFC chips, and scanning issues may occur due to device compatibility. Once a card is linked to your account, it may be unlinked and re-linked as the feature permits. Jack & Jack LLC may modify the linking system at any time.
          </Section>

          <Section title="6. Acceptable Use">
            You agree not to: attempt to gain unauthorized access to the platform or other accounts; reverse-engineer, decompile, or tamper with the application; use automated tools, bots, or scripts to interact with the platform; harass, abuse, or harm other users; upload malicious content, spam, or inappropriate material; exploit bugs or vulnerabilities (report them to us instead).
          </Section>

          <Section title="7. Privacy & Data Protection">
            Your use of Symbiosis Vault is also governed by our Privacy Policy, which details how we collect, use, store, and protect your personal data. We comply with applicable data protection laws including the GDPR (EU), CCPA (California), and other relevant privacy regulations. We do not sell your personal data to third parties. You can access, correct, or delete your data at any time. See our Privacy Policy for full details.
          </Section>

          <Section title="8. Your Data Rights">
            Regardless of your location, you have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data and account; receive a copy of your data in a portable format; withdraw consent to data processing at any time; lodge a complaint with your local data protection authority (EU/EEA users). To exercise these rights, contact info@jackandjack.store.
          </Section>

          <Section title="9. No Warranties">
            This app is provided on an "as-is" and "as-available" basis. Jack & Jack LLC makes no warranties, expressed or implied, regarding the reliability, availability, accuracy, or fitness for a particular purpose of the platform. We do not guarantee uninterrupted or error-free service.
          </Section>

          <Section title="10. Beta / Experimental Status">
            Symbiosis Vault is currently in an experimental testing phase. Features may change, break, or be removed entirely. Your collection data, account, or progress may be reset or lost during development. By using this app, you acknowledge and accept these risks. We will make reasonable efforts to notify users of significant changes.
          </Section>

          <Section title="11. Limitation of Liability">
            To the maximum extent permitted by applicable law, Jack & Jack LLC, its members, affiliates, and partners shall not be held liable for any direct, indirect, incidental, special, or consequential damages arising from the use of or inability to use this application. This includes but is not limited to loss of data, loss of access, device issues, or any other damages. Nothing in these terms excludes liability for fraud, gross negligence, or any liability that cannot be excluded by law.
          </Section>

          <Section title="12. Intellectual Property">
            All content, designs, music references, artwork, logos, and branding within Symbiosis Vault are the property of Jack & Jack LLC or used under license. Unauthorized reproduction, distribution, modification, or commercial use of any content is strictly prohibited. You retain ownership of content you upload (e.g., profile photos) but grant Jack & Jack LLC a limited license to display it within the app.
          </Section>

          <Section title="13. Account Termination">
            Jack & Jack LLC reserves the right to suspend or terminate accounts that violate these terms, engage in abusive behavior, or compromise platform integrity. You may delete your account at any time through the app settings, which will permanently remove your data in accordance with our Privacy Policy.
          </Section>

          <Section title="14. Modifications to Terms">
            Jack & Jack LLC reserves the right to modify these Terms & Conditions at any time. Material changes will be communicated through the app or via email. Continued use of the app after changes constitutes acceptance. If you disagree with updated terms, you must discontinue use and delete your account.
          </Section>

          <Section title="15. Dispute Resolution">
            Any disputes arising from these terms or your use of Symbiosis Vault shall first be addressed through good-faith negotiation. If unresolved, disputes will be subject to binding arbitration under the rules of the American Arbitration Association in the State of California. You agree to waive any right to participate in a class action lawsuit.
          </Section>

          <Section title="16. Governing Law">
            These terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to conflict of law provisions. For EU/EEA users, nothing in these terms affects your mandatory consumer protection rights under your local law.
          </Section>

          <Section title="17. Contact">
            For questions about these terms: info@jackandjack.store. For privacy-related inquiries: info@jackandjack.store. Jack & Jack LLC, California, USA.
          </Section>

          <p
            style={{
              marginTop: 16,
              fontSize: 11,
              color: C.textDim,
              fontStyle: "italic",
            }}
          >
            Last updated: March 2026 {String.fromCharCode(183)} Version 2.0
          </p>
        </div>

        {/* Accept button */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid " + C.border,
            textAlign: "center",
          }}
        >
          <button
            onClick={handleAccept}
            style={{
              width: "100%",
              padding: "14px 0",
              background: C.accent,
              color: "#000",
              border: "none",
              borderRadius: 10,
              fontFamily: SERIF,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: "pointer",
              textTransform: "uppercase",
              opacity: 1,
              transition: "opacity 0.2s",
            }}
          >
            I Agree & Accept
          </button>
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              color: C.textDim,
              fontFamily: MONO,
              letterSpacing: 0.5,
            }}
          >
            By tapping above, you agree to these terms and our Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 13,
          fontWeight: 600,
          color: C.accent,
          marginBottom: 6,
          letterSpacing: 0.3,
        }}
      >
        {title}
      </div>
      <div style={{ color: C.cream, opacity: 0.85 }}>{children}</div>
    </div>
  );
}
