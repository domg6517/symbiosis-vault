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
            setStatus(data.error && data.error.includes("another") ? "taken" : data.error && data.error.includes("1/1") ? "takenUltra" : "already");
            setTimeout(goToVault, 3000);
            return;
          }
          setStatus("error");
          setError(data.error || "Failed to link card");
          return;
        }

        try { localStorage.removeItem("pendingChip"); } catch (e) {}
        setCardResult(data.card);
        setStatus(data.cardType === "ultra_rare" ? "successUltra" : "success");
        setTimeout(goToVault, 3500);
      } catch (e) {
        setStatus("error");
        setError("Network error. Please try again.");
      }
    };
    link();
  }, [chipId, session, loading, isAuthenticated]);

  const goToVault = () => { window.location.href = "/"; };

  const wrapStyle = {
    height: "100%", width: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "radial-gradient(ellipse at 50% 40%, #151312, " + C.bg + ")",
    position: "relative", overflow: "hidden",
  };
  const circleBase = {
    width: 120, height: 120, margin: "0 auto", ...skeuo.inset,
    borderRadius: "50%", border: "1.5px solid " + C.accent + "44",
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <div style={{
      width: "100%", height: "100dvh", background: "#000", fontFamily: SANS,
      overflow: "hidden", position: "relative", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes glow{0%,100%{box-shadow:0 0 20px #D4AF3744}50%{box-shadow:0 0 40px #D4AF3788}}"}</style>
      <div style={wrapStyle}>
        <FilmGrain opacity={0.04} />

        {(status === "loading" || status === "linking") && (
          <div style={{ textAlign: "center", zIndex: 1 }}>
            {status === "loading" ? (
              <div style={circleBase}><NfcIcon size={36} color={C.accent} /></div>
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid " + C.accent + "22", borderTopColor: C.accent, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            )}
            <div style={{ marginTop: 24, fontSize: 18, fontWeight: 300, color: C.cream, fontFamily: SERIF }}>
              {status === "linking" ? "Claiming card..." : "Linking card..."}
            </div>
          </div>
        )}

        {status === "needsAuth" && (
          <div style={{ textAlign: "center", zIndex: 1, padding: "0 32px" }}>
            <div style={circleBase}><NfcIcon size={36} color={C.accent} /></div>
            <div style={{ marginTop: 24, fontSize: 18, fontWeight: 300, color: C.cream, fontFamily: SERIF }}>Sign in to link this card</div>
            <div style={{ fontSize: 13, color: C.textSec, fontFamily: SANS, marginTop: 8, lineHeight: 1.5 }}>Create an account or sign in, then tap this card again.</div>
            <button onClick={goToVault} style={{ marginTop: 28, padding: "13px 40px", ...skeuo.btnGold, color: C.bg, fontSize: 10, fontFamily: MONO, fontWeight: 600, letterSpacing: 3, cursor: "pointer" }}>SIGN IN</button>
          </div>
        )}

        {(status === "already" || status === "taken" || status === "takenUltra") && (
          <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(145deg,#2A2520,#1E1B17)", border: "1.5px solid " + C.accent + "44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.cream, marginTop: 20 }}>
              {status === "already" ? "Already Collected" : "Card Unavailable"}
            </div>
            {cardResult && (
              <div style={{ fontFamily: SANS, fontSize: 14, color: C.accent, marginTop: 8 }}>
                {cardResult.perspective} {status === "takenUltra" ? "1/1" : "· " + cardResult.rarity}
              </div>
            )}
            {(status === "taken" || status === "takenUltra") && ownerName && (
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 6 }}>Owned by {ownerName}</div>
            )}
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.textDim, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
            <button onClick={goToVault} style={{ marginTop: 28, padding: "14px 44px", background: "linear-gradient(145deg,#2A2520,#1E1B17)", color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4, border: "1px solid " + C.accent + "33", borderRadius: 8, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        )}

        {status === "success" && (
          <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={{ width: 64, height: 64, ...skeuo, borderRadius: "50%", border: "2px solid " + C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <CheckIcon size={24} color={C.teal} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 20 }}>Card Added</div>
            {cardResult && (
              <>
                <div style={{ fontSize: 15, color: C.accent, fontFamily: SANS, marginTop: 8 }}>{cardResult.perspective === "J&J" ? "Jack & Jack" : cardResult.perspective}</div>
                <div style={{ fontSize: 10, color: C.textDim, fontFamily: MONO, letterSpacing: 2, marginTop: 6 }}>{cardResult.rarity.toUpperCase()} · {cardResult.songTitle.toUpperCase()}</div>
              </>
            )}
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: MONO, letterSpacing: 1, marginTop: 16, opacity: 0.4 }}>Redirecting to vault...</div>
            <button onClick={goToVault} style={{ marginTop: 28, padding: "14px 44px", background: "linear-gradient(145deg,#2A2520,#1E1B17)", color: C.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 4, border: "1px solid " + C.accent + "33", borderRadius: 8, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        )}

        {status === "successUltra" && (
          <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(145deg,#2A2520,#1A1714)", border: "2px solid " + C.megaGold, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", animation: "glow 2s ease infinite" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill={C.megaGold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div style={{ fontSize: 11, fontFamily: MONO, letterSpacing: 4, color: C.megaGold, marginTop: 24 }}>1 OF 1</div>
            <div style={{ fontSize: 28, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 8 }}>You found it.</div>
            {cardResult && (
              <>
                <div style={{ fontSize: 15, color: C.accent, fontFamily: SANS, marginTop: 10 }}>{cardResult.perspective === "J&J" ? "Jack & Jack" : cardResult.perspective} · {cardResult.songTitle}</div>
                <div style={{ fontSize: 10, color: C.megaGold, fontFamily: MONO, letterSpacing: 3, marginTop: 6 }}>SUPER RARE</div>
              </>
            )}
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: MONO, letterSpacing: 1, marginTop: 20, opacity: 0.4 }}>Redirecting to vault...</div>
            <button onClick={goToVault} style={{ marginTop: 28, padding: "14px 44px", background: "linear-gradient(145deg,#2A2520,#1A1714)", color: C.megaGold, fontFamily: MONO, fontSize: 10, letterSpacing: 4, border: "1px solid " + C.megaGold + "55", borderRadius: 8, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        )}

        {status === "error" && (
          <div style={{ textAlign: "center", zIndex: 1, padding: "0 32px" }}>
            <div style={{ width: 64, height: 64, ...skeuo.inset, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", border: "1.5px solid " + C.rose + "33" }}>
              <span style={{ fontSize: 28, color: C.rose }}>!</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 20 }}>Something went wrong</div>
            <div style={{ fontSize: 12, color: C.rose, fontFamily: MONO, letterSpacing: 1, marginTop: 12, maxWidth: 280 }}>{error}</div>
            <button onClick={goToVault} style={{ marginTop: 32, padding: "13px 40px", ...skeuo.btnGhost, color: C.accent, fontSize: 10, fontFamily: MONO, letterSpacing: 3, cursor: "pointer" }}>OPEN VAULT</button>
          </div>
        )}
      </div>
    </div>
  );
              }
