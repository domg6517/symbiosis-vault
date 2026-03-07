"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, Divider } from "./Icons";

export default function SignupScreen({ onSignup }) {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 150); }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bg, position: "relative" }}>
      <FilmGrain opacity={0.04} />
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", padding: "64px 28px 40px",
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.7s cubic-bezier(0.2, 0, 0, 1)",
      }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: C.textDim, fontFamily: MONO }}>EST. 2026</div>
        <div style={{ fontSize: 30, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 16, lineHeight: 1.25, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          Start your<br />collection.
        </div>
        <Divider style={{ margin: "20px 0" }} />
        <div style={{ fontSize: 14, color: C.textSec, fontFamily: SANS, lineHeight: 1.6 }}>
          200 polaroids per drop. 10 singles.<br />22 boosters. Collect, trade, and unlock.
        </div>

        <div style={{ marginTop: 44 }}>
          <label style={{ fontSize: 10, letterSpacing: 3, color: C.textDim, fontFamily: MONO, display: "block", marginBottom: 10 }}>EMAIL</label>
          <div style={{ ...skeuo.inset, padding: 2 }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%", padding: "14px 12px", background: "transparent",
                border: "none", color: C.cream, fontSize: 16, fontFamily: SANS,
                outline: "none", boxSizing: "border-box", caretColor: C.accent,
              }}
            />
          </div>
        </div>

        <button onClick={onSignup} style={{
          width: "100%", marginTop: 32, padding: "15px",
          ...skeuo.btnGold,
          color: C.bg, fontSize: 11, fontFamily: MONO, fontWeight: 600,
          letterSpacing: 3, cursor: "pointer",
        }}>CREATE VAULT</button>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: C.textDim, fontFamily: SANS }}>
          Already collecting? <span style={{ color: C.accent, cursor: "pointer" }} onClick={onSignup}>Sign in</span>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "0 28px 20px", fontSize: 10, color: C.textDim, fontFamily: SANS, lineHeight: 1.5 }}>
        By entering the Vault you agree to the collection terms.
      </div>
    </div>
  );
}
