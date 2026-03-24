"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const C = {
  bg: "#0E0D0B", cream: "#F5F0E8", accent: "#A2A0B4",
  text: "#D4CBBA", textDim: "#7A7265", textSec: "#8B8177",
  teal: "#4ECDC4", rose: "#E8665A", gold: "#E4BC4A",
};
const SERIF = "'Playfair Display', Georgia, serif";
const MONO = "'JetBrains Mono', 'SF Mono', monospace";
const SANS = "'Inter', -apple-system, sans-serif";

export default function ScanLinkPage() {
  const { chipId } = useParams();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname === "symbiosis-vault.vercel.app") {
      window.location.replace("https://vault.jackandjack.store" + window.location.pathname + window.location.search);
    }
  }, []);

  const [status, setStatus] = useState("loading");
  const [cardInfo, setCardInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chipId) return;
    handleScan();
  }, [chipId]);

  // Auto-redirect — give ultra rare owners extra time to enjoy the reveal
  useEffect(() => {
    if (status === "success" || status === "already" || status === "taken") {
      const isUR = cardInfo?.rarity === "ultra_rare" && (status === "success" || status === "already");
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") window.location.href = "/?from=scan";
      }, isUR ? 5000 : 2000);
      return () => clearTimeout(timer);
    }
  }, [status, cardInfo]);

  async function handleScan() {
    try {
      const { supabase } = await import("../../../lib/supabase");
      if (!supabase) { setStatus("error"); setError("App not configured"); return; }

      let session = null;
      const { data: sData } = await supabase.auth.getSession();
      session = sData?.session;
      if (!session) {
        session = await new Promise((resolve) => {
          const t = setTimeout(() => resolve(null), 2500);
          const { data: { subscription } } = supabase.auth.onAuthStateChange((ev, s) => {
            if (s) { clearTimeout(t); subscription.unsubscribe(); resolve(s); }
          });
        });
      }
      if (!session) {
        if (typeof window !== "undefined") localStorage.setItem("pendingChipId", chipId);
        setStatus("login");
        return;
      }

      setStatus("linking");
      const res = await fetch("/api/cards/link", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + session.access_token },
        body: JSON.stringify({ chipId }),
      });
      const data = await res.json();

      if (res.ok) {
        setCardInfo(data.card);
        setStatus("success");
        if (typeof window !== "undefined" && window.navigator?.vibrate) {
          window.navigator.vibrate(data.card?.rarity === "ultra_rare" ? [80, 40, 80, 40, 200] : [100, 50, 100]);
        }
      } else if (res.status === 401) {
        if (typeof window !== "undefined") localStorage.setItem("pendingChipId", chipId);
        setStatus("login");
      } else if (res.status === 409) {
        setCardInfo(data.card);
        if (data.error && data.error.includes("another account")) { setStatus("taken"); } else { setStatus("already"); }
        if (typeof window !== "undefined" && window.navigator?.vibrate) {
          window.navigator.vibrate(data.card?.rarity === "ultra_rare" ? [80, 40, 80, 40, 200] : 50);
        }
      } else if (res.status === 404) { setStatus("error"); setError("Card not recognized"); }
      else { setStatus("error"); setError(data.error || "Something went wrong"); }
    } catch (err) { setStatus("error"); setError("Connection error"); }
  }

  const goToApp = () => { if (typeof window !== "undefined") window.location.href = "/?from=scan"; };

  const Spinner = () => (
    <div style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${C.accent}22`, borderTopColor: C.accent, animation: "spin 1s linear infinite" }} />
  );

  const Icon = ({ children, borderColor }) => (
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(145deg, #2A2520, #1E1B17)", border: `1.5px solid ${borderColor || C.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
      {children}
    </div>
  );

  const Btn = ({ onClick, label, gold }) => (
    <button onClick={onClick} style={{ marginTop: 28, padding: "14px 44px", background: gold ? `linear-gradient(135deg, ${C.accent}, #9290A6)` : "linear-gradient(145deg, #2A2520, #1E1B17)", color: gold ? C.bg : C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4, fontWeight: gold ? 600 : 400, border: gold ? "none" : `1px solid ${C.accent}33`, borderRadius: 8, cursor: "pointer" }}>
      {label}
    </button>
  );

  const SPARKLES = [
    { x:"8%",  y:"12%", sz:13, dur:3.2, delay:0.8 },
    { x:"82%", y:"16%", sz:9,  dur:2.7, delay:1.3 },
    { x:"4%",  y:"55%", sz:11, dur:3.5, delay:0.4 },
    { x:"88%", y:"50%", sz:7,  dur:2.9, delay:2.0 },
    { x:"15%", y:"80%", sz:10, dur:3.1, delay:0.2 },
    { x:"75%", y:"76%", sz:8,  dur:2.6, delay:1.7 },
    { x:"48%", y:"6%",  sz:6,  dur:3.4, delay:1.1 },
    { x:"38%", y:"88%", sz:9,  dur:2.8, delay:0.6 },
  ];

  // Show spectacular reveal for ultra rare — both on first scan AND re-scan
  const showUltraReveal = cardInfo?.rarity === "ultra_rare" && (status === "success" || status === "already");
  const ultraHeadline = status === "success" ? "You Found It" : "Your 1 of 1";

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflowY: "auto", background: `radial-gradient(ellipse at 50% 30%, #1A1816 0%, ${C.bg} 70%)`, fontFamily: SANS, textAlign: "center", padding: "0 32px" }}>

      {(status === "loading") && (<><Spinner /><div style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, letterSpacing: 2, marginTop: 20 }}>READING CARD...</div></>)}
      {(status === "linking") && (<><Spinner /><div style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, letterSpacing: 2, marginTop: 20 }}>LINKING TO VAULT...</div></>)}

      {/* ── Ultra Rare spectacular reveal (first scan + re-scan) ── */}
      {showUltraReveal && (
        <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 28px", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(228,188,74,0.14) 0%, rgba(228,188,74,0.04) 45%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "glowPulse 3s ease-in-out infinite" }} />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "burstIn 1.2s cubic-bezier(0.22,1,0.36,1) both" }} viewBox="0 0 390 844" fill="none">
            <line x1="195" y1="422" x2="195" y2="0"   stroke="rgba(228,188,74,0.05)" strokeWidth="1"/>
            <line x1="195" y1="422" x2="195" y2="844"  stroke="rgba(228,188,74,0.05)" strokeWidth="1"/>
            <line x1="195" y1="422" x2="0"   y2="422"  stroke="rgba(228,188,74,0.05)" strokeWidth="1"/>
            <line x1="195" y1="422" x2="390" y2="422"  stroke="rgba(228,188,74,0.05)" strokeWidth="1"/>
            <line x1="195" y1="422" x2="0"   y2="0"    stroke="rgba(228,188,74,0.04)" strokeWidth="1"/>
            <line x1="195" y1="422" x2="390" y2="0"    stroke="rgba(228,188,74,0.04)" strokeWidth="1"/>
            <line x1="195" y1="422" x2="0"   y2="844"  stroke="rgba(228,188,74,0.04)" strokeWidth="1"/>
            <line x1="195" y1="422" x2="390" y2="844"  stroke="rgba(228,188,74,0.04)" strokeWidth="1"/>
          </svg>
          {SPARKLES.map((s, i) => (
            <span key={i} style={{ position: "absolute", color: C.gold, fontSize: s.sz, left: s.x, top: s.y, pointerEvents: "none", animation: `sparkleDance ${s.dur}s ease-in-out ${s.delay}s infinite` }}>✦</span>
          ))}
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 16px", borderRadius: 100, background: "linear-gradient(135deg, rgba(228,188,74,0.14), rgba(228,188,74,0.04))", border: "1px solid rgba(228,188,74,0.45)", marginBottom: 22, animation: "fadeDown 0.5s ease 0.4s both" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill={C.gold}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: C.gold, fontWeight: 600 }}>1 OF 1 &nbsp;·&nbsp; ULTRA RARE</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill={C.gold}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div style={{ position: "relative", marginBottom: 28, animation: "cardReveal 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.6s both" }}>
              <div style={{ position: "absolute", inset: -18, borderRadius: 30, border: "1px solid rgba(228,188,74,0.2)", animation: "ringPulse 2.5s ease-in-out 1.5s infinite" }} />
              <div style={{ position: "absolute", inset: -8, borderRadius: 22, border: "1.5px solid rgba(228,188,74,0.45)", boxShadow: "0 0 20px rgba(228,188,74,0.15)", animation: "ringPulse 2.5s ease-in-out 1.7s infinite" }} />
              <div style={{ width: 150, height: 200, borderRadius: 14, background: "linear-gradient(145deg, #2A2416, #1E1A0E, #2A2416)", border: "1px solid rgba(228,188,74,0.35)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 0 40px rgba(228,188,74,0.25), 0 24px 60px rgba(0,0,0,0.9)" }}>
                {[["8px",null,"8px",null],["8px",null,null,"8px"],[null,"8px","8px",null],[null,"8px",null,"8px"]].map(([t,r,b,l],i) => (
                  <div key={i} style={{ position:"absolute", width:14, height:14, top:t||undefined, right:r||undefined, bottom:b||undefined, left:l||undefined, borderColor:"rgba(228,188,74,0.6)", borderStyle:"solid", borderWidth:0, ...(t&&l?{borderTopWidth:1.5,borderLeftWidth:1.5}:t&&r?{borderTopWidth:1.5,borderRightWidth:1.5}:b&&l?{borderBottomWidth:1.5,borderLeftWidth:1.5}:{borderBottomWidth:1.5,borderRightWidth:1.5}) }} />
                ))}
                {cardInfo?.imageUrl ? (
                  <img src={cardInfo.imageUrl} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} alt="" />
                ) : (
                  <svg style={{ animation: "starSpin 8s linear infinite" }} width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                )}
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg, transparent 30%, rgba(228,188,74,0.18) 48%, rgba(255,255,220,0.12) 50%, rgba(228,188,74,0.18) 52%, transparent 70%)", backgroundSize:"250% 100%", animation:"shimmer 2.8s ease 1.2s infinite" }} />
              </div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", color: C.cream, lineHeight: 1.1, marginBottom: 10, animation: "fadeUp 0.55s ease 1.1s both" }}>{ultraHeadline}</div>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.gold, marginBottom: 6, animation: "fadeUp 0.55s ease 1.2s both" }}>{cardInfo?.perspective}</div>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "2.5px", color: "#5A5248", marginBottom: 20, animation: "fadeUp 0.55s ease 1.3s both", textTransform: "uppercase" }}>ULTRA RARE · {cardInfo?.songTitle || "1 OF 1"}</div>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1, color: "#4A4540", marginBottom: 22, opacity: 0.6, animation: "fadeUp 0.55s ease 1.4s both" }}>Redirecting to vault...</div>
            <button onClick={goToApp} style={{ padding: "14px 40px", background: "linear-gradient(135deg, #E4BC4A 0%, #C8A030 100%)", color: C.bg, fontFamily: MONO, fontSize: 9, letterSpacing: 4, fontWeight: 700, border: "none", borderRadius: 10, cursor: "pointer", boxShadow: "0 4px 24px rgba(228,188,74,0.35), 0 1px 0 rgba(255,255,255,0.2) inset", animation: "fadeUp 0.55s ease 1.5s both" }}>OPEN VAULT</button>
          </div>
        </div>
      )}

      {/* ── Normal card success ── */}
      {status === "success" && !showUltraReveal && (
        <div style={{ animation: "fadeUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Icon borderColor={C.teal}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </Icon>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 24, color: C.cream, marginTop: 20 }}>Card Added</div>
          {cardInfo && (<>
            <div style={{ fontFamily: SANS, fontSize: 15, color: C.accent, marginTop: 8 }}>{cardInfo.perspective}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}>{cardInfo.rarity} CARD</div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 8, opacity: 0.5 }}>{cardInfo.songTitle ? cardInfo.songTitle.toUpperCase() : "SAMPLE A"}</div>
          </>)}
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
          <Btn onClick={goToApp} label="OPEN VAULT" />
        </div>
      )}

      {/* ── Already collected (non-ultra-rare) ── */}
      {status === "already" && !showUltraReveal && (
        <div style={{ animation: "fadeUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Icon>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </Icon>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginTop: 20 }}>Already Collected</div>
          {cardInfo && (<div style={{ fontFamily: SANS, fontSize: 14, color: C.accent, marginTop: 8 }}>{cardInfo.perspective} &middot; {cardInfo.rarity}</div>)}
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 6 }}>This card is already in your vault</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
          <Btn onClick={goToApp} label="OPEN VAULT" />
        </div>
      )}

      {status === "taken" && (
        <div style={{ animation: "fadeUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Icon>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </Icon>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginTop: 20 }}>Card Unavailable</div>
          {cardInfo && (<div style={{ fontFamily: SANS, fontSize: 14, color: C.accent, marginTop: 8 }}>{cardInfo.perspective} &middot; {cardInfo.rarity}</div>)}
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 6 }}>This card is connected to another collector</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
          <Btn onClick={goToApp} label="OPEN VAULT" />
        </div>
      )}

      {status === "login" && (
        <div style={{ animation: "fadeUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Icon>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
            </Icon>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginTop: 20 }}>Sign In to Collect</div>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 8, lineHeight: 1.5 }}>Sign in or create your vault to add this card</div>
          <Btn onClick={goToApp} label="SIGN IN" gold />
        </div>
      )}

      {status === "error" && (
        <div style={{ animation: "fadeUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Icon borderColor={C.rose}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </Icon>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginTop: 20 }}>Scan Error</div>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 8 }}>{error}</div>
          <Btn onClick={goToApp} label="OPEN VAULT" />
        </div>
      )}

      <style>{`
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes fadeUp    { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeDown  { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0%,100% { opacity:.7; transform:translate(-50%,-50%) scale(1); } 50% { opacity:1; transform:translate(-50%,-50%) scale(1.08); } }
        @keyframes burstIn   { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
        @keyframes sparkleDance { 0%,100% { opacity:0; transform:scale(0.4) rotate(0deg) translateY(0); } 30% { opacity:0.9; transform:scale(1) rotate(15deg) translateY(-4px); } 70% { opacity:0.6; transform:scale(0.8) rotate(-10deg) translateY(2px); } }
        @keyframes cardReveal { from { opacity:0; transform:scale(0.65) rotateY(20deg); } to { opacity:1; transform:scale(1) rotateY(0deg); } }
        @keyframes ringPulse  { 0%,100% { opacity:.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.025); } }
        @keyframes shimmer    { 0% { background-position:-250% 0; } 100% { background-position:250% 0; } }
        @keyframes starSpin   { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}