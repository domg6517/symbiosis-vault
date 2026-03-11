"use client";
import { useState, useRef } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, Divider, ChevronLeft, MusicIcon } from "./Icons";
import { SINGLES, BOOSTERS, PERSPECTIVES, generateUltraRares } from "./data";
import { supabase } from "../lib/supabase";

const ULTRA_RARES = generateUltraRares();

export default function ProfileScreen({ ownedCards, onBack }) {
  const linked = ownedCards.filter((c) => c.linked);
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("Collector");
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setProfilePic(reader.result); reader.readAsDataURL(file); }
  };
  const singleCards = linked.filter((c) => c.type === "single");
  const boosterCards = linked.filter((c) => c.type === "booster");
  const completeSingles = SINGLES.filter((s) => new Set(singleCards.filter((c) => c.songId === s.id).map((c) => c.perspective)).size === 3).length;
  const completeBoosters = BOOSTERS.filter((s) => new Set(boosterCards.filter((c) => c.songId === s.id).map((c) => c.perspective)).size === 3).length;
  const ultraOwned = ULTRA_RARES.filter((ur) => ur.owned).length;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bg, overflow: "auto", position: "relative" }}>
      <FilmGrain opacity={0.03} />
      <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", gap: 10, zIndex: 1 }}>
        <div onClick={onBack} style={{ cursor: "pointer", padding: 4 }}><ChevronLeft /></div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, fontFamily: MONO }}>PROFILE</div>
      </div>

      <div style={{ textAlign: "center", padding: "16px 22px 24px", zIndex: 1 }}>
          <div onClick={() => fileInputRef.current?.click()} style={{ width: 70, height: 70, ...skeuo.card, borderRadius: "50%", border: `2px solid ${C.accent}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", cursor: "pointer", position: "relative", overflow: "hidden", background: profilePic ? "none" : `linear-gradient(135deg, ${C.accent}22, ${C.accent}44)` }}>
            {profilePic ? <img src={profilePic} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ fontSize: 24, fontFamily: SERIF, color: C.accent }}>{displayName[0]}</span>}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.bg }}>+</div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
        <div style={{ fontSize: 20, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 14, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>Collector</div>
        <div style={{ fontSize: 10, color: C.textDim, fontFamily: MONO, letterSpacing: 2, marginTop: 5 }}>MEMBER SINCE 2026</div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 6, padding: "0 20px", marginBottom: 20, zIndex: 1, flexWrap: "wrap" }}>
        {[
          { label: "LINKED", value: linked.length, color: C.accent },
          { label: "SINGLES", value: `${completeSingles}/10`, color: C.teal },
          { label: "BOOSTERS", value: `${completeBoosters}/22`, color: C.booster },
          { label: "ULTRA", value: `${ultraOwned}/30`, color: C.megaGold },
        ].map((stat) => (
          <div key={stat.label} style={{
            flex: "1 1 22%",
            ...skeuo.card, padding: "14px 4px",
            textAlign: "center", margin: "0 1px 4px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={skeuo.gloss} />
          {editingName ? <input autoFocus value={displayName} onChange={(e) => setDisplayName(e.target.value)} onBlur={() => setEditingName(false)} onKeyDown={(e) => e.key === "Enter" && setEditingName(false)} style={{ fontSize: 20, fontWeight: 300, color: C.cream, fontFamily: SERIF, background: "transparent", border: "none", borderBottom: `1px solid ${C.accent}`, outline: "none", textAlign: "center", width: "60%", marginTop: 10 }} /> : <div onClick={() => setEditingName(true)} style={{ fontSize: 20, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 10, cursor: "pointer" }}>{displayName} &#9998;</div>}
            <div style={{ fontSize: 7, color: C.textDim, fontFamily: MONO, letterSpacing: 2, marginTop: 4, position: "relative", zIndex: 1 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 22px", zIndex: 1 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, fontFamily: MONO, marginBottom: 10 }}>SINGLES STATUS</div>
        {SINGLES.map((song) => {
          const sc = singleCards.filter((c) => c.songId === song.id);
          const persps = new Set(sc.map((c) => c.perspective));
          const complete = persps.size === 3;
          return (
            <div key={song.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 8px",
              background: complete ? `linear-gradient(135deg, rgba(200,184,138,0.06), rgba(200,184,138,0.02))` : "transparent",
              borderBottom: `1px solid ${C.textDim}0D`,
            }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.textDim, width: 18, textAlign: "right" }}>{song.num}</div>
              <MusicIcon size={12} color={complete ? C.accent : C.textDim} />
              <div style={{ flex: 1, fontSize: 13, fontFamily: SANS, fontWeight: 500, color: complete ? C.cream : C.textSec }}>{song.title}</div>
              <div style={{ fontSize: 11, fontFamily: SANS, color: C.textDim }}>{sc.length}</div>
              <div style={{
                ...skeuo.badge, padding: "3px 8px",
                fontSize: 9, fontFamily: MONO, letterSpacing: 1,
                color: complete ? C.accent : C.textDim, width: "auto", textAlign: "center",
              }}>
                {complete ? "DONE" : `${persps.size}/3`}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "24px 22px 36px", zIndex: 1 }}>
        <Divider style={{ marginBottom: 20 }} />
        {["Notifications", "Trade Offers", "Help & Support", "Sign Out"].map((item) => (
          <div key={item} onClick={() => { if (item === "Sign Out") { supabase.auth.signOut(); window.location.reload(); } else { alert(item + " — coming soon!"); } }} style={{ cursor: "pointer",
            padding: "13px 14px", marginBottom: 6,
            ...skeuo.card,
            fontSize: 14, fontFamily: SANS, position: "relative", overflow: "hidden",
            color: item === "Sign Out" ? C.rose : C.textSec, cursor: "pointer",
          }}>
            <div style={skeuo.gloss} />
            <span style={{ position: "relative", zIndex: 1 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
