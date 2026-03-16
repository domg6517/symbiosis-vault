"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isOffline, setIsOffline] = useState(false);
  const { session, loading, isAuthenticated, isSupabaseConfigured } = useAuth();

  // Track whether we're navigating via popstate to avoid double pushState
  const isPopNavRef = useRef(false);

  // Browser back button / swipe navigation
  useEffect(() => {
    const handlePopState = (e) => {
      const state = e.state;
      if (state && state.screen) {
        isPopNavRef.current = true;
        setScreen(state.screen);
        if (state.selectedCard) setSelectedCard(state.selectedCard);
        if (state.selectedCollector) setSelectedCollector(state.selectedCollector);
        if (state.prevScreen) setPrevScreen(state.prevScreen);
        setTimeout(() => { isPopNavRef.current = false; }, 0);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigate to a screen and push browser history
  const navigateTo = useCallback((newScreen, extras = {}) => {
    setScreen(newScreen);
    if (extras.selectedCard !== undefined) setSelectedCard(extras.selectedCard);
    if (extras.selectedCollector !== undefined) setSelectedCollector(extras.selectedCollector);
    if (extras.prevScreen !== undefined) setPrevScreen(extras.prevScreen);
    window.history.pushState({ screen: newScreen, ...extras }, "", "");
  }, []);

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
      // Auth still loading -- show signup, the useEffect below will redirect
      navigateTo("signup");
    } else if (isAuthenticated) {
      navigateTo("collection");
    } else {
      navigateTo("signup");
    }
  };

  // Route based on auth state when loading finishes
  useEffect(() => {
    if (loading) return;
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const fromScan = params?.get("from") === "scan";
    if (isAuthenticated && (screen === "loading" || screen === "signup" || (fromScan && screen === "splash"))) {
      setScreen("collection");
      window.history.replaceState({ screen: "collection" }, "", fromScan ? "/" : undefined);
    } else if (!isAuthenticated && screen === "loading") {
      const initScreen = fromScan ? "signup" : "splash";
      setScreen(initScreen);
      window.history.replaceState({ screen: initScreen }, "", "");
    } else if (!isAuthenticated && screen !== "splash" && screen !== "signup" && screen !== "loading") {
      setScreen("splash");
      window.history.replaceState({ screen: "splash" }, "", "/");
    }
  }, [loading, isAuthenticated, screen]);


  // Check if user has accepted terms
  useEffect(() => {
    try {
      const accepted = localStorage.getItem("termsAccepted");
      const savedVersion = localStorage.getItem("termsVersion");
      const CURRENT_TERMS_VERSION = "2.0";
      setTermsAccepted(accepted === "true" && savedVersion === CURRENT_TERMS_VERSION);
    } catch (e) {
      setTermsAccepted(false);
    }
  }, []);

  
  // Detect online/offline status
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    setIsOffline(!navigator.onLine);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
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
    setTimeout(() => navigateTo("collection"), 500);
  };

  const handleCardLinked = () => {
    fetchCards();
    navigateTo("collection");
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        background: "#000",
        fontFamily: SANS,
        overflow: "auto",
        position: "relative",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {isOffline && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: C.bg,
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>{String.fromCodePoint(0x1F4E1)}</div>
          <div style={{
            fontFamily: SERIF,
            fontSize: 24,
            fontWeight: 700,
            color: C.cream,
            marginBottom: 12,
          }}>No Connection</div>
          <div style={{
            fontFamily: SANS,
            fontSize: 14,
            color: C.textDim,
            lineHeight: 1.6,
            maxWidth: 280,
            marginBottom: 24,
          }}>
            Symbiosis Vault needs an internet connection to sync your collection and verify cards.
          </div>
          <div style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: 2,
            color: C.accent,
            padding: "10px 20px",
            borderRadius: 8,
            border: "1px solid " + C.accent + "44",
          }}>WAITING FOR CONNECTION...</div>
        </div>
      )}

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
        <SignupScreen onSignup={() => navigateTo("collection")} />
      )}
      {screen === "collection" && (
        <CollectionScreen
          ownedCards={ownedCards}
          onCardClick={(card) => {
            navigateTo("detail", { selectedCard: card });
          }}
          onScan={() => navigateTo("scan")}
          onLeaderboard={() => navigateTo("leaderboard")}
          onProfile={() => navigateTo("profile")}
            onViewCollector={(c) => {
              navigateTo("collectorProfile", { selectedCollector: c, prevScreen: "collection" });
            }}
            session={session}
        />
      )}
      {screen === "detail" && selectedCard && (
        <CardDetailScreen
          card={selectedCard}
          ownedCards={ownedCards}
          onBack={() => navigateTo("collection")}
          onDisconnect={handleDisconnect}
        />
      )}
      {screen === "scan" && (
        <ScanScreen
          session={session}
          onBack={() => navigateTo("collection")}
          onScanned={handleCardLinked}
        />
      )}
      {screen === "profile" && (
        <ProfileScreen
          ownedCards={ownedCards}
          onBack={() => navigateTo("collection")}
          session={session}
          onAccountDeleted={() => navigateTo("splash")}
        />
      )}
      {screen === "leaderboard" && (
        <LeaderboardScreen
          onBack={() => navigateTo("collection")}
          onViewCollector={(c) => {
            navigateTo("collectorProfile", { selectedCollector: c, prevScreen: "leaderboard" });
          }}
        />
      )}
      {screen === "collectorProfile" && selectedCollector && (
        <CollectorProfileScreen
          collector={selectedCollector}
          onBack={() => navigateTo(prevScreen)}
        />
      )}
    </div>
  );
}
