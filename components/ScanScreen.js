"use client";
import { useState } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, Divider, ChevronLeft, NfcIcon, CheckIcon } from "./Icons";

export default function ScanScreen({ session, onBack, onScanned }) {
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(false);
  const [chipId, setChipId] = useState("");
  const [cardResult, setCardResult] = useState(null);
  const [error, setError] = useState("");
  const [isSetComplete, setIsSetComplete] = useState(false);
  const [nfcSupported] = useState(typeof window !== "undefined" && "NDEFReader" in window);
  const [manualMode, setManualMode] = useState(false);


  const linkCard = async (id) => {
    const cid = (id || chipId).trim();
    if (!cid) {
      setError("Enter a chip ID");
      return;
    }
    setError("");
    setScanning(true);

    try {
      const headers = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/cards/link", {
        method: "POST",
        headers,
        body: JSON.stringify({ chipId: cid }),
      });

      const data = await res.json();
      setScanning(false);

      if (!res.ok) {
        setError(data.error || "Failed to link card");
        return;
      }

      setCardResult(data.card);
      setIsSetComplete(data.setComplete || false);
      setFound(true);
    } catch (err) {
      setScanning(false);
      setError("Network error. Please try again.");
    }
  };

  const startNfcScan = async () => {
    if (!nfcSupported) { setManualMode(true); return; }
    setScanning(true);
    setError("");
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.addEventListener("reading", async ({ serialNumber }) => {
        const nfcId = serialNumber.toUpperCase().replace(/-/g, ":");
        setChipId(nfcId);
        await linkCard(nfcId);
      });
    } catch (e) {
      setManualMode(true);
      setScanning(false);
    }
  };


  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes scanPulse {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.12); opacity: 1; }
      }
      @keyframes scanRing {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      @keyframes scanGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(200,184,138,0.1); }
        50% { box-shadow: 0 0 50px rgba(200,184,138,0.35), 0 0 80px rgba(200,184,138,0.15); }
      }
      @keyframes scanSweep {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scanBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    ` }} />
    <div style={{
    height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 50% 40%, #151312, ${C.bg})`,
      position: "relative", overflow: "hidden",
    }}>
      <FilmGrain opacity={0.04} />
      <div onClick={onBack} style={{ position: "absolute", top: 14, left: 14, cursor: "pointer", padding: 4, zIndex: 2 }}><ChevronLeft /></div>

      {!found ? (
        <>
          <div style={{
            width: 150, height: 150, margin: "0 auto",
            ...(scanning ? skeuo.card : skeuo.inset),
            borderRadius: "50%",
            border: `1.5px solid ${scanning ? C.accent + "44" : C.textDim + "22"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", transition: "all 0.5s ease",
            animation: scanning ? "scanGlow 2s ease-in-out infinite, scanBounce 3s ease-in-out infinite" : "none",
            boxShadow: scanning
              ? `0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(0,0,0,0.4), 0 0 40px ${C.accentDim}`
              : skeuo.inset.boxShadow,
          }}>
            {scanning && (
              <>
                <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", border: "2px solid " + C.accent, animation: "scanRing 1.5s ease-out infinite" }} />
                <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", border: "2px solid " + C.accent, animation: "scanRing 1.5s ease-out infinite 0.5s" }} />
              </>
            )}
            {scanning && (<div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px solid ${C.accent}18`, animation: "scanPulse 1.5s ease-in-out infinite" }} />)}
              {scanning && (<div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", border: "1px dashed " + C.accent + "33", animation: "scanSweep 4s linear infinite" }} />)}
            <NfcIcon size={36} color={scanning ? C.accent : C.textDim} />
          </div>

          <div style={{ marginTop: 32, textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 300, color: C.cream, fontFamily: SERIF, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              {scanning ? "Linking..." : "Link a card"}
            </div>
            <div style={{ fontSize: 13, color: C.textSec, fontFamily: SANS, marginTop: 8, lineHeight: 1.5 }}>
              {scanning ? "Verifying your polaroid..." : "Enter your card's chip ID"}
            </div>
          </div>

          {!scanning && (<>
          {!scanning && !found && !manualMode && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button onClick={startNfcScan} style={{
                ...skeuo.btnGhost,
                color: C.accent, fontSize: 11, fontFamily: MONO, letterSpacing: 3, cursor: "pointer",
                padding: "14px 32px",
              }}>SCAN CARD</button>
              <div onClick={() => setManualMode(true)} style={{ marginTop: 12, color: C.textDim, fontSize: 11, cursor: "pointer" }}>or enter chip ID manually</div>
            </div>
          )}

          {manualMode && (
            <div style={{ marginTop: 32, width: "100%", maxWidth: 280, zIndex: 1 }}>
              <div style={{ ...skeuo.inset, padding: "2px", marginBottom: 12 }}>
                <input
                  type="text"
                  value={chipId}
                  onChange={(e) => setChipId(e.target.value.toUpperCase())}
                  placeholder="e.g. TEST-001"
                  style={{
                    width: "100%", padding: "14px 16px", background: "transparent",
                    border: "none", outline: "none", color: C.cream,
                    fontFamily: MONO, fontSize: 14, letterSpacing: 2,
                    textAlign: "center", caretColor: C.accent,
                  }}
                />
              </div>

              {error && (
                <div style={{
                  textAlign: "center", color: "#E85D5D", fontSize: 12,
                  fontFamily: MONO, marginBottom: 12, letterSpacing: 1,
                }}>{error}</div>
              )}

              <button onClick={() => linkCard(chipId)} style={{
                width: "100%", padding: "13px 0",
                ...skeuo.btnGhost,
                color: C.accent, fontSize: 10, fontFamily: MONO, letterSpacing: 4, cursor: "pointer",
              }}>LINK CARD</button>
            </div>
          )}
          </>)}
        </>
      ) : (
        <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
          <div style={{ width: 64, height: 64, ...skeuo.card, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
            <CheckIcon size={24} color={C.teal} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 20, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>Card linked!</div>
          <Divider style={{ width: 100, margin: "14px auto" }} />
          {cardResult && (
            <>
              <div style={{ fontSize: 15, color: C.accent, fontFamily: SERIF, fontStyle: "italic" }}>{cardResult.songTitle} &mdash; {cardResult.perspective}</div>
              <div style={{ fontSize: 9, color: C.textDim, fontFamily: MONO, letterSpacing: 2, marginTop: 6 }}>{cardResult.rarity.toUpperCase()} &middot; {cardResult.chipId}</div>
            </>
          )}
          {isSetComplete && (
            <div style={{
              marginTop: 16, padding: "10px 20px", ...skeuo.card,
              position: "relative", overflow: "hidden",
            }}>
              <div style={skeuo.gloss} />
              <div style={{ fontSize: 10, fontFamily: MONO, letterSpacing: 3, color: "#E4BC4A", position: "relative", zIndex: 1 }}>
                SET COMPLETE &mdash; ULTRA RARE UNLOCKED
              </div>
            </div>
          )}
          <button onClick={onScanned} style={{
            marginTop: 32, padding: "13px 40px",
            ...skeuo.btnGold,
            color: C.bg, fontSize: 10, fontFamily: MONO,
            fontWeight: 600, letterSpacing: 3, cursor: "pointer",
          }}>VIEW COLLECTION</button>
        </div>
      )}
    </div>
    </>
  );
}
