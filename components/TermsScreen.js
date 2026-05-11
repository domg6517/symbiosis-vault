"use client";
import { C, SANS, SERIF, MONO, skeuo } from "./design";

export default function TermsScreen({ onBack }) {
  const sectionTitle = {
    fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, marginBottom: 10,
  };
  const para = {
    fontFamily: SANS, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 12,
  };
  const divider = { borderBottom: "1px solid " + C.textDim + "22", marginBottom: 20 };
  const bullet = { display: "block", paddingLeft: 12, marginTop: 3 };

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
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Terms &amp; Conditions</div>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.textDim, textAlign: "center", marginBottom: 28 }}>
          JACK &amp; JACK LLC — VERSION 3.0
        </div>
        <p style={{ ...para, fontWeight: 600, color: C.accent, marginBottom: 24 }}>
          Welcome to Symbiosis Vault! Please read the following Terms &amp; Conditions carefully.
        </p>

        <div style={sectionTitle}>1. ACCEPTANCE OF TERMS</div>
        <p style={{ ...para, marginBottom: 24 }}>By creating an account or using Symbiosis Vault, you agree to be bound by these Terms &amp; Conditions, our Privacy Policy, and all applicable laws and regulations. If you do not agree, you must not use this application. These terms constitute a legally binding agreement between you and Jack &amp; Jack LLC.</p>
        <div style={divider} />

        <div style={sectionTitle}>2. ELIGIBILITY &amp; AGE REQUIREMENT</div>
        <p style={{ ...para, marginBottom: 24 }}>You must be at least 16 years of age to create an account and use Symbiosis Vault. Users between 13 and 15 years of age must have verifiable parental or guardian consent. By creating an account, you represent and warrant that you meet this requirement. Jack &amp; Jack LLC reserves the right to suspend or terminate accounts that do not meet these requirements.</p>
        <div style={divider} />

        <div style={sectionTitle}>3. ENTERTAINMENT PURPOSE ONLY</div>
        <p style={{ ...para, marginBottom: 24 }}>Symbiosis Vault and all associated NFC collectible cards are created purely for entertainment and fan engagement purposes. This platform carries no financial value, no monetary incentives, and no investment opportunity of any kind. Collectible cards cannot be redeemed, exchanged, or traded for money, or any other form of currency through the platform itself. No aspect of this platform constitutes a financial product, security, gambling service, or investment vehicle.</p>
        <div style={divider} />

        <div style={sectionTitle}>4. FINAL SALES</div>
        <p style={{ ...para, marginBottom: 24 }}>Unless otherwise required by applicable law, all sales are final. Jack &amp; Jack LLC is not obligated to provide refunds, returns, exchanges, or replacements for collectible products, digital features, shipping delays, cosmetic variations, or discontinued platform functionality.</p>
        <div style={divider} />

        <div style={sectionTitle}>5. USER ACCOUNTS &amp; RESPONSIBILITIES</div>
        <p style={{ ...para, marginBottom: 24 }}>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and current information during registration and to update it as necessary. You must not impersonate others, access accounts without authorization, or create accounts for abusive, deceptive, exploitative, or unauthorized purposes. You are solely responsible for all activity occurring under your account.</p>
        <div style={divider} />

        <div style={sectionTitle}>6. NFC COLLECTIBLE CARDS</div>
        <p style={{ ...para, marginBottom: 8 }}>Physical NFC cards are collectible items only. Jack &amp; Jack LLC does not guarantee uninterrupted NFC functionality, compatibility across all devices, or permanent access to digital experiences associated with any card. Scanning issues may occur due to device limitations, software updates, environmental factors, or future platform changes.</p>
        <p style={{ ...para, marginBottom: 8 }}>Once a card is linked to your account, linking functionality may change, be limited, or be removed entirely at any time. Jack &amp; Jack LLC reserves the right to modify or discontinue any NFC-related functionality, experiences, unlocks, or integrations without notice.</p>
        <p style={{ ...para, marginBottom: 8 }}>Minor cosmetic variations, manufacturing inconsistencies, packaging wear, or NFC functionality issues may occur and do not necessarily qualify for replacement.</p>
        <p style={{ ...para, marginBottom: 24 }}>Certain collectible drops, rarities, variants, or card distributions may involve randomized allocation. Specific rarities, card types, variants, or outcomes are not guaranteed unless explicitly stated by Jack &amp; Jack LLC.</p>
        <div style={divider} />

        <div style={sectionTitle}>7. NO GUARANTEE OF CONTINUED AVAILABILITY</div>
        <p style={{ ...para, marginBottom: 8 }}>Jack &amp; Jack LLC does not guarantee that Symbiosis Vault, or any associated features, content, leaderboard positions, unlockables, digital experiences, account functionality, or NFC integrations, will remain available for any specific period of time. Features may be modified, suspended, reset, restricted, or permanently discontinued at any time without liability.</p>
        <p style={{ ...para, marginBottom: 24 }}>Users acknowledge that digital content, achievements, badges, unlocks, leaderboard rankings, and related account features are licensed, not owned, and may be altered or removed at any time.</p>
        <div style={divider} />

        <div style={sectionTitle}>8. SECONDARY MARKET &amp; USER TRANSACTIONS</div>
        <p style={{ ...para, marginBottom: 8 }}>Jack &amp; Jack LLC does not endorse, regulate, supervise, or guarantee any secondary market activity involving collectible cards or related items. Any resale, trade, shipment, exchange, or transaction conducted between users or third parties occurs entirely at the users&apos; own risk.</p>
        <p style={{ ...para, marginBottom: 24 }}>Jack &amp; Jack LLC is not responsible for scams, counterfeit items, pricing disputes, fraudulent activity, lost shipments, customs issues, taxes, or third-party transactions of any kind.</p>
        <div style={divider} />

        <div style={sectionTitle}>9. ACCEPTABLE USE</div>
        <p style={{ ...para, marginBottom: 4 }}>You agree not to:</p>
        <p style={{ ...para, marginBottom: 8 }}>
          <span style={bullet}>{"\u2022 attempt to gain unauthorized access to the platform or other accounts"}</span>
          <span style={bullet}>{"\u2022 reverse-engineer, decompile, tamper with, or interfere with the application"}</span>
          <span style={bullet}>{"\u2022 use automated tools, bots, scripts, scraping tools, or unauthorized software"}</span>
          <span style={bullet}>{"\u2022 exploit bugs or vulnerabilities"}</span>
          <span style={bullet}>{"\u2022 harass, abuse, threaten, or harm other users"}</span>
          <span style={bullet}>{"\u2022 upload malicious, unlawful, infringing, or inappropriate content"}</span>
          <span style={bullet}>{"\u2022 interfere with platform stability or security"}</span>
        </p>
        <p style={{ ...para, marginBottom: 24 }}>You agree to immediately report any discovered vulnerabilities or exploits to Jack &amp; Jack LLC.</p>
        <div style={divider} />

        <div style={sectionTitle}>10. PRIVACY &amp; DATA PROTECTION</div>
        <p style={{ ...para, marginBottom: 8 }}>Your use of Symbiosis Vault is also governed by our Privacy Policy, which explains how personal information is collected, used, stored, and protected.</p>
        <p style={{ ...para, marginBottom: 24 }}>We strive to comply with applicable data protection laws including the GDPR (European Union), CCPA (California), and other relevant privacy regulations. We do not sell your personal data to third parties.</p>
        <div style={divider} />

        <div style={sectionTitle}>11. YOUR DATA RIGHTS</div>
        <p style={{ ...para, marginBottom: 4 }}>Subject to applicable law, you may have the right to:</p>
        <p style={{ ...para, marginBottom: 8 }}>
          <span style={bullet}>{"\u2022 access the personal data we hold about you"}</span>
          <span style={bullet}>{"\u2022 request correction of inaccurate information"}</span>
          <span style={bullet}>{"\u2022 request deletion of your data and account"}</span>
          <span style={bullet}>{"\u2022 receive a portable copy of your data"}</span>
          <span style={bullet}>{"\u2022 withdraw consent to certain forms of data processing"}</span>
          <span style={bullet}>{"\u2022 lodge complaints with applicable data protection authorities"}</span>
        </p>
        <p style={{ ...para, marginBottom: 24 }}>To exercise these rights, contact: info@jackandjack.store</p>
        <div style={divider} />

        <div style={sectionTitle}>12. SHIPPING, DELIVERY &amp; CUSTOMS</div>
        <p style={{ ...para, marginBottom: 8 }}>Jack &amp; Jack LLC is not responsible for shipping delays, customs processing, import duties, taxes, lost or stolen packages, carrier disruptions, delivery failures, or incorrect shipping information submitted by users.</p>
        <p style={{ ...para, marginBottom: 8 }}>Untracked shipping methods may not provide delivery confirmation or recovery options. Delivery estimates are approximate only and are not guaranteed.</p>
        <p style={{ ...para, marginBottom: 8 }}>International users are solely responsible for any customs duties, taxes, fees, or import restrictions applicable in their jurisdiction.</p>
        <p style={{ ...para, marginBottom: 24 }}>Payments may be processed by third-party payment providers and processors. Jack &amp; Jack LLC is not responsible for outages, processing errors, declined transactions, security incidents, or service interruptions caused by third-party payment platforms.</p>
        <div style={divider} />

        <div style={sectionTitle}>13. COMMUNITY &amp; THIRD PARTY PLATFORMS</div>
        <p style={{ ...para, marginBottom: 8 }}>Symbiosis Vault may reference or integrate with third-party services or communities including Discord, social media platforms, external websites, or third-party applications. Your interactions with other users on such platforms occur entirely at your own risk.</p>
        <p style={{ ...para, marginBottom: 24 }}>Jack &amp; Jack LLC is not responsible for the conduct, content, communications, or actions of third parties or users outside the direct operation of the Symbiosis Vault platform.</p>
        <div style={divider} />

        <div style={sectionTitle}>14. NO WARRANTIES</div>
        <p style={{ ...para, marginBottom: 8 }}>This platform is provided on an "as-is" and "as-available" basis. Jack &amp; Jack LLC makes no warranties, express or implied, regarding availability, reliability, compatibility, accuracy, security, or fitness for a particular purpose.</p>
        <p style={{ ...para, marginBottom: 24 }}>We do not guarantee uninterrupted access, error-free operation, or permanent availability of any feature or content.</p>
        <div style={divider} />

        <div style={sectionTitle}>15. BETA / EXPERIMENTAL STATUS</div>
        <p style={{ ...para, marginBottom: 8 }}>Symbiosis Vault is currently in an experimental and evolving testing phase. Features may change, malfunction, reset, or be permanently removed at any time. Collection data, leaderboard progress, account functionality, unlocks, or related experiences may be modified, lost, or reset during development.</p>
        <p style={{ ...para, marginBottom: 24 }}>By using this platform, you acknowledge and accept these risks.</p>
        <div style={divider} />

        <div style={sectionTitle}>16. LIMITATION OF LIABILITY</div>
        <p style={{ ...para, marginBottom: 4 }}>To the maximum extent permitted by applicable law, Jack &amp; Jack LLC, its owners, members, affiliates, licensors, employees, contractors, partners, and representatives shall not be liable for any direct, indirect, incidental, consequential, exemplary, or special damages arising from or relating to the use of, or inability to use, Symbiosis Vault or related collectibles.</p>
        <p style={{ ...para, marginBottom: 8 }}>This includes, but is not limited to:
          <span style={bullet}>{"\u2022 loss of data"}</span>
          <span style={bullet}>{"\u2022 loss of access"}</span>
          <span style={bullet}>{"\u2022 loss of digital content"}</span>
          <span style={bullet}>{"\u2022 lost collectibles"}</span>
          <span style={bullet}>{"\u2022 device compatibility issues"}</span>
          <span style={bullet}>{"\u2022 NFC malfunctions"}</span>
          <span style={bullet}>{"\u2022 shipping issues"}</span>
          <span style={bullet}>{"\u2022 third-party conduct"}</span>
          <span style={bullet}>{"\u2022 unauthorized account access"}</span>
          <span style={bullet}>{"\u2022 service interruptions"}</span>
        </p>
        <p style={{ ...para, marginBottom: 24 }}>Nothing in these terms excludes liability that cannot legally be excluded under applicable law.</p>
        <div style={divider} />

        <div style={sectionTitle}>17. INTELLECTUAL PROPERTY</div>
        <p style={{ ...para, marginBottom: 8 }}>All content, artwork, graphics, music references, logos, branding, designs, videos, text, and platform materials within Symbiosis Vault are owned by or licensed to Jack &amp; Jack LLC and are protected by intellectual property laws.</p>
        <p style={{ ...para, marginBottom: 8 }}>Unauthorized reproduction, resale for commercial exploitation, modification, distribution, scraping, or commercial use is strictly prohibited.</p>
        <p style={{ ...para, marginBottom: 24 }}>Users retain ownership of content they upload, such as profile photos, but grant Jack &amp; Jack LLC a limited, non-exclusive license to host, display, and use such content solely for operation of the platform.</p>
        <div style={divider} />

        <div style={sectionTitle}>18. ACCOUNT TERMINATION &amp; SERVICE REFUSAL</div>
        <p style={{ ...para, marginBottom: 8 }}>Jack &amp; Jack LLC reserves the right to suspend, restrict, terminate, delete, or refuse service to any account, order, or user where reasonably necessary to protect platform integrity, platform security, compliance obligations, other users, or the overall operation of Symbiosis Vault. This includes suspected fraud, abuse, harmful conduct, unauthorized activity, or violations of these Terms.</p>
        <p style={{ ...para, marginBottom: 24 }}>Users may delete their accounts at any time through available account settings, subject to applicable legal retention obligations.</p>
        <div style={divider} />

        <div style={sectionTitle}>19. FORCE MAJEURE</div>
        <p style={{ ...para, marginBottom: 24 }}>Jack &amp; Jack LLC shall not be liable for any delay, disruption, or failure to perform resulting from causes beyond its reasonable control, including natural disasters, internet outages, labor disputes, governmental actions, war, terrorism, supply chain issues, power failures, software failures, pandemics, or carrier disruptions.</p>
        <div style={divider} />

        <div style={sectionTitle}>20. MODIFICATIONS TO TERMS</div>
        <p style={{ ...para, marginBottom: 8 }}>Jack &amp; Jack LLC reserves the right to modify these Terms &amp; Conditions at any time. Material changes may be communicated through the app, website, or email. Continued use of Symbiosis Vault after changes become effective constitutes acceptance of the revised terms.</p>
        <p style={{ ...para, marginBottom: 24 }}>If you do not agree with updated terms, you must discontinue use of the platform.</p>
        <div style={divider} />

        <div style={sectionTitle}>21. DISPUTE RESOLUTION</div>
        <p style={{ ...para, marginBottom: 8 }}>Any dispute arising out of or relating to these Terms or your use of Symbiosis Vault shall first be attempted to be resolved through good-faith negotiation.</p>
        <p style={{ ...para, marginBottom: 24 }}>If unresolved, disputes shall be resolved through binding arbitration administered by the American Arbitration Association in the State of California, except where prohibited by applicable consumer protection laws. You waive any right to participate in class action litigation or class-wide arbitration to the extent permitted by law.</p>
        <div style={divider} />

        <div style={sectionTitle}>22. GOVERNING LAW</div>
        <p style={{ ...para, marginBottom: 8 }}>These Terms &amp; Conditions shall be governed by and construed under the laws of the State of California, United States, without regard to conflict of law principles.</p>
        <p style={{ ...para, marginBottom: 24 }}>For users located in the European Union or other jurisdictions with mandatory consumer protections, nothing in these Terms limits rights that cannot legally be waived.</p>
        <div style={divider} />

        <div style={sectionTitle}>23. CONTACT</div>
        <p style={para}>For questions regarding these Terms &amp; Conditions or Symbiosis Vault, contact:</p>
        <a href="mailto:info@jackandjack.store" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", ...skeuo.card, textDecoration: "none", color: C.textSec, fontFamily: MONO, fontSize: 12, letterSpacing: 1, marginBottom: 12, }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          info@jackandjack.store
        </a>
        <p style={{ ...para, fontSize: 12, color: C.textDim }}>Jack &amp; Jack LLC — California, USA</p>
        <p style={{ fontSize: 11, color: C.textDim, fontStyle: "italic", marginTop: 16 }}>
          Last updated: May 2026 — Version 3.0
        </p>
      </div>
    </div>
  );
}
