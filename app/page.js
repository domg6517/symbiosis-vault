"use client";
import { useState, useEffect, useCallback } from "react";
import "./globals.css";
import { C, SANS, SERIF, MONO, skeuo } from "../components/design";
import { generateOwnedCards } from "../components/data";
import { useAuth } from "../components/AuthContext";
import SplashScreen from "../components/SplashScreen";
import SignupScreen from "../components/SignupScreen";
import CollectionScreen from "../components/CollectionScreen";
import CardDetailScreen from "../components/CardDetailScreen";
import ScanScreen from "../components/ScanScreen";
import ProfileScreen from "../components/ProfileScreen";
import LeaderboardScreen from "../components/LeaderboardScreen";

const SITE_PASSWORD = "symbiosis2026";

function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw.toLowerCase() === SITE_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 32,
      background: "#000",
    }}>
      <div style={{
        fontSize: 11, letterSpacing: 4, color: C.textDim, textTransform: "uppercase",
        fontFamily: MONO, marginBottom: 8,
      }}>JACK &amp; JACK</div>
      <div style={{
        fontFamily: SERIF, fontSize: 28, color: C.cream, marginBottom: 6,
        fontStyle: "italic", letterSpacing: 1,
      }}>Symbiosis</div>
      <div style={{
        fontSize: 10, letterSpacing: 6, color: C.accent, textTransform: "uppercase",
        fontFamily: MONO, marginBottom: 40, opacity: 0.7,
      }}>VAULT</div>

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 280 }}>
        <div style={{
          ...skeuo.inset, padding: "2px", marginBottom: 16,
          animation: shake ? "shake 0.5s ease" : "none",
        }}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter password"
            autoFocus
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
            textAlign: "center", color: C.rose, fontSize: 12,
            fontFamily: MONO, marginBottom: 12, letterSpacing: 1,
          }}>incorrect password</div>
        )}

        <button type="submit" style={{
          ...skeuo.card, width: "100%", padding: "14px 0",
          background: `linear-gradient(145deg, #2A2520, #1E1B17)`,
          color: C.accent, fontFamily: MONO, fontSize: 11,
          letterSpacing: 4, textTransform: "uppercase", cursor: "pointer",
          border: `1px solid rgba(200,184,138,0.15)`,
          borderRadius: 8, transition: "all 0.2s ease",
        }}>UNLOCK</button>
      </form>

      <div style={{
        position: "absolute", bottom: 24, fontSize: 10,
        color: C.textDim, fontFamily: MONO, letterSpacing: 2, opacity: 0.4,
      }}>PRIVATE PREVIEW</div>
    </div>
  );
}

export default function SymbiosisVault() {
  const [authenticated, setAuthenticated] = useState(false);
  const [screen, setScreen] = useState("splash");
  const [selectedCard, setSelectedCard] = useState(null);
  const [ownedCards, setOwnedCards] = useState([]);
  const { session, isSupabaseConfigured } = useAuth();

  // Fetch cards from API when user is authenticated
  const fetchCards = useCallback(async () => {
    if (!session?.access_token) {
      // Fallback to demo data if no auth
      if (!isSupabaseConfigured) {
        setOwnedCards(generateOwnedCards());
      }
      return;
    }
    try {
      const res = await fetch("/api/collection/cards", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (data.cards) setOwnedCards(data.cards);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    }
  }, [session, isSupabaseConfigured]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleDisconnect = async (chipId) => {
    if (session?.access_token) {
      try {
        await fetch("/api/cards/unlink", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ chipId }),
        });
        await fetchCards();
      } catch (err) {
        console.error("Disconnect error:", err);
      }
    } else {
      setOwnedCards((prev) => prev.map((c) => c.chipId === chipId ? { ...c, linked: false } : c));
    }
    setTimeout(() => setScreen("collection"), 500);
  };

  const handleCardLinked = () => {
    fetchCards();
    setScreen("collection");
  };

  return (
    <div style={{
      width: "100%", height: "100dvh",
      background: C.bg, fontFamily: SANS,
      overflow: "hidden", position: "relative",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {!authenticated && <PasswordGate onUnlock={() => setAuthenticated(true)} />}
      {authenticated && screen === "splash" && <SplashScreen onEnter={() => setScreen("signup")} />}
      {screen === "signup" && <SignupScreen onSignup={() => setScreen("collection")} />}
      {screen === "collection" && (
        <CollectionScreen
          ownedCards={ownedCards}
          onCardClick={(card) => { setSelectedCard(card); setScreen("detail"); }}
          onScan={() => setScreen("scan")}
          onLeaderboard={() => setScreen("leaderboard")}
          onProfile={() => setScreen("profile")}
        />
      )}
      {screen === "detail" && selectedCard && (
        <CardDetailScreen card={selectedCard} ownedCards={ownedCards} onBack={() => setScreen("collection")} onDisconnect={handleDisconnect} />
      )}
      {screen === "scan" && (
        <ScanScreen
          session={session}
          onBack={() => setScreen("collection")}
          onScanned={handleCardLinked}
        />
      )}
      {screen === "profile" && (
        <ProfileScreen ownedCards={ownedCards} onBack={() => setScreen("collection")} />
      )}
        {screen === "leaderboard" && (
          <LeaderboardScreen onBack={() => setScreen("collection")} />
        )}
    </div>
  );
}
