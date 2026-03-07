"use client";
import { useState } from "react";
import "./globals.css";
import { C, SANS } from "../components/design";
import { generateOwnedCards } from "../components/data";
import SplashScreen from "../components/SplashScreen";
import SignupScreen from "../components/SignupScreen";
import CollectionScreen from "../components/CollectionScreen";
import CardDetailScreen from "../components/CardDetailScreen";
import ScanScreen from "../components/ScanScreen";
import ProfileScreen from "../components/ProfileScreen";

export default function SymbiosisVault() {
  const [screen, setScreen] = useState("splash");
  const [selectedCard, setSelectedCard] = useState(null);
  const [ownedCards, setOwnedCards] = useState(generateOwnedCards);

  const handleDisconnect = (chipId) => {
    setOwnedCards((prev) => prev.map((c) => c.chipId === chipId ? { ...c, linked: false } : c));
    setTimeout(() => setScreen("collection"), 1500);
  };

  return (
    <div style={{
      width: "100%", maxWidth: 390, height: "100dvh",
      margin: "0 auto", background: C.bg, fontFamily: SANS,
      overflow: "hidden", position: "relative",
    }}>
      {screen === "splash" && <SplashScreen onEnter={() => setScreen("signup")} />}
      {screen === "signup" && <SignupScreen onSignup={() => setScreen("collection")} />}
      {screen === "collection" && (
        <CollectionScreen
          ownedCards={ownedCards}
          onCardClick={(card) => { setSelectedCard(card); setScreen("detail"); }}
          onScan={() => setScreen("scan")}
          onProfile={() => setScreen("profile")}
        />
      )}
      {screen === "detail" && selectedCard && (
        <CardDetailScreen card={selectedCard} ownedCards={ownedCards} onBack={() => setScreen("collection")} onDisconnect={handleDisconnect} />
      )}
      {screen === "scan" && (
        <ScanScreen onBack={() => setScreen("collection")} onScanned={() => setScreen("collection")} />
      )}
      {screen === "profile" && (
        <ProfileScreen ownedCards={ownedCards} onBack={() => setScreen("collection")} />
      )}
    </div>
  );
}
