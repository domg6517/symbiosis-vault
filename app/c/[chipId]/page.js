"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const C = {
  bg: "#0E0D0B", cream: "#F5F0E8", accent: "#e4bc4a",
  text: "#D4CBBA", textDim: "#7A7265", textSec: "#8B8177",
  teal: "#4ECDC4", rose: "#E8665A",
};
const SERIF = "'Playfair Display', Georgia, serif";
const MONO = "'JetBrains Mono', 'SF Mono', monospace";
const SANS = "'Inter', -apple-system, sans-serif";

export default function ScanLinkPage() {
  const { chipId } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [cardInfo, setCardInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chipId) return;
    handleScan();
  }, [chipId]);

  async function handleScan() {
    try {
      const { supabase } = await import("../../../lib/supabase");
      if (!supabase) {
        setStatus("error");
        setError("App not configured");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (typeof window !== "undefined") {
          localStorage.setItem("pendingChipId", chipId);
        }
        setStatus("login");
        return;
      }

      setStatus("linking");
      const res = await fetch("/api/cards/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.access_token,
        },
        body: JSON.stringify({ chipId }),
      });

      const data = await res.json();

      if (res.ok) {
        setCardInfo(data.card);
        setStatus("success");
      } else if (res.status === 409) {
        setCardInfo(data.card);
        setStatus("already");
      } else if (res.status === 404) {
        setStatus("error");
        setError("Card not recognized");
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setStatus("error");
      setError("Connection error");
    }
  }

  const goToApp = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div style={{
      width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 32,
      background: `radial-gradient(ellipse at 50% 30%, #1A1816 0%, ${C.bg} 70%)`,
      fontFamily: SANS,
    }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: C.textDim, fontFamily: MONO, marginBottom: 4 }}>
        JACK &amp; JACK
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, fontStyle: "italic", marginBottom: 40 }}>
        Symbiosis Vault
      </div>

      {status === "loading" && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", margin: "0 auto 20px",
            border: `2px solid ${C.accent}33`, borderTopColor: C.accent,
            animation: "spin 1s linear infinite",
          }} />
          <div style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, letterSpacing: 2 }}>
            READING CARD...
          </div>
        </div>
      )}

      {status === "linking" && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", margin: "0 auto 20px",
            border: `2px solid ${C.accent}33`, borderTopColor: C.accent,
            animation: "spin 1s linear infinite",
          }} />
          <div style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, letterSpacing: 2 }}>
            LINKING TO VAULT...
          </div>
        </div>
      )}

      {status === "success" && (
        <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
            background: `linear-gradient(145deg, #2A2520, #1E1B17)`,
            border: `1.5px solid ${C.teal}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 30px ${C.teal}15`,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 24, color: C.cream, marginBottom: 8 }}>
            Card Added
          </div>
          {cardInfo && (
            <>
              <div style={{ fontFamily: SANS, fontSize: 14, color: C.accent, marginBottom: 4 }}>
                {cardInfo.perspective}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2, textTransform: "uppercase" }}>
                {cardInfo.rarity} {cardInfo.type}
              </div>
            </>
          )}
          <button onClick={goToApp} style={{
            marginTop: 32, padding: "14px 40px", background: `linear-gradient(145deg, #2A2520, #1E1B17)`,
            color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4,
            border: `1px solid ${C.accent}33`, borderRadius: 8, cursor: "pointer",
          }}>OPEN VAULT</button>
        </div>
      )}

      {status === "already" && (
        <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
            background: `linear-gradient(145deg, #2A2520, #1E1B17)`,
            border: `1.5px solid ${C.accent}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginBottom: 8 }}>
            Already Collected
          </div>
          {cardInfo && (
            <div style={{ fontFamily: SANS, fontSize: 14, color: C.accent, marginBottom: 4 }}>
              {cardInfo.perspective} &middot; {cardInfo.rarity}
            </div>
          )}
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginBottom: 24 }}>
            This card is already in your vault
          </div>
          <button onClick={goToApp} style={{
            padding: "14px 40px", background: `linear-gradient(145deg, #2A2520, #1E1B17)`,
            color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4,
            border: `1px solid ${C.accent}33`, borderRadius: 8, cursor: "pointer",
          }}>OPEN VAULT</button>
        </div>
      )}

      {status === "login" && (
        <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
            background: `linear-gradient(145deg, #2A2520, #1E1B17)`,
            border: `1.5px solid ${C.accent}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginBottom: 8 }}>
            Sign In to Collect
          </div>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginBottom: 8, lineHeight: 1.5 }}>
            Sign in or create your vault to add this card
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.accent, letterSpacing: 1, opacity: 0.6, marginBottom: 24 }}>
            {chipId}
          </div>
          <button onClick={goToApp} style={{
            padding: "14px 40px",
            background: `linear-gradient(135deg, ${C.accent}, #c9a23a)`,
            color: C.bg, fontFamily: MONO, fontSize: 10, letterSpacing: 4,
            fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer",
          }}>SIGN IN</button>
        </div>
      )}

      {status === "error" && (
        <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
            background: `linear-gradient(145deg, #2A2520, #1E1B17)`,
            border: `1.5px solid ${C.rose}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginBottom: 8 }}>
            Scan Error
          </div>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginBottom: 24 }}>
            {error}
          </div>
          <button onClick={goToApp} style={{
            padding: "14px 40px", background: `linear-gradient(145deg, #2A2520, #1E1B17)`,
            color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4,
            border: `1px solid ${C.accent}33`, borderRadius: 8, cursor: "pointer",
          }}>OPEN VAULT</button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
