"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    async function handleCallback() {
      try {
        const params = new URLSearchParams(window.location.search);
        const token_hash = params.get("token_hash");
        const type = params.get("type") || "signup";
        const code = params.get("code");

        if (token_hash) {
          const { error } = await supabase.auth.verifyOtp({ token_hash, type });
          if (error) {
            console.error("Verification error:", error.message);
            setStatus("Verification failed. Please try signing in.");
            setTimeout(() => { window.location.href = "/"; }, 2000);
            return;
          }
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Code exchange error:", error.message);
            setStatus("Verification failed. Please try signing in.");
            setTimeout(() => { window.location.href = "/"; }, 2000);
            return;
          }
        }

        setStatus("Email confirmed! Redirecting...");
        setTimeout(() => { window.location.href = "/"; }, 500);
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("Something went wrong. Redirecting...");
        setTimeout(() => { window.location.href = "/"; }, 2000);
      }
    }

    handleCallback();
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0C0B0E",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
      fontFamily: "Georgia, serif",
      color: "#E8E2D6",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: "2px solid #A2A0B4",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "spin 1s linear infinite",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#A2A0B4" }} />
      </div>
      <p style={{ fontSize: 16, color: "#9A9488" }}>{status}</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
