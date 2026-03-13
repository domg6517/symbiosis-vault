"use client";
import { useState, useEffect, useRef } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import {
    FilmGrain, Divider, ChevronLeft, MusicIcon, CheckIcon,
    LinkIcon, UnlinkIcon, LockSmall,
} from "./Icons";
import { SINGLES, BOOSTERS, PERSPECTIVES } from "./data";

export default function CardDetailScreen({ card, ownedCards, onBack, onDisconnect }) {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [show, setShow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);

  const isBooster = card.type === "booster";
  const allSongs = isBooster ? BOOSTERS : SINGLES;
  const song = allSongs.find((s) => s.id === card.songId);
  const perspLabel = card.perspective === "J&J" ? "J & J" : card.perspective.split(" ")[1];
  const songCards = ownedCards.filter((c) => c.songId === card.songId && c.linked && c.type === card.type);
  const uniquePerspectives = new Set(songCards.map((c) => c.perspective)).size;
  const complete = uniquePerspectives === 3;
  const isRare = card.rarity === "rare";

  const handleDisconnect = () => {
    setDisconnecting(true);
    setTimeout(() => onDisconnect(card.chipId), 1200);
  };

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: C.bg, overflow: "auto", position: "relative",
    }}>
      <FilmGrain opacity={0.04} />
      <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", gap: 10, zIndex: 1 }}>
        <div onClick={onBack} style={{ cursor: "pointer", padding: 4 }}><ChevronLeft /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: isBooster ? C.booster : C.textDim, fontFamily: MONO }}>
            {isBooster ? `BOOSTER ${song?.num}` : "TEST DROP 1"}
          </div>
        </div>
        <div style={{ ...skeuo.badge, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontFamily: MONO, color: C.teal, letterSpacing: 1 }}>
          <LinkIcon size={12} color={C.teal} /> LINKED
        </div>
      </div>

      {/* Large polaroid — user artwork style */}
      <div style={{
        display: "flex", justifyContent: "center", padding: "4px 20px 20px", zIndex: 1,
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.5s cubic-bezier(0.2, 0, 0, 1)",
      }}>
        <div style={{
          width: 200, height: 255,
          background: "linear-gradient(172deg, #F2EDE4, #E6DFD2, #DDD6C8)",
          padding: "7px 7px 18px",
          boxShadow: "0 1px 0 rgba(255,255,255,0.2) inset, 0 2px 8px rgba(0,0,0,0.12), 0 12px 40px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.15)",
          borderRadius: 3,
        }}>
          {card.imageUrl ? (
            <>
              <div style={{ width: "100%", height: 180, position: "relative", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.4) inset" }}>
                <img src={card.imageUrl} alt={card.perspective} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {isRare && <div style={{ position: "absolute", top: 6, right: 8, fontSize: 8, fontFamily: MONO, color: C.purple, letterSpacing: 1, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>RARE</div>}
              </div>
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                <div style={{ fontSize: 14, fontFamily: SERIF, fontStyle: "italic", color: "#3A3530" }}>{card.perspective}</div>
              </div>
            </>
          ) : (
            <>
              {/* User artwork: cream bg, bold rarity text, X/10 numbering */}
              <div style={{
                width: "100%", height: 180,
                background: "#D5D0C5",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  fontSize: 26, fontWeight: 700, color: "#1A1A1A",
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                  letterSpacing: -1, textTransform: "uppercase",
                  userSelect: "none",
                }}>
                  {isRare ? "RARE" : "COMMON"}
                </div>
                <div style={{
                  position: "absolute", bottom: 8, right: 10,
                  fontSize: 11, fontWeight: 600, color: "#1A1A1A",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {card.cardNumber || ""}/10
                </div>
              </div>
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                <div style={{ fontSize: 14, fontFamily: SERIF, fontStyle: "italic", color: "#3A3530" }}>{card.perspective}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "0 22px", zIndex: 1 }}>
        <div style={{ fontSize: 20, fontFamily: SERIF, fontWeight: 300, color: C.cream, marginBottom: 3, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>Test Drop 1</div>
        <div style={{ fontSize: 12, fontFamily: SANS, color: C.textSec, marginBottom: 16 }}>
          {card.perspective} · {isRare ? "Rare" : "Common"} · {card.chipId}
        </div>

        {/* Unlock */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px", ...skeuo.card, position: "relative", overflow: "hidden",
          marginBottom: 16,
        }}>
          <div style={skeuo.gloss} />
          <MusicIcon />
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 9, color: C.accent, fontFamily: MONO, letterSpacing: 2 }}>UNLOCKED</div>
            <div style={{ fontSize: 14, color: C.cream, fontFamily: SANS, marginTop: 2 }}>Redacted — {card.perspective}</div>
          </div>
          <div onClick={() => {
                if (card.audioUrl) {
                  if (playing) {
                    audioRef.current?.pause();
                    setPlaying(false);
                  } else {
                    if (!audioRef.current) {
                      audioRef.current = new Audio(card.audioUrl);
                      audioRef.current.onended = () => setPlaying(false);
                    }
                    audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
                  }
                } else {
                  setPlaying(true);
                  setTimeout(() => setPlaying(false), 1500);
                }
              }} style={{ ...skeuo.btnGhost, padding: "7px 14px", color: playing ? C.textDim : C.accent, fontSize: 9, fontFamily: MONO, letterSpacing: 2, cursor: "pointer", position: "relative", zIndex: 1 }}>{playing ? (card.audioUrl ? "PAUSE" : "SOON") : "PLAY"}</div>
        </div>

        {/* Completion */}
        <div style={{ fontSize: 9, fontFamily: MONO, letterSpacing: 3, color: C.textDim, marginBottom: 10 }}>
          TEST DROP 1 COMPLETION
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {PERSPECTIVES.map((persp) => {
            const has = songCards.some((c) => c.perspective === persp);
            const pLabel = persp === "J&J" ? "J&J" : persp.split(" ")[1];
            return (
              <div key={persp} style={{
                flex: 1, padding: "12px 6px", textAlign: "center",
                ...(has ? skeuo.card : skeuo.inset), position: "relative", overflow: "hidden",
              }}>
                {has && <div style={skeuo.gloss} />}
                <div style={{ fontSize: 15, fontWeight: 300, fontFamily: SERIF, color: has ? C.cream : C.textDim, position: "relative", zIndex: 1 }}>{pLabel}</div>
                <div style={{ fontSize: 8, fontFamily: MONO, letterSpacing: 2, color: has ? C.teal : C.textDim, marginTop: 5, position: "relative", zIndex: 1 }}>{has ? "OWNED" : "LOCKED"}</div>
                {has && <div style={{ marginTop: 3, position: "relative", zIndex: 1 }}><CheckIcon size={11} /></div>}
              </div>
            );
          })}
        </div>
        <div style={{
          padding: "11px 14px", textAlign: "center",
          ...(complete ? skeuo.card : skeuo.inset), position: "relative", overflow: "hidden",
          marginBottom: 20,
        }}>
          {complete && <div style={skeuo.gloss} />}
          <div style={{ fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: complete ? C.accent : C.textDim, position: "relative", zIndex: 1 }}>
            {complete ? "✦ ALL 3 PERSPECTIVES — BADGE UNLOCKED" : `${uniquePerspectives} OF 3 — COLLECT ALL TO UNLOCK BONUS`}
          </div>
        </div>

        {/* Disconnect */}
        
      {/* Trade on Discord */}
      <div
        onClick={() => window.open("https://discord.gg/SbSWCkumk6", "_blank")}
        style={{
          display: "flex", alignItems: "center", gap: 10, padding: "14px",
          ...skeuo.card, position: "relative", overflow: "hidden",
          cursor: "pointer", marginBottom: 16,
        }}
      >
        <div style={skeuo.gloss} />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 1 }}>
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#5865F2"/>
        </svg>
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, fontFamily: SANS, fontWeight: 500, color: C.textSec }}>Trade on Discord</div>
          <div style={{ fontSize: 11, fontFamily: SANS, color: C.textDim, marginTop: 2 }}>Find collectors to trade with</div>
        </div>
        <div style={{ fontSize: 18, color: C.textDim, position: "relative", zIndex: 1 }}>›</div>
      </div>

        <Divider style={{ marginBottom: 16 }} />
        {!showDisconnect ? (
          <div onClick={() => setShowDisconnect(true)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "14px", ...skeuo.card, position: "relative", overflow: "hidden",
            cursor: "pointer", marginBottom: 20,
          }}>
            <div style={skeuo.gloss} />
            <UnlinkIcon size={16} color={C.textSec} />
            <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 13, fontFamily: SANS, fontWeight: 500, color: C.textSec }}>Disconnect for trade</div>
              <div style={{ fontSize: 11, fontFamily: SANS, color: C.textDim, marginTop: 2 }}>Unlink this card so someone else can claim it</div>
            </div>
            <div style={{ fontSize: 18, color: C.textDim, position: "relative", zIndex: 1 }}>›</div>
          </div>
        ) : (
          <div style={{ padding: "16px", ...skeuo.card, border: `1px solid ${C.rose}33`, marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={skeuo.gloss} />
            {!disconnecting ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative", zIndex: 1 }}>
                  <UnlinkIcon size={16} color={C.rose} />
                  <div style={{ fontSize: 14, fontFamily: SANS, fontWeight: 600, color: C.cream }}>Disconnect this card?</div>
                </div>
                <div style={{ fontSize: 13, fontFamily: SANS, color: C.textSec, lineHeight: 1.6, marginBottom: 16, position: "relative", zIndex: 1 }}>
                  This will unlink <strong style={{ color: C.cream }}>{card.chipId}</strong> from your Vault. The next person who physically scans it can add it to their collection.
                </div>
                <div style={{ fontSize: 11, fontFamily: SANS, color: C.textDim, marginBottom: 16, padding: "10px 12px", ...skeuo.inset, position: "relative", zIndex: 1 }}>
                  You will lose access to the song unlock and any progress toward completion tied to this card.
                </div>
                <div style={{ display: "flex", gap: 8, position: "relative", zIndex: 1 }}>
                  <button onClick={() => setShowDisconnect(false)} style={{
                    flex: 1, padding: "12px", ...skeuo.btnGhost,
                    color: C.textSec, fontSize: 10, fontFamily: MONO, letterSpacing: 2, cursor: "pointer",
                  }}>CANCEL</button>
                  <button onClick={handleDisconnect} style={{
                    flex: 1, padding: "12px",
                    background: "linear-gradient(180deg, #C87272, #B07272, #A06262)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 3px 8px rgba(0,0,0,0.3)",
                    border: "none", borderRadius: 6,
                    color: "#fff", fontSize: 10, fontFamily: MONO, letterSpacing: 2, cursor: "pointer",
                  }}>DISCONNECT</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0", position: "relative", zIndex: 1 }}>
                <div style={{ width: 40, height: 40, ...skeuo.card, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                  <CheckIcon size={18} color={C.teal} />
                </div>
                <div style={{ fontSize: 15, fontFamily: SANS, fontWeight: 500, color: C.cream, marginTop: 12 }}>Card disconnected</div>
                <div style={{ fontSize: 12, fontFamily: SANS, color: C.textSec, marginTop: 6, lineHeight: 1.5 }}>
                  {card.chipId} is now unclaimed.<br />Hand it to the new owner to scan.
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 9, fontFamily: MONO, color: C.textDim, letterSpacing: 1, paddingBottom: 28,
        }}>
          <span>NFC VERIFIED</span>
          <span>{card.chipId}</span>
          <span>{card.rarity.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
