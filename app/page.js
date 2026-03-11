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
import CollectorProfileScreen from "../components/CollectorProfileScreen";

export default function SymbiosisVault() {
  const [screen, setScreen] = useState("loading");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [ownedCards, setOwnedCards] = useState([]);
  const { session, loading, isAuthenticated, isSupabaseConfigured } = useAuth();

  // Route to correct screen based on auth state
  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      // Already signed in - go straight to collection
      setScreen((prev) => prev === "loading" || prev === "splash" || prev === "signup" ? "collection" : prev);
    } else {
      // Not signed in - show splash
      setScreen("splash");
    }
  }, [loading, isAuthenticated]);

  // Check for pending NFC chip to link (from /link page before sign-in)
  useEffect(() => {
    if (!isAuthenticated || !session?.access_token) return;
    try {
      const pendingChip = localStorage.getItem("pendingChip");
      if (!pendingChip) return;
      localStorage.removeItem("pendingChip");
      fetch("/api/cards/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ chipId: pendingChip }),
      }).then(() => fetchCards());
    } catch (e) {}
  }, [isAuthenticated, session]);

  // Fetch cards from API when user is authenticated
  const fetchCards = useCallback(async () => {
    if (!session?.access_token) {
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
    if (isAuthenticated) fetchCards();
  }, [fetchCards, isAuthenticated]);

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
      setOwnedCards((prev) =>
        prev.map((c) => c.chipId === chipId ? { ...c, linked: false } : c)
      );
    }
    setTimeout(() => setScreen("collection"), 500);
  };

  const handleCardLinked = () => {
    fetchCards();
    setScreen("collection");
  };

  // Loading state while checking auth
  if (screen === "loading") {
    return (
      <div style={{
        width: "100%", height: "100dvh", background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center",
      }} />
    );
  }

  return (
    <div style={{
      width: "100%", height: "100dvh", background: "#000",
      fontFamily: SANS, overflow: "hidden", position: "relative",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>

      {screen === "splash" && (
        <SplashScreen onEnter={() => setScreen("signup")} />
      )}

      {screen === "signup" && (
        <SignupScreen onSignup={() => setScreen("collection")} />
      )}

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
        <CardDetailScreen
          card={selectedCard}
          ownedCards={ownedCards}
          onBack={() => setScreen("collection")}
          onDisconnect={handleDisconnect}
        />
      )}

      {screen === "scan" && (
        <ScanScreen
          session={session}
          onBack={() => setScreen("collection")}
          onScanned={handleCardLinked}
        />
      )}

      {screen === "profile" && (
        <ProfileScreen
          ownedCards={ownedCards}
          onBack={() => setScreen("collection")}
          session={session}
        />
      )}

      {screen === "leaderboard" && (
        <LeaderboardScreen
          onBack={() => setScreen("collection")}
          onViewCollector={(c) => {
            setSelectedCollector(c);
            setScreen("collectorProfile");
          }}
        />
      )}

      {screen === "collectorProfile" && selectedCollector && (
        <CollectorProfileScreen
          collector={selectedCollector}
          onBack={() => setScreen("leaderboard")}
        />
      )}
    </div>
  );
}
