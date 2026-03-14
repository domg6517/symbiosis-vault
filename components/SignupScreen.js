"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, Divider } from "./Icons";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

export default function SignupScreen({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { signUp, signIn, isSupabaseConfigured } = useAuth();

  useEffect(() => {
    setTimeout(() => setShow(true), 150);
  }, []);

  async function handleSubmit() {
    if (!isSupabaseConfigured) {
      onSignup();
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Username validation for signup only
    if (!isSignIn) {
      const trimmedUsername = username.trim();
      if (!trimmedUsername) {
        setError("Username is required");
        return;
      }
      if (trimmedUsername.length < 2) {
        setError("Username must be at least 2 characters");
        return;
      }
      if (trimmedUsername.length > 24) {
        setError("Username must be 24 characters or less");
        return;
      }
      if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedUsername)) {
        setError("Username can only contain letters, numbers, _ . -");
        return;
      }

      // Check uniqueness
      if (supabase) {
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .ilike("username", trimmedUsername)
          .maybeSingle();
        if (existing) {
          setUsernameError("Username already taken");
          setError("Username already taken");
          return;
        }
      }
    }

    setLoading(true);
    setError("");
    setUsernameError("");

    if (isSignIn) {
      const { error: authError } = await signIn(email, password);
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else {
        onSignup();
      }
    } else {
      const { data, error: authError } = await signUp(email, password, username.trim());
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else {
        onSignup();
      }
    }
  }

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: C.bg, position: "relative",
    }}>
      <FilmGrain opacity={0.04} />
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        padding: "64px 28px 40px",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.7s cubic-bezier(0.2, 0, 0, 1)",
      }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: C.textDim, fontFamily: MONO }}>
          EST. 2026
        </div>
        <div style={{
          fontSize: 30, fontWeight: 300, color: C.cream, fontFamily: SERIF,
          marginTop: 16, lineHeight: 1.25,
          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}>
          {isSignIn ? "Welcome\nback." : "Start your\ncollection."}
        </div>

        <Divider style={{ margin: "20px 0" }} />

        <div style={{ fontSize: 14, color: C.textSec, fontFamily: SANS, lineHeight: 1.6 }}>
          [REDACTED] polaroids per drop. [REDACTED] singles.<br />
          [REDACTED] boosters. Collect, trade, and unlock.
        </div>

        {/* Username field - signup only */}
        {!isSignIn && (
          <div style={{ marginTop: 32 }}>
            <label style={{
              fontSize: 10, letterSpacing: 3, color: C.textDim,
              fontFamily: MONO, display: "block", marginBottom: 10,
            }}>USERNAME</label>
            <div style={{ ...skeuo.inset, padding: 2 }}>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameError(""); setError(""); }}
                placeholder="Choose a username"
                autoCapitalize="none"
                autoCorrect="off"
                style={{
                  width: "100%", padding: "14px 12px",
                  background: "transparent", border: "none",
                  color: C.cream, fontSize: 16, fontFamily: SANS,
                  outline: "none", boxSizing: "border-box", caretColor: C.accent,
                }}
              />
            </div>
            {usernameError && (
              <div style={{ marginTop: 6, fontSize: 12, color: "#B07272", fontFamily: SANS }}>
                {usernameError}
              </div>
            )}
          </div>
        )}

        {/* Email field */}
        <div style={{ marginTop: isSignIn ? 32 : 18 }}>
          <label style={{
            fontSize: 10, letterSpacing: 3, color: C.textDim,
            fontFamily: MONO, display: "block", marginBottom: 10,
          }}>EMAIL</label>
          <div style={{ ...skeuo.inset, padding: 2 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com"
              style={{
                width: "100%", padding: "14px 12px",
                background: "transparent", border: "none",
                color: C.cream, fontSize: 16, fontFamily: SANS,
                outline: "none", boxSizing: "border-box", caretColor: C.accent,
              }}
            />
          </div>
        </div>

        {/* Password field */}
        <div style={{ marginTop: 18 }}>
          <label style={{
            fontSize: 10, letterSpacing: 3, color: C.textDim,
            fontFamily: MONO, display: "block", marginBottom: 10,
          }}>PASSWORD</label>
          <div style={{ ...skeuo.inset, padding: 2 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Min 6 characters"
              style={{
                width: "100%", padding: "14px 12px",
                background: "transparent", border: "none",
                color: C.cream, fontSize: 16, fontFamily: SANS,
                outline: "none", boxSizing: "border-box", caretColor: C.accent,
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 14, fontSize: 13, color: "#B07272", fontFamily: SANS }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", marginTop: 28, padding: "15px",
            ...skeuo.btnGold, color: C.bg,
            fontSize: 11, fontFamily: MONO, fontWeight: 600, letterSpacing: 3,
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "..." : isSignIn ? "SIGN IN" : "CREATE VAULT"}
        </button>

        <div style={{
          textAlign: "center", marginTop: 18,
          fontSize: 13, color: C.textDim, fontFamily: SANS,
        }}>
          {isSignIn ? "New collector? " : "Already collecting? "}
          <span
            style={{ color: C.accent, cursor: "pointer" }}
            onClick={() => { setIsSignIn(!isSignIn); setError(""); setUsernameError(""); }}
          >
            {isSignIn ? "Create vault" : "Sign in"}
          </span>
        </div>
      </div>

      <div style={{
        textAlign: "center", padding: "0 28px 20px",
        fontSize: 10, color: C.textDim, fontFamily: SANS, lineHeight: 1.5,
      }}>
        By entering the Vault you agree to the collection terms.
      </div>
    </div>
  );
}
