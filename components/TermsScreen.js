"use client";
import { C, SANS, SERIF, MONO, skeuo } from "./design";

export default function TermsScreen({ onBack }) {
  const sectionTitle = {
    fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10,
  };
  const para = {
    fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 12,
  };

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
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Terms & Conditions</div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.textDim, textAlign: "center", marginBottom: 28 }}>
          JACK & JACK LLC - VERSION 2.0
        </div>

        <p style={{ ...para, fontWeight: 600, color: C.accent, marginBottom: 24 }}>
          Welcome to Symbiosis Vault! Please read the following terms carefully.
        </p>

        <div style={sectionTitle}>1. ACCEPTANCE OF TERMS</div>
        <p style={{ ...para, marginBottom: 24 }}>By creating an account or using Symbiosis Vault, you agree to be bound by these Terms & Conditions, our Privacy Policy, and all applicable laws and regulations. If you do not agree, you must not use this application. These terms constitute a legally binding agreement between you and Jack & Jack LLC.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>2. ELIGIBILITY & AGE REQUIREMENT</div>
        <p style={{ ...para, marginBottom: 24 }}>You must be at least 16 years of age to create an account and use Symbiosis Vault. Users between 13 and 15 must have verifiable parental or guardian consent. By creating an account, you represent and warrant that you meet this age requirement. Jack & Jack LLC reserves the right to terminate accounts that do not meet this requirement.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>3. ENTERTAINMENT PURPOSE ONLY</div>
        <p style={{ ...para, marginBottom: 24 }}>Symbiosis Vault and all associated NFC collectible cards are created purely for entertainment and fan engagement purposes. This platform carries no financial value, no monetary incentives, and no investment opportunity of any kind. Collectible cards cannot be redeemed, exchanged, or traded for money, cryptocurrency, or any other form of currency. No aspect of this platform constitutes a financial product, security, or gambling service.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>4. USER ACCOUNTS & RESPONSIBILITIES</div>
        <p style={{ ...para, marginBottom: 24 }}>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to update it as needed. You must not share your account, impersonate others, or create multiple accounts. You are solely responsible for all activity under your account.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>5. NFC COLLECTIBLE CARDS</div>
        <p style={{ ...para, marginBottom: 24 }}>Physical NFC cards are collectible items only. Jack & Jack LLC does not guarantee the functionality of NFC chips, and scanning issues may occur due to device compatibility. Once a card is linked to your account, it may be unlinked and re-linked as the feature permits. Jack & Jack LLC may modify the linking system at any time.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>6. ACCEPTABLE USE</div>
        <p style={{ ...para, marginBottom: 24 }}>You agree not to: attempt to gain unauthorized access to the platform or other accounts; reverse-engineer, decompile, or tamper with the application; use automated tools, bots, or scripts to interact with the platform; harass, abuse, or harm other users; upload malicious content, spam, or inappropriate material; exploit bugs or vulnerabilities (report them to us instead).</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>7. PRIVACY & DATA PROTECTION</div>
        <p style={{ ...para, marginBottom: 24 }}>Your use of Symbiosis Vault is also governed by our Privacy Policy, which details how we collect, use, store, and protect your personal data. We comply with applicable data protection laws including the GDPR (EU), CCPA (California), and other relevant privacy regulations. We do not sell your personal data to third parties. You can access, correct, or delete your data at any time. See our Privacy Policy for full details.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>8. YOUR DATA RIGHTS</div>
        <p style={{ ...para, marginBottom: 24 }}>Regardless of your location, you have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data and account; receive a copy of your data in a portable format; withdraw consent to data processing at any time; lodge a complaint with your local data protection authority (EU/EEA users). To exercise these rights, contact info@jackandjack.store.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>9. NO WARRANTIES</div>
        <p style={{ ...para, marginBottom: 24 }}>This app is provided on an "as-is" and "as-available" basis. Jack & Jack LLC makes no warranties, expressed or implied, regarding the reliability, availability, accuracy, or fitness for a particular purpose of the platform. We do not guarantee uninterrupted or error-free service.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>10. BETA / EXPERIMENTAL STATUS</div>
        <p style={{ ...para, marginBottom: 24 }}>Symbiosis Vault is currently in an experimental testing phase. Features may change, break, or be removed entirely. Your collection data, account, or progress may be reset or lost during development. By using this app, you acknowledge and accept these risks. We will make reasonable efforts to notify users of significant changes.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>11. LIMITATION OF LIABILITY</div>
        <p style={{ ...para, marginBottom: 24 }}>To the maximum extent permitted by applicable law, Jack & Jack LLC, its members, affiliates, and partners shall not be held liable for any direct, indirect, incidental, special, or consequential damages arising from the use of or inability to use this application. This includes but is not limited to loss of data, loss of access, device issues, or any other damages. Nothing in these terms excludes liability for fraud, gross negligence, or any liability that cannot be excluded by law.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>12. INTELLECTUAL PROPERTY</div>
        <p style={{ ...para, marginBottom: 24 }}>All content, designs, music references, artwork, logos, and branding within Symbiosis Vault are the property of Jack & Jack LLC or used under license. Unauthorized reproduction, distribution, modification, or commercial use of any content is strictly prohibited. You retain ownership of content you upload (e.g., profile photos) but grant Jack & Jack LLC a limited license to display it within the app.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>13. ACCOUNT TERMINATION</div>
        <p style={{ ...para, marginBottom: 24 }}>Jack & Jack LLC reserves the right to suspend or terminate accounts that violate these terms, engage in abusive behavior, or compromise platform integrity. You may delete your account at any time through the app settings, which will permanently remove your data in accordance with our Privacy Policy.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>14. MODIFICATIONS TO TERMS</div>
        <p style={{ ...para, marginBottom: 24 }}>Jack & Jack LLC reserves the right to modify these Terms & Conditions at any time. Material changes will be communicated through the app or via email. Continued use of the app after changes constitutes acceptance. If you disagree with updated terms, you must discontinue use and delete your account.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>15. DISPUTE RESOLUTION</div>
        <p style={{ ...para, marginBottom: 24 }}>Any disputes arising from these terms or your use of Symbiosis Vault shall first be addressed through good-faith negotiation. If unresolved, disputes will be subject to binding arbitration under the rules of the American Arbitration Association in the State of California. You agree to waive any right to participate in a class action lawsuit.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>16. GOVERNING LAW</div>
        <p style={{ ...para, marginBottom: 24 }}>These terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to conflict of law provisions. For EU/EEA users, nothing in these terms affects your mandatory consumer protection rights under your local law.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>17. CONTACT</div>
        <p style={para}>For questions about these terms:</p>
        <a href="mailto:info@jackandjack.store" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px", ...skeuo.card, textDecoration: "none",
          color: C.textSec, fontFamily: MONO, fontSize: 12, letterSpacing: 1, marginBottom: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          info@jackandjack.store
        </a>
        <p style={{ ...para, fontSize: 12, color: C.textDim }}>Jack & Jack LLC - California, USA</p>
        <p style={{ fontSize: 11, color: C.textDim, fontStyle: "italic", marginTop: 16 }}>
          Last updated: March 2026 - Version 2.0
        </p>
      </div>
    </div>
  );
}
