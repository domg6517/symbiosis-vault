"use client";
import { useState, useRef, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { supabase } from "../lib/supabase";
export default function ProfileScreen({ ownedCards, onBack, session, onAccountDeleted }) {
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
  const [badges, setBadges] = useState([]);
  const [cropPreview, setCropPreview] = useState(null);
  const [cropFile, setCropFile] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [usernameError, setUsernameError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const linked = ownedCards.filter((c) => c.linked).length;

  // Fetch user badges
  useEffect(() => {
    if (!session?.user?.id) return;
    async function fetchBadges() {
      try {
        const { data } = await supabase
          .from("user_badges")
          .select("awarded_at, badge:badges (slug, label, description, icon)")
          .eq("user_id", session.user.id);
        if (data) setBadges(data);
      } catch (e) { console.error("Badge fetch error:", e); }
    }
    fetchBadges();
  }, [session]);
  const email = session?.user?.email || "";

  const handleSave = async () => {
    setSaving(true);
    setUsernameError("");
    var trimmed = displayName.trim();
    if (!trimmed) { setSaving(false); return; }
    var { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", trimmed)
      .neq("id", session.user.id)
      .maybeSingle();
    if (existing) {
      setUsernameError("Username already taken");
      setSaving(false);
      return;
    }
    await supabase.auth.updateUser({ data: { display_name: trimmed } });
    await supabase.from("profiles").upsert({
      id: session.user.id,
      username: trimmed,
      email: session.user.email
    }, { onConflict: "id" });
    setSaving(false);
    setEditing(false);
  };

  const handlePfpChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("PFP file selected:", file.name, file.size);
    setCropFile(file);
    const url = URL.createObjectURL(file);
    console.log("Preview URL created:", url);
    setCropPreview(url);
  };

  const handleCropConfirm = async () => {
    if (!cropFile) return;
    setSaving(true);
    try {
      var uploadBlob = cropFile;
      if (zoomLevel > 1) {
        var img = new Image();
        img.src = cropPreview;
        await new Promise(function(r) { img.onload = r; if (img.complete) r(); });
        var size = Math.min(img.width, img.height) / zoomLevel;
        var cx = (img.width - size) / 2;
        var cy = (img.height - size) / 2;
        var canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, cx, cy, size, size, 0, 0, 512, 512);
        uploadBlob = await new Promise(function(r) { canvas.toBlob(r, "image/jpeg", 0.9); });
      }
      var ext = zoomLevel > 1 ? "jpg" : cropFile.name.split(".").pop();
      var path = session.user.id + "/pfp." + ext;
      var { error } = await supabase.storage
        .from("card-media")
        .upload("avatars/" + path, uploadBlob, { upsert: true, contentType: zoomLevel > 1 ? "image/jpeg" : cropFile.type });
    if (!error) {
      const { data } = supabase.storage.from("card-media").getPublicUrl("avatars/" + path);
      const newUrl = data.publicUrl + "?t=" + Date.now();
      setPfpUrl(newUrl);
      await supabase.auth.updateUser({ data: { pfp_url: newUrl } });
    }
    } catch (err) {
      console.error("Upload error:", err);
    }
    if (cropPreview) URL.revokeObjectURL(cropPreview);
    setZoomLevel(1);
    setCropPreview(null);
    setCropFile(null);
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Authorization": "Bearer " + session.access_token },
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete account");
        setDeleting(false);
        return;
      }
      if (onAccountDeleted) onAccountDeleted();
    } catch (err) {
      setDeleteError("Something went wrong. Please try again.");
      setDeleting(false);
    }
  };

  const handleCropCancel = () => {
    if (cropPreview) URL.revokeObjectURL(cropPreview);
    setZoomLevel(1);
    setCropPreview(null);
    setCropFile(null);
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
        >{String.fromCodePoint(0x2190)}</div>
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
            }} onClick={() => fileRef.current?.click()}>{String.fromCodePoint(0x270F)}</div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfpChange} />
        </div>

        {editing ? (
            <>
          <input
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); setUsernameError(""); }}
            style={{
              background: "transparent", border: "1px solid " + C.textDim,
              borderRadius: 8, padding: "8px 16px", color: C.text,
              fontFamily: SERIF, fontSize: 18, textAlign: "center", width: 200,
            }}
          />
            {usernameError ? <div style={{ color: "#e74c3c", fontFamily: MONO, fontSize: 10, letterSpacing: 1, textAlign: "center", marginTop: 4 }}>{usernameError}</div> : null}
            </>
        ) : (
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700 }}>{displayName}</div>
        )}
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.textDim, marginTop: 4, letterSpacing: 1 }}>
          {email.toUpperCase()}
        </div>
      </div>

      
      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, padding: "4px 16px 14px" }}>
          {badges.map((b) => (
            <div key={b.badge.slug} style={{ ...skeuo, borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, border: "1px solid " + C.accent + "33", background: "linear-gradient(180deg, rgba(228,188,74,0.06), transparent)" }}>
              <span style={{ fontSize: 14 }}>{b.badge.icon}</span>
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.5, color: C.accent, fontWeight: 600 }}>{b.badge.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}

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
        <div onClick={() => window.open("mailto:info@jackandjack.store?subject=Symbiosis%20Vault%20Bug%20Report", "_self")}
            style={{ ...skeuo, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 8,
              border: "1px solid " + C.accent + "22", background: "linear-gradient(180deg, rgba(228,188,74,0.04), transparent)" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, ...skeuo, border: "1px solid " + C.accent + "33", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500 }}>Report a Bug</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>Let us know what happened</div>
            </div>
            <div style={{ fontSize: 18, color: C.textDim }}>{String.fromCodePoint(0x203A)}</div>
          </div>
          <div onClick={() => alert("Help & Support \u2014 coming soon!")}
            style={{ ...skeuo, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 8,
              border: "1px solid " + C.accent + "22", background: "linear-gradient(180deg, rgba(228,188,74,0.04), transparent)" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, ...skeuo, border: "1px solid " + C.accent + "33", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500 }}>Help & Support</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>Get answers to questions</div>
            </div>
            <div style={{ fontSize: 18, color: C.textDim }}>{String.fromCodePoint(0x203A)}</div>
          </div>
          <div onClick={() => alert("How It Works \u2014 coming soon!")}
            style={{ ...skeuo, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 8,
              border: "1px solid " + C.accent + "22", background: "linear-gradient(180deg, rgba(228,188,74,0.04), transparent)" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, ...skeuo, border: "1px solid " + C.accent + "33", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500 }}>How It Works</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>Learn about collecting</div>
            </div>
            <div style={{ fontSize: 18, color: C.textDim }}>{String.fromCodePoint(0x203A)}</div>
          </div>
          <div onClick={() => setShowDeleteConfirm(true)} style={{ ...skeuo, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 8, border: "1px solid rgba(231,76,60,0.25)", background: "linear-gradient(180deg, rgba(228,188,74,0.04), rgba(231,76,60,0.04))" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, ...skeuo, border: "1px solid rgba(231,76,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500, color: "#e74c3c" }}>Delete Account</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>Permanently remove your vault</div>
            </div>
          </div>
          <div onClick={() => { supabase.auth.signOut(); window.location.reload(); }}
            style={{ ...skeuo, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 8,
              border: "1px solid rgba(231,76,60,0.2)", background: "linear-gradient(180deg, rgba(231,76,60,0.04), transparent)" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, ...skeuo, border: "1px solid rgba(231,76,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500, color: "#e74c3c" }}>Sign Out</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textDim, marginTop: 2 }}>Log out of your vault</div>
            </div>
          </div>
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
    
      {cropPreview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.accent, marginBottom: 16, textTransform: "uppercase" }}>Preview Your Photo</div>
          <div style={{ width: 180, height: 180, borderRadius: "50%", overflow: "hidden", border: "3px solid " + C.accent, boxShadow: "0 0 30px rgba(228,188,74,0.3)" }}>
            <img src={cropPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(" + zoomLevel + ")", transition: "transform 0.15s ease" }} />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 20 }}>
            <button onClick={() => setZoomLevel(z => Math.max(1, z - 0.25))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: C.cream, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{String.fromCodePoint(0x2212)}</button>
            <input type="range" min="1" max="3" step="0.1" value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} style={{ width: 120, accentColor: C.accent }} />
            <button onClick={() => setZoomLevel(z => Math.min(3, z + 0.25))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: C.cream, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 6, letterSpacing: 1 }}>{Math.round(zoomLevel * 100)}%</div>
          <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
            <button onClick={handleCropCancel} style={{ ...skeuo, padding: "10px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: C.cream, fontFamily: MONO, fontSize: 11, letterSpacing: 1.5, cursor: "pointer" }}>CANCEL</button>
            <button onClick={handleCropConfirm} disabled={saving} style={{ ...skeuo, padding: "10px 28px", borderRadius: 12, border: "1px solid " + C.accent, background: "linear-gradient(180deg, rgba(228,188,74,0.15), rgba(228,188,74,0.05))", color: C.accent, fontFamily: MONO, fontSize: 11, letterSpacing: 1.5, cursor: "pointer", opacity: saving ? 0.5 : 1 }}>{saving ? "SAVING..." : "CONFIRM"}</button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(14px)" }} onClick={() => { if (!deleting) { setShowDeleteConfirm(false); setDeleteError(""); } }}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...skeuo, borderRadius: 22, padding: "28px 24px", maxWidth: 340, width: "100%", border: "1px solid rgba(231,76,60,0.3)", boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 40px rgba(231,76,60,0.08)", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid rgba(231,76,60,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", background: "rgba(231,76,60,0.08)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: "#e74c3c", marginBottom: 8 }}>Delete Account?</div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, lineHeight: 1.6, marginBottom: 20 }}>This will permanently delete your vault, all linked cards, badges, and activity history. This cannot be undone.</div>
            {deleteError ? <div style={{ fontFamily: SANS, fontSize: 12, color: "#e74c3c", marginBottom: 12 }}>{deleteError}</div> : null}
            <button onClick={handleDeleteAccount} disabled={deleting} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1px solid rgba(231,76,60,0.5)", background: "linear-gradient(180deg, rgba(231,76,60,0.15), rgba(231,76,60,0.05))", color: "#e74c3c", fontFamily: MONO, fontSize: 11, letterSpacing: 2, fontWeight: 700, cursor: deleting ? "wait" : "pointer", opacity: deleting ? 0.6 : 1, marginBottom: 10 }}>{deleting ? "DELETING..." : "DELETE FOREVER"}</button>
            <button onClick={() => { setShowDeleteConfirm(false); setDeleteError(""); }} disabled={deleting} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1px solid rgba(228,188,74,0.2)", background: "transparent", color: "#e4bc4a", fontFamily: MONO, fontSize: 11, letterSpacing: 2, fontWeight: 600, cursor: "pointer", opacity: deleting ? 0.4 : 1 }}>CANCEL</button>
          </div>
        </div>
      )}
</div>
  );
}
