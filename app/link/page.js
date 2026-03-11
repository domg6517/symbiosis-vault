"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { C, SERIF, SANS, MONO, skeuo } from "../../components/design";
import { FilmGrain, CheckIcon, NfcIcon } from "../../components/Icons";

function LinkContent() {
  const searchParams = useSearchParams();
  const chipId = searchParams.get("chip");
  const { session } = useAuth();
  const [status, setStatus] = useState("loading");
  const [cardResult, setCardResult] = useState(null);
  const [error, setError] = useState("");
  const [isSetComplete, setIsSetComplete] = useState(false);

  useEffect(() => {
    if (!chipId) {
      setStatus("error");
      setError("No chip ID found in URL.");
      return;
    }
    if (!session?.access_token) {
      setStatus("needsAuth");
      return;
    }
    const link = async () => {
      try {
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
          setStatus("error");
          setError(data.error || "Failed to link card");
          return;
        }
        setCardResult(data.card);
        setIsSetComplete(data.setComplete || false);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError("Network error. Please try again.");
      }
    };
    link();
  }, [chipId, session]);

  const goToCollection = () => {
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
      <div style={wrapStyle}>
        <FilmGrain opacity={0.04} />

        {status === "loading" && (
          <div style={{ textAlign: "center", zIndex: 1 }}>
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
            }}>Open the Symbiosis Vault app and sign in, then tap this card again.</div>
            <button onClick={goToCollection} style={{
              marginTop: 32, padding: "13px 40px", ...skeuo.btnGold,
              color: C.bg, fontSize: 10, fontFamily: MONO,
              fontWeight: 600, letterSpacing: 3, cursor: "pointer",
            }}>OPEN VAULT</button>
          </div>
        )}

        {status === "success" && (
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <div style={{
              width: 64, height: 64, ...skeuo.card, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto",
            }}>
              <CheckIcon size={24} color={C.teal} />
            </div>
            <div style={{
              fontSize: 22, fontWeight: 300, color: C.cream, fontFamily: SERIF,
              marginTop: 20, textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}>Card linked!</div>
            {cardResult && (
              <>
                <div style={{
                  fontSize: 15, color: C.accent, fontFamily: SERIF,
                  fontStyle: "italic", marginTop: 12,
                }}>{cardResult.songTitle} &mdash; {cardResult.perspective}</div>
                <div style={{
                  fontSize: 9, color: C.textDim, fontFamily: MONO,
                  letterSpacing: 2, marginTop: 6,
                }}>{cardResult.rarity?.toUpperCase()} &middot; {cardResult.chipId}</div>
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
                  color: "#E4BC4A", position: "relative", zIndex: 1,
                }}>SET COMPLETE &mdash; ULTRA RARE UNLOCKED</div>
              </div>
            )}
            <button onClick={goToCollection} style={{
              marginTop: 32, padding: "13px 40px", ...skeuo.btnGold,
              color: C.bg, fontSize: 10, fontFamily: MONO, fontWeight: 600,
              letterSpacing: 3, cursor: "pointer",
            }}>VIEW COLLECTION</button>
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
            <button onClick={goToCollection} style={{
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
