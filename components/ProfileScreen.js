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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div
            onClick={() => editing && fileRef.current?.click()}
            style={{
              width: 90, height: 90, borderRadius: "50%",
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
              fontFamily: SERIF, fontSize: 20, textAlign: "center", width: 200,
            }}
          />
        ) : (
          <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700 }}>{displayName}</div>
        )}
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.textDim, marginTop: 6, letterSpacing: 1 }}>
          {email.toUpperCase()}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "0 16px 20px" }}>
        {[
          { label: "CARDS", value: linked },
          { label: "SONGS", value: new Set(ownedCards.filter((c) => c.linked).map((c) => c.songId)).size },
        ].map((s) => (
          <div key={s.label} style={{ ...skeuo, borderRadius: 14, padding: "14px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, color: C.textDim, marginBottom: 10 }}>SOCIAL LINKS</div>
        {[
          { icon: "\u{1F4F7}", label: "Instagram", value: instagram, set: setInstagram, prefix: "@", url: "https://instagram.com/" },
          { icon: "\u{1D54F}", label: "X / Twitter", value: twitter, set: setTwitter, prefix: "@", url: "https://x.com/" },
          { icon: "\u{1F3B5}", label: "TikTok", value: tiktok, set: setTiktok, prefix: "@", url: "https://tiktok.com/@" },
        ].map((s) => (
          <div key={s.label} style={{ ...skeuo, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginBottom: 2 }}>{s.label}</div>
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
                <a href={s.url + s.value.replace(/^@/, "")} target="_blank" rel="noopener noreferrer" style={{ fontFamily: SANS, fontSize: 15, color: C.accent, textDecoration: "none" }}>{s.prefix + s.value.replace(/^@/, "")}</a>
              ) : (
                <div style={{ fontFamily: SANS, fontSize: 15, color: C.textDim }}>Not set</div>
              )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Menu */}
      <div style={{ padding: "20px 16px 0" }}>
        {["Install App", "Notifications", "Trade Offers", "Help & Support", "Sign Out"].map((item) => (
          <div
            key={item}
            onClick={() => {
              if (item === "Sign Out") { supabase.auth.signOut(); window.location.reload(); }
              else if (item === "Install App") { setShowInstall(true); }
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }} onClick={() => setShowInstall(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...skeuo, borderRadius: 20, padding: "28px 24px", maxWidth: 340, width: "100%", maxHeight: "80vh", overflow: "auto" }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>Install Symbiosis Vault</div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, textAlign: "center", marginBottom: 20 }}>Add to your home screen for the full experience</div>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.accent, marginBottom: 12 }}>iPHONE / iPAD</div>
            {[
              { step: "1", text: "Tap the Share button", detail: "Bottom toolbar in Safari", icon: "\u{1F4E4}" },
              { step: "2", text: "Scroll and tap 'Add to Home Screen'", detail: "With the + icon", icon: "\u{2795}" },
              { step: "3", text: "Tap 'Add'", detail: "App icon appears on home screen", icon: "\u{2705}" },
            ].map((s, i) => (
              <div key={"ios"+i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, padding: "10px 12px", ...skeuo, borderRadius: 12, animation: "fadeSlideIn 0.4s ease " + (i * 0.15) + "s both" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 13, color: C.accent, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500 }}>{s.text}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>{s.detail}</div>
                </div>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
              </div>
            ))}
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.accent, marginTop: 20, marginBottom: 12 }}>ANDROID</div>
            {[
              { step: "1", text: "Tap the menu (3 dots)", detail: "Top-right in Chrome", icon: "\u{22EE}" },
              { step: "2", text: "Tap 'Install app'", detail: "Or 'Add to Home screen'", icon: "\u{1F4F2}" },
              { step: "3", text: "Confirm install", detail: "App icon appears on home screen", icon: "\u{2705}" },
            ].map((s, i) => (
              <div key={"and"+i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, padding: "10px 12px", ...skeuo, borderRadius: 12, animation: "fadeSlideIn 0.4s ease " + ((i * 0.15) + 0.5) + "s both" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 13, color: C.accent, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500 }}>{s.text}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>{s.detail}</div>
                </div>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
              </div>
            ))}
            <div onClick={() => setShowInstall(false)} style={{ ...skeuo, borderRadius: 12, padding: "12px 0", textAlign: "center", fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: C.accent, cursor: "pointer", marginTop: 16 }}>GOT IT</div>
            <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          </div>
        </div>
      )}
    </div>
  );
}
