"use client";
import { C, SANS, SERIF, MONO, skeuo } from "./design";

export default function PrivacyScreen({ onBack }) {
  const sectionTitle = {
    fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10,
  };
  const para = {
    fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 12,
  };
  const bold = { fontWeight: 600, color: C.cream };

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
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Privacy Policy</div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.textDim, textAlign: "center", marginBottom: 28 }}>
          LAST UPDATED: MARCH 2026
        </div>

        <p style={para}>
          At Symbiosis Vault, we take your privacy extremely seriously. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data. We are committed to protecting your personal information and being fully transparent.
        </p>
        <p style={{ ...para, marginBottom: 24 }}>
          <span style={bold}>Age Requirement:</span> Symbiosis Vault is intended for users aged 16 and older. By using this app, you confirm you meet this requirement.
        </p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>1. INFORMATION WE COLLECT</div>
        <p style={para}><span style={bold}>Account Information:</span> Email address, username, and password (securely hashed - we never store plaintext passwords).</p>
        <p style={para}><span style={bold}>Profile Data (Optional):</span> Profile photo, biography, and social media handles (Instagram, TikTok, X) - only if you choose to add them.</p>
        <p style={para}><span style={bold}>Collection Data:</span> NFC chip IDs of scanned photo cards, timestamps of scans, and your card inventory and collection statistics.</p>
        <p style={para}><span style={bold}>Device & Technical Data:</span> Device type, operating system, NFC capability status, and basic diagnostic information necessary for NFC functionality.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Activity Data:</span> App usage patterns (features accessed, activity feed events) to improve your experience. This data is never shared externally.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>2. HOW WE USE YOUR INFORMATION</div>
        <p style={para}><span style={bold}>Service Delivery:</span> Providing NFC card scanning, collection management, leaderboards, and account functionality.</p>
        <p style={para}><span style={bold}>Authentication & Security:</span> Verifying your identity, preventing fraud, and maintaining account security.</p>
        <p style={para}><span style={bold}>Communication:</span> Responding to inquiries and sending essential service announcements.</p>
        <p style={para}><span style={bold}>Legal Compliance:</span> Fulfilling legal obligations and enforcing our Terms of Service.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={{ ...bold, color: C.accent }}>What We Do NOT Do:</span> We do not use your data for advertising, profiling, behavioral tracking, or selling to third parties. Ever.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>3. DATA STORAGE & SECURITY</div>
        <p style={para}><span style={bold}>Database:</span> Your data is stored securely on Supabase (PostgreSQL) with enterprise-grade encryption at rest and regular automated backups.</p>
        <p style={para}><span style={bold}>Encryption:</span> All data in transit uses TLS 1.3+ encryption. Passwords are hashed using bcrypt. Authentication tokens are cryptographically signed.</p>
        <p style={para}><span style={bold}>Hosting:</span> The app is hosted on Vercel with global CDN protection, DDoS mitigation, and multi-region redundancy.</p>
        <p style={para}><span style={bold}>Access Control:</span> Strict role-based access controls with Row Level Security (RLS) policies ensure data isolation between users.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Local Storage:</span> Only non-sensitive UI preferences (theme, terms acceptance) are stored locally on your device via localStorage. No cookies are used for tracking.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>4. DATA SHARING & DISCLOSURE</div>
        <p style={para}><span style={{ ...bold, color: C.accent }}>We do not sell, trade, or rent your personal information.</span></p>
        <p style={para}><span style={bold}>No Third-Party Analytics:</span> We do not use Google Analytics, Mixpanel, Segment, or any external analytics services.</p>
        <p style={para}><span style={bold}>No Advertising Partners:</span> Your data is never shared with advertising networks or marketing platforms.</p>
        <p style={para}><span style={bold}>Infrastructure Providers:</span> Limited data is shared with Supabase (database) and Vercel (hosting), who are contractually bound to protect your privacy.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Legal Requirements:</span> We may disclose data only when required by law, court order, or government request, and will notify you when legally permitted.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>5. YOUR RIGHTS</div>
        <p style={{ ...para, color: C.accent }}><span style={bold}>For EU/EEA Residents (GDPR):</span></p>
        <p style={para}>You have the right to: access your personal data; rectify inaccurate data; request erasure ("right to be forgotten"); restrict processing; data portability; object to processing; and lodge complaints with your local data protection authority.</p>
        <p style={{ ...para, color: C.accent, marginTop: 12 }}><span style={bold}>For California Residents (CCPA):</span></p>
        <p style={para}>You have the right to: know what personal information is collected; know whether your data is sold or disclosed (we do neither); delete your personal information; opt-out of data sales (we do not sell data); and non-discrimination for exercising your rights.</p>
        <p style={{ ...para, marginBottom: 24 }}>To exercise any of these rights, email <span style={{ color: C.accent, fontFamily: MONO, fontSize: 12 }}>info@jackandjack.store</span> with "Privacy Request" in the subject line. We will verify your identity and respond within 30 days.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>6. CHILDREN'S PRIVACY</div>
        <p style={para}>Symbiosis Vault requires users to be 16 years of age or older. We do not knowingly collect information from children under 13.</p>
        <p style={para}>Users aged 13-15 must obtain verifiable parental or guardian consent before using this app.</p>
        <p style={{ ...para, marginBottom: 24 }}>If a parent or guardian believes their child has created an account without consent, please contact <span style={{ color: C.accent, fontFamily: MONO, fontSize: 12 }}>info@jackandjack.store</span> and we will promptly investigate and delete the account if appropriate.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>7. DATA RETENTION & DELETION</div>
        <p style={para}><span style={bold}>Active Accounts:</span> We retain your data only as long as your account is active and necessary to provide our services.</p>
        <p style={para}><span style={bold}>Account Deletion:</span> You can permanently delete your account and all associated data at any time through the app's Profile settings. This action is irreversible.</p>
        <p style={para}><span style={bold}>Deletion Timeline:</span> Upon account deletion, all personal data is permanently removed from our servers within 30 days. Automated backups are purged on their regular rotation cycle.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Anonymized Data:</span> We may retain fully anonymized, aggregated statistics (e.g., total cards scanned globally) that cannot identify any individual.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>8. INTERNATIONAL DATA TRANSFERS</div>
        <p style={para}>Symbiosis Vault is operated by Jack & Jack LLC from California, USA and is distributed globally. Your data may be stored and processed in the United States and other jurisdictions.</p>
        <p style={para}>For EU/EEA residents, we rely on Standard Contractual Clauses (SCCs) and our providers' GDPR compliance mechanisms to ensure adequate data protection during international transfers.</p>
        <p style={{ ...para, marginBottom: 24 }}>All international data transfers are encrypted and subject to the same security standards described in this policy.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>9. CHANGES TO THIS POLICY</div>
        <p style={para}>We may update this Privacy Policy periodically. Material changes will be announced in the app and, where possible, via email to your registered address.</p>
        <p style={{ ...para, marginBottom: 24 }}>Continued use of Symbiosis Vault after changes constitutes acceptance of the updated policy. We encourage you to review this policy regularly.</p>

        <div style={{ borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 }} />

        <div style={sectionTitle}>10. CONTACT</div>
        <p style={para}>For privacy concerns, data requests, or questions about this policy:</p>
        <a href="mailto:info@jackandjack.store" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px", ...skeuo.card, textDecoration: "none",
          color: C.textSec, fontFamily: MONO, fontSize: 12, letterSpacing: 1, marginBottom: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          info@jackandjack.store
        </a>
        <p style={{ ...para, fontSize: 12, color: C.textDim }}>Jack & Jack LLC -California, USA</p>
      </div>
    </div>
  );
}
