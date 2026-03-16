"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase auto-detects the recovery token from the URL hash
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is now in password recovery mode
      }
    });
  }, []);

  async function handleReset() {
    setError("");
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error: updateErr } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: "100dvh", background: "#0C0B0E", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, textAlign: "center", fontFamily: "'Georgia', serif" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>{String.fromCodePoint(0x2705)}</div>
        <div style={{ fontSize: 24, fontWeight: 300, color: "#E8E2D6", marginBottom: 12 }}>Password updated</div>
        <div style={{ fontSize: 14, color: "#8A8898", lineHeight: 1.6, maxWidth: 280, marginBottom: 28 }}>Your password has been reset. You can now sign in with your new password.</div>
        <a href="/" style={{ padding: "14px 32px", background: "linear-gradient(180deg, #B8B6C8, #A2A0B4, #9290A6)", color: "#0C0B0E", fontSize: 11, fontFamily: "monospace", fontWeight: 600, letterSpacing: 3, textDecoration: "none", borderRadius: 6 }}>SIGN IN</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#0C0B0E", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, fontFamily: "'Georgia', serif" }}>
      <div style={{ fontSize: 9, letterSpacing: 5, color: "#5A5868", fontFamily: "monospace", marginBottom: 16 }}>SYMBIOSIS VAULT</div>
      <div style={{ fontSize: 24, fontWeight: 300, color: "#E8E2D6", marginBottom: 28, textAlign: "center" }}>Set new password</div>
      <div style={{ width: "100%", maxWidth: 320 }}>
        <label style={{ fontSize: 10, letterSpacing: 3, color: "#5A5868", fontFamily: "monospace", display: "block", marginBottom: 8 }}>NEW PASSWORD</label>
        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Min 6 characters" style={{ width: "100%", padding: "14px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#E8E2D6", fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
        <label style={{ fontSize: 10, letterSpacing: 3, color: "#5A5868", fontFamily: "monospace", display: "block", marginBottom: 8 }}>CONFIRM PASSWORD</label>
        <input type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="Re-enter password" style={{ width: "100%", padding: "14px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#E8E2D6", fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
        {error && <div style={{ marginBottom: 14, fontSize: 13, color: "#B07272" }}>{error}</div>}
        <button onClick={handleReset} disabled={loading} style={{ width: "100%", padding: "15px", background: "linear-gradient(180deg, #B8B6C8, #A2A0B4, #9290A6)", color: "#0C0B0E", fontSize: 11, fontFamily: "monospace", fontWeight: 600, letterSpacing: 3, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, border: "none", borderRadius: 6 }}>{loading ? "UPDATING..." : "UPDATE PASSWORD"}</button>
      </div>
    </div>
  );
}
