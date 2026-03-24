"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../components/AuthContext";
import { C, SERIF, SANS, MONO, skeuo } from "../../../../components/design";
import { FilmGrain, CheckIcon, NfcIcon } from "../../../../components/Icons";

export default function SampleCLinkPage({ params }) {
  const { chipId } = params;
  const { session, loading, isAuthenticated } = useAuth();
  const [status, setStatus] = useState("loading");
  const [cardResult, setCardResult] = useState(null);
  const [error, setError] = useState("");
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!chipId) { setStatus("error"); setError("No chip ID found."); return; }

    if (!isAuthenticated || !session?.access_token) {
      try { localStorage.setItem("pendingChip", chipId); } catch (e) {}
      setStatus("needsAuth");
      return;
    }

    const link = async () => {
      try {
        setStatus("linking");
        const res = await fetch("/api/link/sample-c", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + session.access_token },
          body: JSON.stringify({ chipId }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 409) {
            setCardResult(data.card);
            if (data.ownerName) setOwnerName(data.ownerName);
            if (data.error && data.error.includes("another")) setStatus("taken");
            else if (data.error && data.error.includes("1/1")) setStatus("takenUltra");
            else setStatus("already");
            const isUltra = data.error && data.error.includes("1/1");
            setTimeout(goToVault, isUltra ? 5000 : 3000);
            return;
          }
          setStatus("error");
          setError(data.error || "Failed to link card");
          return;
        }

        try { localStorage.removeItem("pendingChip"); } catch (e) {}
        setCardResult(data.card);
        const isUltra = data.cardType === "ultra_rare";
        setStatus(isUltra ? "successUltra" : "success");
        if (isUltra) {
          try { navigator.vibrate([80, 40, 80, 40, 200]); } catch (e) {}
        } else {
          try { navigator.vibrate([100, 50, 100]); } catch (e) {}
        }
        setTimeout(goToVault, isUltra ? 5000 : 3500);
      } catch (e) {
        setStatus("error");
        setError("Network error. Please try again.");
      }
    };
    link();
  }, [chipId, session, loading, isAuthenticated]);

  const goToVault = () => { window.location.href = "/"; };

  const showUltraReveal = status === "successUltra" || status === "takenUltra";
  const ultraHeadline = status === "successUltra" ? "YOU FOUND IT" : "YOUR 1 OF 1";

  const wrapStyle = {
    height: "100%", width: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: showUltraReveal
      ? "radial-gradient(ellipse at 50% 45%, #1C1608, #0E0D0B 75%)"
      : "radial-gradient(ellipse at 50% 40%, #151312, " + C.bg + ")",
    position: "relative", overflow: "hidden",
  };
  const circleBase = {
    width: 120, height: 120, margin: "0 auto", ...skeuo.inset,
    borderRadius: "50%", border: "1.5px solid " + C.accent + "44",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  const headingStyle = {
    marginTop: 24, fontSize: 18, fontWeight: 300, color: C.cream,
    fontFamily: SERIF, textShadow: "0 1px 3px rgba(0,0,0,0.4)",
  };

  const ultraKeyframes = `
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px #D4AF3744}50%{box-shadow:0 0 40px #D4AF3788}}
    @keyframes glowPulse{0%,100%{opacity:0.7;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}}
    @keyframes burstIn{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}
    @keyframes sparkleDance{0%,100%{opacity:0;transform:scale(0.4) rotate(0deg) translateY(0)}30%{opacity:0.9;transform:scale(1) rotate(15deg) translateY(-4px)}70%{opacity:0.6;transform:scale(0.8) rotate(-10deg) translateY(2px)}}
    @keyframes cardReveal{from{opacity:0;transform:scale(0.65) rotateY(20deg)}to{opacity:1;transform:scale(1) rotateY(0deg)}}
    @keyframes ringPulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.025)}}
    @keyframes shimmer{0%{background-position:-250% 0}100%{background-position:250% 0}}
    @keyframes starSpin{to{transform:rotate(360deg)}}
    @keyframes fadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  `;

  const sparkles = [
    { x: "12%", y: "18%", sz: "10px", dur: "3.2s", delay: "0.2s" },
    { x: "80%", y: "14%", sz: "8px",  dur: "2.8s", delay: "0.7s" },
    { x: "88%", y: "62%", sz: "11px", dur: "3.6s", delay: "0.4s" },
    { x: "8%",  y: "70%", sz: "9px",  dur: "2.5s", delay: "1.0s" },
    { x: "50%", y: "8%",  sz: "7px",  dur: "3.0s", delay: "1.3s" },
  ];

  return (
    <div style={{
      width: "100%", height: "100dvh", background: "#000", fontFamily: SANS,
      overflow: "hidden", position: "relative", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      <style>{ultraKeyframes}</style>
      <div style={wrapStyle}>
        <FilmGrain opacity={showUltraReveal ? 0.03 : 0.04} />

        {/* ── ULTRA RARE REVEAL (successUltra + takenUltra) ── */}
        {showUltraReveal && (
          <>
            {/* Radial gold glow */}
            <div style={{
              position: "absolute", width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(228,188,74,0.14) 0%, rgba(228,188,74,0.04) 45%, transparent 70%)",
              top: "50%", left: "50%",
              animation: "glowPulse 3s ease-in-out infinite",
            }} />

            {/* Starburst SVG */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", animation: "burstIn 1.2s cubic-bezier(0.22,1,0.36,1) both" }} viewBox="0 0 390 844" fill="none">
              {[0,30,60,90,120,150].map(deg => (
                <line key={deg}
                  x1="195" y1="422"
                  x2={195 + 320 * Math.cos((deg * Math.PI) / 180)}
                  y2={422 + 320 * Math.sin((deg * Math.PI) / 180)}
                  stroke="rgba(228,188,74,0.07)" strokeWidth="1"
                />
              ))}
              {[15,45,75,105,135,165].map(deg => (
                <line key={deg + 200}
                  x1="195" y1="422"
                  x2={195 + 220 * Math.cos((deg * Math.PI) / 180)}
                  y2={422 + 220 * Math.sin((deg * Math.PI) / 180)}
                  stroke="rgba(228,188,74,0.04)" strokeWidth="0.5"
                />
              ))}
            </svg>

            {/* Floating sparkles */}
            {sparkles.map((s, i) => (
              <div key={i} style={{
                position: "absolute", color: "#E4BC4A", fontSize: s.sz,
                left: s.x, top: s.y, pointerEvents: "none",
                animation: `sparkleDance ${s.dur} ease-in-out ${s.delay} infinite`,
              }}>✦</div>
            ))}

            {/* Badge pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "6px 16px", borderRadius: 100,
              background: "linear-gradient(135deg, rgba(228,188,74,0.14), rgba(228,188,74,0.04))",
              border: "1px solid rgba(228,188,74,0.45)",
              marginBottom: 22, position: "relative", zIndex: 10,
              animation: "fadeDown 0.5s ease 0.4s both",
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="#E4BC4A"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: "#E4BC4A", fontWeight: 600 }}>1 OF 1 \u00b7 ULTRA RARE</span>
            </div>

            {/* Card with rings */}
            <div style={{ position: "relative", zIndex: 10, marginBottom: 28, animation: "cardReveal 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.6s both" }}>
              {/* Outer ring */}
              <div style={{ position: "absolute", inset: -18, borderRadius: 30, border: "1px solid rgba(228,188,74,0.2)", animation: "ringPulse 2.5s ease-in-out 1.5s infinite" }} />
              {/* Inner ring */}
              <div style={{ position: "absolute", inset: -8, borderRadius: 22, border: "1.5px solid rgba(228,188,74,0.45)", boxShadow: "0 0 20px rgba(228,188,74,0.15)", animation: "ringPulse 2.5s ease-in-out 1.7s infinite" }} />
              {/* Card face */}
              <div style={{
                width: 150, height: 200, borderRadius: 14,
                background: "linear-gradient(145deg, #2A2416, #1E1A0E, #2A2416)",
                border: "1px solid rgba(228,188,74,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
                boxShadow: "0 0 40px rgba(228,188,74,0.25), 0 24px 60px rgba(0,0,0,0.9)",
              }}>
                {/* Shimmer sweep */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(105deg, transparent 30%, rgba(228,188,74,0.18) 48%, rgba(255,255,220,0.12) 50%, rgba(228,188,74,0.18) 52%, transparent 70%)",
                  backgroundSize: "250% 100%",
                  animation: "shimmer 2.8s ease 1.2s infinite",
                }} />
                {/* Corner ornaments */}
                {[
                  { top: 8, left: 8, borderTopWidth: "1.5px", borderLeftWidth: "1.5px" },
                  { top: 8, right: 8, borderTopWidth: "1.5px", borderRightWidth: "1.5px" },
                  { bottom: 8, left: 8, borderBottomWidth: "1.5px", borderLeftWidth: "1.5px" },
                  { bottom: 8, right: 8, borderBottomWidth: "1.5px", borderRightWidth: "1.5px" },
                ].map((c, i) => (
                  <div key={i} style={{
                    position: "absolute", width: 14, height: 14,
                    borderColor: "rgba(228,188,74,0.6)", borderStyle: "solid", borderWidth: 0,
                    ...c,
                  }} />
                ))}
                {/* Star */}
                <svg style={{ animation: "starSpin 8s linear infinite", position: "relative", zIndex: 1 }} width="44" height="44" viewBox="0 0 24 24" fill="rgba(228,188,74,0.7)">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>

            {/* Headline */}
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, letterSpacing: 5, color: C.cream, lineHeight: 1.1, marginBottom: 10, position: "relative", zIndex: 10, animation: "fadeUp 0.55s ease 1.1s both" }}>
              {ultraHeadline}
            </div>

            {/* Perspective name */}
            {cardResult && (
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.megaGold, marginBottom: 6, position: "relative", zIndex: 10, animation: "fadeUp 0.55s ease 1.2s both" }}>
                {cardResult.perspective === "J&J" ? "Jack & Jack" : cardResult.perspective}
              </div>
            )}

            {/* Song meta */}
            {cardResult && (
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 2.5, color: C.textDim, marginBottom: 20, position: "relative", zIndex: 10, animation: "fadeUp 0.55s ease 1.3s both" }}>
                ULTRA RARE \u00b7 {(cardResult.songTitle || "").toUpperCase()}
              </div>
            )}

            <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: 1, color: "#4A4540", marginBottom: 22, position: "relative", zIndex: 10, animation: "fadeUp 0.55s ease 1.4s both" }}>
              Redirecting to vault...
            </div>

            <button onClick={goToVault} style={{
              padding: "14px 40px",
              background: "linear-gradient(135deg, #E4BC4A 0%, #C8A030 100%)",
              color: "#0E0D0B", fontFamily: MONO, fontSize: 9, letterSpacing: 4, fontWeight: 700,
              border: "none", borderRadius: 10, cursor: "pointer",
              boxShadow: "0 4px 24px rgba(228,188,74,0.35), 0 1px 0 rgba(255,255,255,0.2) inset",
              position: "relative", zIndex: 10, animation: "fadeUp 0.55s ease 1.5s both",
            }}>OPEN VAULT</button>
          </>
        )}

        {/* ── LOADING ── */}
        {status === "loading" && (
          <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={circleBase}><NfcIcon size={36} color={C.accent} /></div>
            <div style={headingStyle}>Linking card...</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: MONO, letterSpacing: 2, marginTop: 8 }}>{chipId}</div>
          </div>
        )}

        {/* ── LINKING ── */}
        {status === "linking" && (
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid " + C.accent + "22", borderTopColor: C.accent, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <div style={{ color: C.textDim, fontFamily: MONO, fontSize: 11, letterSpacing: 2, marginTop: 20 }}>LINKING TO VAULT</div>
          </div>
        )}

        {/* ── NEEDS AUTH ── */}
        {status === "needsAuth" && (
          <div style={{ textAlign: "center", zIndex: 1, padding: "0 32px" }}>
            <div style={circleBase}><NfcIcon size={36} color={C.accent} /></div>
            <div style={headingStyle}>Sign in to link this card</div>
            <div style={{ fontSize: 13, color: C.textSec, fontFamily: SANS, marginTop: 8, lineHeight: 1.5 }}>Create an account or sign in, then tap this card again.</div>
            <button onClick={goToVault} style={{ marginTop: 28, padding: "13px 40px", ...skeuo.btnGold, color: C.bg, fontSize: 10, fontFamily: MONO, fontWeight: 600, letterSpacing: 3, cursor: "pointer" }}>SIGN IN</button>
          </div>
        )}

        {/* ── ALREADY / TAKEN ── */}
        {(status === "already" || status === "taken") && (
          <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(145deg,#2A2520,#1E1B17)", border: "1.5px solid " + C.accent + "44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginTop: 20 }}>
              {status === "already" ? "Already Collected" : "Card Unavailable"}
            </div>
            {cardResult && (
              <>
                <div style={{ fontFamily: SANS, fontSize: 14, color: C.accent, marginTop: 8 }}>
                  {cardResult.perspective} \u00b7 {cardResult.rarity}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 6 }}>
                  {status === "already" ? "This card is already in your vault" : "This card is connected to another collector"}
                </div>
              </>
            )}
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
            <button onClick={goToVault} style={{ marginTop: 28, padding: "14px 44px", background: "linear-gradient(145deg,#2A2520,#1E1B17)", color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4, fontWeight: 400, border: "1px solid " + C.accent + "33", borderRadius: 8, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        )}

        {/* ── SUCCESS (regular card) ── */}
        {status === "success" && (
          <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={{ width: 64, height: 64, ...skeuo, borderRadius: "50%", border: "2px solid " + C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <CheckIcon size={24} color={C.teal} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 20, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>Card Added</div>
            {cardResult && (
              <>
                <div style={{ fontSize: 15, color: C.accent, fontFamily: SANS, marginTop: 8 }}>{cardResult.perspective === "J&J" ? "Jack & Jack" : cardResult.perspective}</div>
                <div style={{ fontSize: 10, color: C.textDim, fontFamily: MONO, letterSpacing: 2, marginTop: 6 }}>{cardResult.rarity.toUpperCase()} \u00b7 {cardResult.songTitle.toUpperCase()}</div>
              </>
            )}
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: MONO, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
            <button onClick={goToVault} style={{ marginTop: 28, padding: "14px 44px", background: "linear-gradient(145deg,#2A2520,#1E1B17)", color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4, fontWeight: 400, border: "1px solid " + C.accent + "33", borderRadius: 8, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === "error" && (
          <div style={{ textAlign: "center", zIndex: 1, padding: "0 32px" }}>
            <div style={{ width: 64, height: 64, ...skeuo.inset, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", border: "1.5px solid " + C.rose + "33" }}>
              <span style={{ fontSize: 28, color: C.rose }}>!</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 20, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>Something went wrong</div>
            <div style={{ fontSize: 12, color: C.rose, fontFamily: MONO, letterSpacing: 1, marginTop: 12, maxWidth: 280 }}>{error}</div>
            <button onClick={goToVault} style={{ marginTop: 32, padding: "13px 40px", ...skeuo.btnGhost, color: C.accent, fontSize: 10, fontFamily: MONO, letterSpacing: 3, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        )}
      </div>
    </div>
  );
}
