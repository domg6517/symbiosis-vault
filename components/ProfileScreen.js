"use client";
import { useState, useRef } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { supabase } from "../lib/supabase";
export default function ProfileScreen({ ownedCards, onBack, session }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    session?.user?.user_metadata?.display_name || "Collector"
  );
  const [instagram, setInstagram] = useState(
    session?.user?.user_metadata?.instagram || ""
  );
  const [twitter, setTwitter] = useState(
    session?.user?.user_metadata?.twitter || ""
  );
  const [tiktok, setTiktok] = useState(
    session?.user?.user_metadata?.tiktok || ""
  );
  const fileRef = useRef(null);
  const [pfpUrl, setPfpUrl] = useState(
    session?.user?.user_metadata?.pfp_url || ""
  );
  const [saving, setSaving] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  const linked = ownedCards.filter((c) => c.linked).length;
  const email = session?.user?.email || "";

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({
      data: { display_name: displayName, instagram, twitter, tiktok, pfp_url: pfpUrl },
    });
    setSaving(false);
    setEditing(false);
  };

  const handlePfpChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = session.user.id + "/pfp." + ext;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setPfpUrl(data.publicUrl + "?t=" + Date.now());
    }
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", background: C.bg, color: C.text, padding: "0 0 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "14px 16px 6px", gap: 12 }}>
        <div
          onClick={onBack}
          style={{
            ...skeuo, width: 36, height: 36, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 18,
          }}
        >←</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700 }}>Profile</div>
        <div style={{ flex: 1 }} />
        <div
          onClick={() => editing ? handleSave() : setEditing(true)}
          style={{
            ...skeuo, padding: "8px 16px", borderRadius: 10,
            fontFamily: MONO, fontSize: 11, letterSpacing: 2,
            cursor: "pointer", color: C.accent,
          }}
        >{saving ? "SAVING..." : editing ? "SAVE" : "EDIT"}</div>
      </div>

      {/* PFP + Name */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0" }}>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <div
            onClick={() => editing && fileRef.current?.click()}
            style={{
              width: 72, height: 72, borderRadius: "50%",
              ...skeuo, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, fontFamily: SERIF, cursor: editing ? "pointer" : "default",
              border: "2px solid " + C.accent,
            }}
          >
            {pfpUrl ? (
              <img src={pfpUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          {editing && (
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: "50%",
              background: C.accent, color: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, cursor: "pointer",
            }} onClick={() => fileRef.current?.click()}>{"✏"}</div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfpChange} />
        </div>

        {editing ? (
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{
              background: "transparent", border: "1px solid " + C.textDim,
              borderRadius: 8, padding: "8px 16px", color: C.text,
              fontFamily: SERIF, fontSize: 18, textAlign: "center", width: 200,
            }}
          />
        ) : (
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700 }}>{displayName}</div>
        )}
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.textDim, marginTop: 4, letterSpacing: 1 }}>
          {email.toUpperCase()}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "0 16px 10px" }}>
        {[
          { label: "CARDS", value: linked },
          { label: "SONGS", value: new Set(ownedCards.filter((c) => c.linked).map((c) => c.songId)).size },
        ].map((s) => (
          <div key={s.label} style={{ ...skeuo, borderRadius: 14, padding: "10px 24px", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, color: C.textDim, marginBottom: 6 }}>SOCIAL LINKS</div>
        {[
          { icon: "\u{1F4F7}", label: "Instagram", value: instagram, set: setInstagram, prefix: "@", url: "https://instagram.com/" },
          { icon: "\u{1D54F}", label: "X / Twitter", value: twitter, set: setTwitter, prefix: "@", url: "https://x.com/" },
          { icon: "\u{1F3B5}", label: "TikTok", value: tiktok, set: setTiktok, prefix: "@", url: "https://tiktok.com/@" },
        ].map((s) => (
          <div key={s.label} style={{ ...skeuo, borderRadius: 12, padding: "9px 14px", marginBottom: 5, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 16 }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, marginBottom: 1 }}>{s.label}</div>
              {editing ? (
                <input
                  value={s.value}
                  onChange={(e) => s.set(e.target.value)}
                  placeholder={s.prefix + "username"}
                  style={{
                    background: "transparent", border: "none", borderBottom: "1px solid " + C.textDim,
                    color: C.text, fontFamily: SANS, fontSize: 15, width: "100%", padding: "2px 0",
                  }}
                />
              ) : (
                s.value ? (
                <a href={s.url + s.value.replace(/^@/, "")} target="_blank" rel="noopener noreferrer" style={{ fontFamily: SANS, fontSize: 14, color: C.accent, textDecoration: "none" }}>{s.prefix + s.value.replace(/^@/, "")}</a>
              ) : (
                <div style={{ fontFamily: SANS, fontSize: 14, color: C.textDim }}>Not set</div>
              )
              )}
            </div>
          </div>
        ))}
      </div>

            {/* Install App */}
      <div style={{ padding: "10px 16px 0" }}>
        <div onClick={() => setShowInstall(true)} style={{
          ...skeuo, borderRadius: 14, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 14,
          cursor: "pointer",
          border: "1px solid " + C.accent + "22",
          background: "linear-gradient(180deg, rgba(228,188,74,0.04), transparent)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            ...skeuo,
            border: "1px solid " + C.accent + "33",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>{String.fromCodePoint(0x1F4F1)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500 }}>Install App</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>Add to your home screen</div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.accent, letterSpacing: 1 }}>SETUP</div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ padding: "8px 16px 0" }}>
        <div style={{ ...skeuo, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, border: "1px solid " + C.accent + "22", background: "linear-gradient(180deg, rgba(228,188,74,0.04), transparent)" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, ...skeuo, border: "1px solid " + C.accent + "33", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500 }}>Notifications</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>Alerts & updates</div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.accent, letterSpacing: 1, opacity: 0.7 }}>SOON</div>
        </div>
      </div>

      {/* Trade Offers */}
      <div style={{ padding: "8px 16px 0" }}>
        <div style={{ ...skeuo, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, border: "1px solid " + C.accent + "22", background: "linear-gradient(180deg, rgba(228,188,74,0.04), transparent)" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, ...skeuo, border: "1px solid " + C.accent + "33", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500 }}>Trade Offers</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>Swap cards with others</div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.accent, letterSpacing: 1, opacity: 0.7 }}>SOON</div>
        </div>
      </div>

      {/* Bottom Menu */}
      <div style={{ padding: "10px 16px 0" }}>
        {["Report a Bug", "Help & Support", "Sign Out"].map((item) => (
          <div
            key={item}
            onClick={() => {
              if (item === "Sign Out") { supabase.auth.signOut(); window.location.reload(); }
                            else if (item === "Report a Bug") { window.open("mailto:info@jackandjack.store?subject=Symbiosis%20Vault%20Bug%20Report", "_self"); }
              else { alert(item + " \u2014 coming soon!"); }
            }}
            style={{
              ...skeuo, borderRadius: 12, padding: "14px 16px", marginBottom: 8,
              fontFamily: SANS, fontSize: 15, cursor: "pointer",
              color: item === "Sign Out" ? "#e74c3c" : C.text,
            }}
          >{item}</div>
        ))}
      </div>

      {showInstall && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(14px)" }} onClick={() => setShowInstall(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...skeuo, borderRadius: 22, padding: "24px 20px", maxWidth: 360, width: "100%", maxHeight: "85vh", overflow: "auto", border: "1px solid " + C.accent + "33", boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 100px " + C.accent + "0d, inset 0 1px 0 rgba(255,255,255,0.06)" }}>

            {/* Back arrow */}
            <div onClick={() => setShowInstall(false)} style={{ ...skeuo, width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid " + C.accent + "22", marginBottom: 12 }}>
              <span style={{ fontSize: 16, color: C.accent }}>{"\u2190"}</span>
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 700, color: C.cream, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>Install Symbiosis Vault</div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 6, lineHeight: 1.5 }}>Get the full app experience on your phone. Follow these simple steps:</div>
            </div>

            {/* iPhone Section */}
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.accent, marginBottom: 14, borderBottom: "1px solid " + C.accent + "22", paddingBottom: 8 }}>iPHONE / iPAD (SAFARI)</div>

            {/* Step 1 - Share button */}
            <div style={{ ...skeuo, borderRadius: 14, padding: "14px 16px", marginBottom: 10, animation: "fadeSlideIn 0.4s ease 0s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>1</div>
                <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600 }}>Tap the Share button</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>Look at the bottom of your Safari browser for this button:</div>
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(180deg, #007AFF, #0066DD)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,122,255,0.4)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                </div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, textAlign: "center", fontStyle: "italic" }}>The square with an arrow pointing up</div>
            </div>

            {/* Step 2 - Add to Home Screen */}
            <div style={{ ...skeuo, borderRadius: 14, padding: "14px 16px", marginBottom: 10, animation: "fadeSlideIn 0.4s ease 0.15s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>2</div>
                <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600 }}>Scroll down & tap:</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>A menu will slide up from the bottom. Scroll down until you find:</div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: "#f2f2f7", border: "1px solid #e5e5ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </div>
                <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", fontSize: 16, color: "#000", fontWeight: 400 }}>Add to Home Screen</span>
              </div>
            </div>

            {/* Step 3 - Confirm */}
            <div style={{ ...skeuo, borderRadius: 14, padding: "14px 16px", marginBottom: 6, animation: "fadeSlideIn 0.4s ease 0.3s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>3</div>
                <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600 }}>Tap "Add" in the top right</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>You'll see a preview screen. Just tap the blue button:</div>
              <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
                <div style={{ background: "linear-gradient(180deg, #007AFF, #0066DD)", borderRadius: 8, padding: "8px 28px", boxShadow: "0 2px 8px rgba(0,122,255,0.4)" }}>
                  <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", fontSize: 16, color: "#fff", fontWeight: 600 }}>Add</span>
                </div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>That's it! The app icon will appear on your home screen.</div>
            </div>

            {/* Safari note */}
            <div style={{ ...skeuo, borderRadius: 10, padding: "10px 14px", marginBottom: 20, marginTop: 10, border: "1px solid " + C.accent + "22", background: "linear-gradient(180deg, rgba(228,188,74,0.06), transparent)" }}>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 4 }}>{"\u26A0"} Must use Safari</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>On iPhone, this only works in Safari. Chrome and other browsers don't support it on iOS.</div>
            </div>

            {/* Android Section */}
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.accent, marginBottom: 14, borderBottom: "1px solid " + C.accent + "22", paddingBottom: 8 }}>ANDROID (CHROME)</div>

            {/* Android Step 1 */}
            <div style={{ ...skeuo, borderRadius: 14, padding: "14px 16px", marginBottom: 10, animation: "fadeSlideIn 0.4s ease 0.5s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>1</div>
                <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600 }}>Tap the 3-dot menu</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>In Chrome, look for this icon in the top-right corner:</div>
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: "#333", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />
                </div>
              </div>
            </div>

            {/* Android Step 2 */}
            <div style={{ ...skeuo, borderRadius: 14, padding: "14px 16px", marginBottom: 10, animation: "fadeSlideIn 0.4s ease 0.65s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>2</div>
                <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600 }}>Tap "Install app"</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>In the dropdown menu, look for:</div>
              <div style={{ background: "#2d2d2d", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8ab4f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                <span style={{ fontFamily: "Roboto, sans-serif", fontSize: 14, color: "#e8eaed" }}>Install app</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>It may also say "Add to Home screen"</div>
            </div>

            {/* Android Step 3 */}
            <div style={{ ...skeuo, borderRadius: 14, padding: "14px 16px", marginBottom: 6, animation: "fadeSlideIn 0.4s ease 0.8s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>3</div>
                <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600 }}>Tap "Install" to confirm</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>A popup will appear. Tap the button:</div>
              <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
                <div style={{ background: "#8ab4f8", borderRadius: 20, padding: "10px 36px" }}>
                  <span style={{ fontFamily: "Roboto, sans-serif", fontSize: 14, color: "#000", fontWeight: 500 }}>Install</span>
                </div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>Done! The app icon will appear on your home screen.</div>
            </div>

            {/* Got it button */}
            <div onClick={() => setShowInstall(false)} style={{ ...skeuo, borderRadius: 12, padding: "14px 0", textAlign: "center", fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: "#000", cursor: "pointer", marginTop: 20, background: "linear-gradient(180deg, " + C.accent + ", " + C.accent + "cc)", border: "1px solid " + C.accent, fontWeight: 700 }}>GOT IT</div>

            <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          </div>
        </div>
      )}
    </div>
  );
}
