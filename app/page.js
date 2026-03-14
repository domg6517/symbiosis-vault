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
import TermsModal from "../components/TermsModal";

export default function SymbiosisVault() {
  const [screen, setScreen] = useState("loading");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [prevScreen, setPrevScreen] = useState("collection");
  const [ownedCards, setOwnedCards] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const { session, loading, isAuthenticated, isSupabaseConfigured } = useAuth();

  // Check for pending NFC chip to link (from /link page before sign-in)
  useEffect(() => {
    if (!isAuthenticated || !session?.access_token) return;
    try {
      const pendingChip = localStorage.getItem("pendingChipId");
      if (!pendingChip) return;
      localStorage.removeItem("pendingChipId");
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

  // When ENTER is clicked on splash, go to collection if authed, signup if not
  const handleSplashEnter = () => {
    if (loading) {
      // Auth still loading — show signup, the useEffect below will redirect
      setScreen("signup");
    } else if (isAuthenticated) {
      setScreen("collection");
    } else {
      setScreen("signup");
    }
  };

  // Route based on auth state when loading finishes
  useEffect(() => {
    if (loading) return;
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const fromScan = params?.get("from") === "scan";
    if (isAuthenticated && (screen === "loading" || screen === "signup" || (fromScan && screen === "splash"))) {
      setScreen("collection");
      if (fromScan && window.history?.replaceState) {
        window.history.replaceState({}, "", "/");
      }
    } else if (!isAuthenticated && screen === "loading") {
      setScreen(fromScan ? "signup" : "splash");
    }
  }, [loading, isAuthenticated, screen]);


  // Check if user has accepted terms
  useEffect(() => {
    try {
      const accepted = localStorage.getItem("termsAccepted");
      setTermsAccepted(accepted === "true");
    } catch (e) {
      setTermsAccepted(false);
    }
  }, []);

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
        prev.map((c) =>
          c.chipId === chipId ? { ...c, linked: false } : c
        )
      );
    }
    setTimeout(() => setScreen("collection"), 500);
  };

  const handleCardLinked = () => {
    fetchCards();
    setScreen("collection");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        background: "#000",
        fontFamily: SANS,
        overflow: "hidden",
        position: "relative",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {isAuthenticated && !termsAccepted && (
        <TermsModal onAccept={() => setTermsAccepted(true)} />
      )}

      {screen === "loading" && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999 }} />
      )}

      {screen === "splash" && (
        <SplashScreen onEnter={handleSplashEnter} />
      )}
      {screen === "signup" && (
        <SignupScreen onSignup={() => setScreen("collection")} />
      )}
      {screen === "collection" && (
        <CollectionScreen
          ownedCards={ownedCards}
          onCardClick={(card) => {
            setSelectedCard(card);
            setScreen("detail");
          }}
          onScan={() => setScreen("scan")}
          onLeaderboard={() => setScreen("leaderboard")}
          onProfile={() => setScreen("profile")}
            session={session}
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
          onBack={() => setScreen(prevScreen)}
        />
      )}
    </div>
  );
}
