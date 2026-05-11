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
  const subHead = { fontFamily: MONO, fontSize: 8, letterSpacing: 1, color: C.accent, textTransform: "uppercase", display: "block", marginTop: 10, marginBottom: 4 };
  const divider = { borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 };

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

        <p style={para}>At Symbiosis Vault, we take your privacy seriously and are committed to protecting your personal information and being transparent about how it is used. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.</p>
        <p style={para}>Symbiosis Vault is operated by Jack &amp; Jack LLC, based in California, United States.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Age Requirement:</span> Symbiosis Vault is intended for users aged 16 and older. Users between the ages of 13 and 15 may only use the app with verifiable parental or guardian consent. By using this app, you confirm that you meet these requirements.</p>

        <div style={divider} />
        <div style={sectionTitle}>1. INFORMATION WE COLLECT</div>
        <p style={para}><span style={bold}>Account Information:</span> Email address, username, and password (securely hashed — we never store plaintext passwords).</p>
        <p style={para}><span style={bold}>Profile Data (Optional):</span> Profile photo, biography, and social media handles (Instagram, TikTok, X), only if you choose to provide them. Information you choose to add to your public profile may be visible to other users within the app.</p>
        <p style={para}><span style={bold}>Collection Data:</span> NFC chip IDs of scanned photo cards, timestamps of scans, card inventory, and collection statistics.</p>
        <p style={para}><span style={bold}>Device &amp; Technical Data:</span> Device type, operating system, NFC capability status, and limited diagnostic information necessary for app functionality and troubleshooting.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Activity Data:</span> General app usage activity, such as features accessed and activity feed events, used to improve the overall experience and platform stability.</p>

        <div style={divider} />
        <div style={sectionTitle}>2. HOW WE USE YOUR INFORMATION</div>
        <p style={para}><span style={bold}>Service Delivery:</span> Providing NFC card scanning, collection management, leaderboards, and account functionality.</p>
        <p style={para}><span style={bold}>Authentication &amp; Security:</span> Verifying identity, preventing unauthorized access, detecting fraud, and maintaining platform security.</p>
        <p style={para}><span style={bold}>Communication:</span> Responding to inquiries and sending important service-related announcements.</p>
        <p style={para}><span style={bold}>Legal Compliance:</span> Fulfilling legal obligations and enforcing our Terms of Service.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={{ ...bold, color: C.accent }}>What We Do Not Do:</span> We do not use your personal data for advertising, behavioral profiling, or selling personal information to third parties.</p>

        <div style={divider} />
        <div style={sectionTitle}>3. DATA STORAGE &amp; SECURITY</div>
        <p style={para}><span style={bold}>Database Infrastructure:</span> Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and automated backups.</p>
        <p style={para}><span style={bold}>Encryption:</span> Data transmitted between your device and our services is encrypted using TLS 1.3 or newer standards. Passwords are hashed using bcrypt. Authentication tokens are cryptographically signed.</p>
        <p style={para}><span style={bold}>Hosting Infrastructure:</span> The app is hosted on Vercel with CDN protection, DDoS mitigation, and multi-region infrastructure support.</p>
        <p style={para}><span style={bold}>Access Controls:</span> Role-based access controls and Row Level Security (RLS) policies are used to help isolate and protect user data.</p>
        <p style={para}><span style={bold}>Local Storage:</span> Limited non-sensitive preferences, such as theme settings and terms acceptance status, may be stored locally on your device. We do not use cookies or similar technologies for advertising or behavioral tracking.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Security Disclaimer:</span> While we take reasonable measures to protect your information, no method of electronic storage or transmission over the internet can be guaranteed to be completely secure.</p>

        <div style={divider} />
        <div style={sectionTitle}>4. DATA SHARING &amp; DISCLOSURE</div>
        <p style={{ ...para, color: C.accent }}>We do not sell, trade, or rent your personal information.</p>
        <p style={para}><span style={bold}>No Third-Party Advertising Networks:</span> Your data is not shared with advertising or marketing platforms.</p>
        <p style={para}><span style={bold}>Infrastructure Providers:</span> Limited information is processed by trusted infrastructure providers such as Supabase and Vercel solely for the purpose of operating the platform.</p>
        <p style={para}><span style={bold}>Legal Requirements:</span> Information may be disclosed if required by law, legal process, or valid governmental request, and where legally permitted we may attempt to notify affected users.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Business Transfers:</span> In the event of a merger, acquisition, restructuring, or sale of assets, user information may be transferred as part of that transaction subject to applicable privacy laws.</p>

        <div style={divider} />
        <div style={sectionTitle}>5. YOUR RIGHTS</div>
        <p style={{ ...para, color: C.accent, marginBottom: 4 }}><span style={bold}>For EU/EEA Residents (GDPR):</span></p>
        <p style={para}>You may have the right to access, correct, delete, restrict, or object to the processing of your personal data, as well as request data portability and lodge a complaint with your local data protection authority.</p>
        <p style={{ ...para, color: C.accent, marginBottom: 4, marginTop: 12 }}><span style={bold}>For California Residents (CCPA/CPRA):</span></p>
        <p style={para}>You may have the right to know what personal information is collected, request deletion of personal information, request correction of inaccurate information, and receive equal service regardless of exercising your privacy rights. We do not sell or share personal information for cross-context behavioral advertising.</p>
        <p style={{ ...para, marginBottom: 24 }}>To exercise any applicable privacy rights, contact <span style={{ color: C.accent, fontFamily: MONO, fontSize: 12 }}>info@jackandjack.store</span> with "Privacy Request" in the subject line. We may need to verify your identity before processing certain requests.</p>

        <div style={divider} />
        <div style={sectionTitle}>6. CHILDREN&apos;S PRIVACY</div>
        <p style={para}>Symbiosis Vault is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that such information has been collected, we will take reasonable steps to delete it promptly.</p>
        <p style={{ ...para, marginBottom: 24 }}>If a parent or guardian believes that a child has provided personal information without appropriate consent, please contact <span style={{ color: C.accent, fontFamily: MONO, fontSize: 12 }}>info@jackandjack.store</span>.</p>

        <div style={divider} />
        <div style={sectionTitle}>7. DATA RETENTION &amp; DELETION</div>
        <p style={para}><span style={bold}>Active Accounts:</span> Personal data is retained only for as long as necessary to provide the service and maintain your account.</p>
        <p style={para}><span style={bold}>Account Deletion:</span> You may request deletion of your account and associated personal data through the app settings or by contacting us directly.</p>
        <p style={para}><span style={bold}>Deletion Timeline:</span> Personal data is generally deleted from active systems within 30 days of account deletion requests. Residual encrypted backup copies may temporarily remain until removed through normal backup rotation processes.</p>
        <p style={{ ...para, marginBottom: 24 }}><span style={bold}>Anonymized Data:</span> We may retain anonymized or aggregated information that cannot reasonably identify any individual user, such as overall platform usage statistics.</p>

        <div style={divider} />
        <div style={sectionTitle}>8. INTERNATIONAL DATA TRANSFERS</div>
        <p style={para}>Symbiosis Vault is operated from the United States and may process or store information in the United States and other jurisdictions where our service providers operate.</p>
        <p style={{ ...para, marginBottom: 24 }}>For users located in the EU/EEA or other regions with data transfer requirements, we rely on applicable legal mechanisms, including Standard Contractual Clauses (SCCs) where appropriate, to help safeguard international transfers of personal data.</p>

        <div style={divider} />
        <div style={sectionTitle}>9. CHANGES TO THIS POLICY</div>
        <p style={para}>We may update this Privacy Policy periodically to reflect operational, legal, or technical changes. Material updates may be communicated within the app or through the email address associated with your account where appropriate.</p>
        <p style={{ ...para, marginBottom: 24 }}>Your continued use of Symbiosis Vault after changes become effective constitutes acceptance of the updated policy.</p>

        <div style={divider} />
        <div style={sectionTitle}>10. CONTACT</div>
        <p style={para}>For privacy concerns, data requests, or questions regarding this Privacy Policy, please contact:</p>
        <a href="mailto:info@jackandjack.store" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", ...skeuo.card, textDecoration: "none", color: C.textSec, fontFamily: MONO, fontSize: 12, letterSpacing: 1, marginBottom: 12, }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          info@jackandjack.store
        </a>
        <p style={{ ...para, fontSize: 12, color: C.textDim }}>Jack &amp; Jack LLC — California, USA</p>
      </div>
    </div>
  );
}
