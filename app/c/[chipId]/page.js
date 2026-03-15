"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const C = {
  bg: "#0E0D0B", cream: "#F5F0E8", accent: "#A2A0B4",
  text: "#D4CBBA", textDim: "#7A7265", textSec: "#8B8177",
  teal: "#4ECDC4", rose: "#E8665A",
};
const SERIF = "'Playfair Display', Georgia, serif";
const MONO = "'JetBrains Mono', 'SF Mono', monospace";
const SANS = "'Inter', -apple-system, sans-serif";

export default function ScanLinkPage() {
  const { chipId } = useParams();
  const [status, setStatus] = useState("loading");
  const [cardInfo, setCardInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chipId) return;
    handleScan();
  }, [chipId]);

  // Auto-redirect to home after successful link
  useEffect(() => {
    if (status === "success" || status === "already") {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") window.location.href = "/?from=scan";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function handleScan() {
    try {
      const { supabase } = await import("../../../lib/supabase");
      if (!supabase) { setStatus("error"); setError("App not configured"); return; }

      const { data: { session } } = await supabase.auth.getSession();
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

      if (res.ok) { setCardInfo(data.card); setStatus("success");

      // Haptic feedback on success
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
      } }
      else if (res.status === 409) { setCardInfo(data.card); setStatus("already");
      // Light haptic for already collected
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(50);
      } }
      else if (res.status === 404) { setStatus("error"); setError("Card not recognized"); }
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
    <button onClick={onClick} style={{ marginTop: 28, padding: "14px 44px", background: gold ? `linear-gradient(135deg, ${C.accent}, #c9a23a)` : "linear-gradient(145deg, #2A2520, #1E1B17)", color: gold ? C.bg : C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4, fontWeight: gold ? 600 : 400, border: gold ? "none" : `1px solid ${C.accent}33`, borderRadius: 8, cursor: "pointer" }}>
      {label}
    </button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 50% 30%, #1A1816 0%, ${C.bg} 70%)`, fontFamily: SANS, textAlign: "center", padding: "0 32px" }}>

      {status === "loading" && (<><Spinner /><div style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, letterSpacing: 2, marginTop: 20 }}>READING CARD...</div></>)}

      {status === "linking" && (<><Spinner /><div style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, letterSpacing: 2, marginTop: 20 }}>LINKING TO VAULT...</div></>)}

      {status === "success" && (
        <div style={{ animation: "fadeUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Icon borderColor={C.teal}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </Icon>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 24, color: C.cream, marginTop: 20 }}>Card Added</div>
          {cardInfo && (<>
            <div style={{ fontFamily: SANS, fontSize: 15, color: C.accent, marginTop: 8 }}>{cardInfo.perspective}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}>{cardInfo.rarity} {cardInfo.type}</div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 8, opacity: 0.5 }}>TEST DROP 1</div>
          </>)}
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
          <Btn onClick={goToApp} label="OPEN VAULT" />
        </div>
      )}

      {status === "already" && (
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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
        }
