"use client";
import { useState } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, Divider, ChevronLeft, NfcIcon, CheckIcon } from "./Icons";

export default function ScanScreen({ onBack, onScanned }) {
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(false);
  const startScan = () => { setScanning(true); setTimeout(() => { setScanning(false); setFound(true); }, 2500); };

  return (
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
            width: 150, height: 150,
            ...(scanning ? skeuo.card : skeuo.inset),
            borderRadius: "50%",
            border: `1.5px solid ${scanning ? C.accent + "44" : C.textDim + "22"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", transition: "all 0.5s ease",
            boxShadow: scanning
              ? `0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(0,0,0,0.4), 0 0 40px ${C.accentDim}`
              : skeuo.inset.boxShadow,
          }}>
            {scanning && (<div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px solid ${C.accent}18`, animation: "scanPulse 1.5s ease-in-out infinite" }} />)}
            <NfcIcon size={36} color={scanning ? C.accent : C.textDim} />
          </div>
          <div style={{ marginTop: 32, textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 300, color: C.cream, fontFamily: SERIF, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{scanning ? "Scanning..." : "Ready to scan"}</div>
            <div style={{ fontSize: 13, color: C.textSec, fontFamily: SANS, marginTop: 8, lineHeight: 1.5 }}>
              {scanning ? "Hold your polaroid to the back of your phone" : "Place your polaroid against the back of your device"}
            </div>
          </div>
          {!scanning && (
            <button onClick={startScan} style={{
              marginTop: 40, padding: "13px 44px",
              ...skeuo.btnGhost,
              color: C.accent, fontSize: 10, fontFamily: MONO, letterSpacing: 4, cursor: "pointer",
            }}>SCAN</button>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
          <div style={{ width: 64, height: 64, ...skeuo.card, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
            <CheckIcon size={24} color={C.teal} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 20, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>Card found</div>
          <Divider style={{ width: 100, margin: "14px auto" }} />
          <div style={{ fontSize: 15, color: C.accent, fontFamily: SERIF, fontStyle: "italic" }}>If This Isn't Love — Jack G</div>
          <div style={{ fontSize: 9, color: C.textDim, fontFamily: MONO, letterSpacing: 2, marginTop: 6 }}>COMMON · NFC-S016</div>
          <button onClick={onScanned} style={{
            marginTop: 32, padding: "13px 40px",
            ...skeuo.btnGold,
            color: C.bg, fontSize: 10, fontFamily: MONO,
            fontWeight: 600, letterSpacing: 3, cursor: "pointer",
          }}>ADD TO VAULT</button>
        </div>
      )}
    </div>
  );
}
