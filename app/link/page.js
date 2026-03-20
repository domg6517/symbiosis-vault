"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { C, SERIF, SANS, MONO, skeuo } from "../../components/design";
import { FilmGrain, CheckIcon, NfcIcon } from "../../components/Icons";

function LinkContent() {
  const searchParams = useSearchParams();
  const chipId = searchParams.get("chip");
  const { session, loading, isAuthenticated } = useAuth();
  const [status, setStatus] = useState("loading");
  const [cardResult, setCardResult] = useState(null);
  const [error, setError] = useState("");
  const [isSetComplete, setIsSetComplete] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!chipId) {
      setStatus("error");
      setError("No chip ID found in URL.");
      return;
    }
    if (!isAuthenticated || !session?.access_token) {
      // Save chip ID so we can link after sign-in
      try { localStorage.setItem("pendingChip", chipId); } catch(e) {}
      setStatus("needsAuth");
      return;
    }
    // Auto-link the card
    const link = async () => {
      try {
        setStatus("linking");
        const res = await fetch("/api/cards/link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ chipId }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 409 && data.card) {
            setCardResult(data.card);
            if (data.error && data.error.includes("another")) {
              setStatus("taken");
            } else {
              setStatus("already");
            }
            setTimeout(goToVault, 2000);
            return;
          }
          setStatus("error");
          setError(data.error || "Failed to link card");
          return;
        }
        // Clear any pending chip
        try { localStorage.removeItem("pendingChip"); } catch(e) {}
        setCardResult(data.card);
      setTimeout(goToVault, 3000);
        setIsSetComplete(data.setComplete || false);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError("Network error. Please try again.");
      }
    };
    link();
  }, [chipId, session, loading, isAuthenticated]);

  const goToVault = () => {
    window.location.href = "/";
  };

  const wrapStyle = {
    height: "100%", width: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: `radial-gradient(ellipse at 50% 40%, #151312, ${C.bg})`,
    position: "relative", overflow: "hidden",
  };
  const circleBase = {
    width: 120, height: 120, margin: "0 auto", ...skeuo.inset,
    borderRadius: "50%", border: `1.5px solid ${C.accent}44`,
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  const headingStyle = {
    marginTop: 24, fontSize: 18, fontWeight: 300, color: C.cream,
    fontFamily: SERIF, textShadow: "0 1px 3px rgba(0,0,0,0.4)",
  };

  return (
    <div style={{
      width: "100%", height: "100dvh", background: "#000", fontFamily: SANS,
      overflow: "hidden", position: "relative", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }"}</style>
      <div style={wrapStyle}>
        <FilmGrain opacity={0.04} />

        {status === "loading" && (
          <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={circleBase}>
              <NfcIcon size={36} color={C.accent} />
            </div>
            <div style={headingStyle}>Linking card...</div>
            <div style={{
              fontSize: 10, color: C.textDim, fontFamily: MONO,
              letterSpacing: 2, marginTop: 8,
            }}>{chipId}</div>
          </div>
        )}

        {status === "needsAuth" && (
          <div style={{ textAlign: "center", zIndex: 1, padding: "0 32px" }}>
            <div style={circleBase}>
              <NfcIcon size={36} color={C.accent} />
            </div>
            <div style={headingStyle}>Sign in to link this card</div>
            <div style={{
              fontSize: 13, color: C.textSec, fontFamily: SANS,
              marginTop: 8, lineHeight: 1.5,
            }}>Create an account or sign in, then tap this card again.</div>
            <div style={{
              fontSize: 11, color: C.textDim, fontFamily: SANS,
              marginTop: 6, lineHeight: 1.5,
            }}>Your card will be saved and linked automatically.</div>
            <button onClick={goToVault} style={{
              marginTop: 28, padding: "13px 40px", ...skeuo.btnGold,
              color: C.bg, fontSize: 10, fontFamily: MONO,
              fontWeight: 600, letterSpacing: 3, cursor: "pointer",
            }}>SIGN IN</button>
          </div>
        )}

        {(status === "already" || status === "taken") ? (
          <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(145deg, #2A2520, #1E1B17)", border: "1.5px solid " + C.accent + "44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginTop: 20 }}>{status === "taken" ? "Card Unavailable" : "Already Collected"}</div>
            {cardResult && (<>
              <div style={{ fontFamily: SANS, fontSize: 14, color: C.accent, marginTop: 8 }}>{cardResult.perspective} \u00B7 {cardResult.rarity}</div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 6 }}>{status === "taken" ? "This card is connected to another collector" : "This card is already in your vault"}</div>
            </>)}
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
            <button onClick={goToVault} style={{ marginTop: 28, padding: "14px 44px", background: "linear-gradient(145deg, #2A2520, #1E1B17)", color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4, fontWeight: 400, border: "1px solid " + C.accent, borderRadius: 14, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        ) : status === "linking" ? (
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid " + C.accent + "22", borderTopColor: C.accent, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <div style={{ color: C.textDim, fontFamily: MONO, fontSize: 11, letterSpacing: 2, marginTop: 20 }}>LINKING TO VAULT</div>
          </div>
        ) : status === "success" && (
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <div style={{
              width: 64, height: 64, ...skeuo, borderRadius: "50%", border: "2px solid " + C.teal,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto",
            }}>
              <CheckIcon size={24} color={C.teal} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 20, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>Card Added</div>
              {cardResult && (<>
              <div style={{ fontSize: 15, color: C.accent, fontFamily: SANS, marginTop: 8 }}>{cardResult.perspective === "J&J" ? "Jack & Jack" : cardResult.perspective}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: MONO, letterSpacing: 2, marginTop: 6 }}>{cardResult.rarity.toUpperCase()} CARD</div>
              <div style={{ fontSize: 9, color: C.textDim, fontFamily: MONO, letterSpacing: 1, marginTop: 8, opacity: 0.5 }}>{cardResult.songTitle.toUpperCase()}</div>
              <div style={{ fontSize: 9, color: C.textDim, fontFamily: MONO, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
              </>
            )}
            {isSetComplete && (
              <div style={{
                marginTop: 16, padding: "10px 20px", ...skeuo.card,
                position: "relative", overflow: "hidden",
              }}>
                <div style={skeuo.gloss} />
                <div style={{
                  fontSize: 10, fontFamily: MONO, letterSpacing: 3,
                  color: "#A2A0B4", position: "relative", zIndex: 1,
                }}>SET COMPLETE &mdash; BADGE UNLOCKED</div>
              </div>
            )}
            <button onClick={goToVault} style={{ marginTop: 28, padding: "14px 44px", background: "linear-gradient(145deg, #2A2520, #1E1B17)", color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4, fontWeight: 400, border: "1px solid " + C.accent, borderRadius: 14, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        )}

        {status === "error" && (
          <div style={{ textAlign: "center", zIndex: 1, padding: "0 32px" }}>
            <div style={{
              width: 64, height: 64, ...skeuo.inset, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto", border: `1.5px solid ${C.rose}33`,
            }}>
              <span style={{ fontSize: 28, color: C.rose }}>!</span>
            </div>
            <div style={{
              fontSize: 18, fontWeight: 300, color: C.cream, fontFamily: SERIF,
              marginTop: 20, textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}>Something went wrong</div>
            <div style={{
              fontSize: 12, color: C.rose, fontFamily: MONO,
              letterSpacing: 1, marginTop: 12, maxWidth: 280,
            }}>{error}</div>
            <button onClick={goToVault} style={{
              marginTop: 32, padding: "13px 40px", ...skeuo.btnGhost,
              color: C.accent, fontSize: 10, fontFamily: MONO,
              letterSpacing: 3, cursor: "pointer",
            }}>OPEN VAULT</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LinkPage() {
  return (
    <Suspense fallback={<div style={{ background: "#000", width: "100%", height: "100dvh" }} />}>
      <LinkContent />
    </Suspense>
  );
}
