"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, Divider, ChevronLeft, MusicIcon, CheckIcon, LinkIcon, UnlinkIcon, LockSmall } from "./Icons";
import { SINGLES, BOOSTERS, PERSPECTIVES } from "./data";

export default function CardDetailScreen({ card, ownedCards, onBack, onDisconnect }) {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);

  const isBooster = card.type === "booster";
  const allSongs = isBooster ? BOOSTERS : SINGLES;
  const song = allSongs.find((s) => s.id === card.songId);
  const perspLabel = card.perspective === "J&J" ? "J & J" : card.perspective.split(" ")[1];
  const songCards = ownedCards.filter((c) => c.songId === card.songId && c.linked && c.type === card.type);
  const uniquePerspectives = new Set(songCards.map((c) => c.perspective)).size;
  const complete = uniquePerspectives === 3;

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
            {isBooster ? `BOOSTER ${song?.num}` : `SINGLE ${song?.num}`}
          </div>
        </div>
        <div style={{ ...skeuo.badge, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontFamily: MONO, color: C.teal, letterSpacing: 1 }}>
          <LinkIcon size={12} color={C.teal} /> LINKED
        </div>
      </div>

      {/* Large polaroid */}
      <div style={{
        display: "flex", justifyContent: "center", padding: "4px 20px 20px", zIndex: 1,
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.5s cubic-bezier(0.2, 0, 0, 1)",
      }}>
        <div style={{
          width: 200, height: 255,
          background: `linear-gradient(172deg, ${isBooster ? "#EBE8E0" : "#F2EDE4"}, ${isBooster ? "#DDD9CF" : "#E6DFD2"}, ${isBooster ? "#D4D0C6" : "#DDD6C8"})`,
          padding: "7px 7px 18px",
          boxShadow: "0 1px 0 rgba(255,255,255,0.2) inset, 0 2px 8px rgba(0,0,0,0.12), 0 12px 40px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.15)",
          borderRadius: 3,
        }}>
          <div style={{
            width: "100%", height: 180,
            background: isBooster
              ? `linear-gradient(140deg, #141C17, #1A221D)`
              : `linear-gradient(140deg, #1A1714, #201D17)`,
            position: "relative", overflow: "hidden",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4) inset",
          }}>
            {card.imageUrl ? (
              <>
                <img src={card.imageUrl} alt={`${card.perspective} \u2014 ${song?.title}`} style={{
                  width: "100%", height: "100%", objectFit: "cover", display: "block",
                }} />
                {card.rarity === "rare" && (
                  <div style={{ position: "absolute", top: 6, right: 8, fontSize: 8, fontFamily: MONO, color: C.purple, letterSpacing: 1, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>RARE</div>
                )}
                {isBooster && (
                  <div style={{ position: "absolute", bottom: 6, left: 8, fontSize: 7, fontFamily: MONO, color: C.booster, letterSpacing: 1, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>BOOSTER</div>
                )}
              </>
            ) : (
              <>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 35% 40%, rgba(200,184,138,0.06), transparent 55%)` }} />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)" }} />
                <div style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", zIndex: 1,
                }}>
                  <div style={{ fontSize: 9, letterSpacing: 4, color: C.creamDark, fontFamily: MONO, marginBottom: 8, opacity: 0.6 }}>
                    {isBooster ? `B${song?.num}` : song?.num}
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 300, color: C.cream, fontFamily: SERIF, letterSpacing: 2, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{perspLabel}</div>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: C.creamDark, fontFamily: MONO, marginTop: 8, opacity: 0.5 }}>{song?.title.toUpperCase()}</div>
                </div>
                {card.rarity === "rare" && (
                  <div style={{ position: "absolute", top: 6, right: 8, fontSize: 8, fontFamily: MONO, color: C.purple, letterSpacing: 1 }}>RARE</div>
                )}
                {isBooster && (
                  <div style={{ position: "absolute", bottom: 6, left: 8, fontSize: 7, fontFamily: MONO, color: C.booster, letterSpacing: 1 }}>BOOSTER</div>
                )}
                <div style={{ position: "absolute", top: 6, left: 8, fontSize: 7, fontFamily: MONO, color: C.creamDark, opacity: 0.2 }}>{card.chipId}</div>
              </>
            )}
          </div>
          <div style={{ textAlign: "center", paddingTop: 8 }}>
            <div style={{ fontSize: 14, fontFamily: SERIF, fontStyle: "italic", color: "#3A3530" }}>{card.perspective}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 22px", zIndex: 1 }}>
        <div style={{ fontSize: 20, fontFamily: SERIF, fontWeight: 300, color: C.cream, marginBottom: 3, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>{song?.title}</div>
        <div style={{ fontSize: 12, fontFamily: SANS, color: C.textSec, marginBottom: 16 }}>
          {card.perspective} \u00b7 {card.rarity === "rare" ? "Rare" : "Common"} \u00b7 {card.chipId}
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
            <div style={{ fontSize: 14, color: C.cream, fontFamily: SANS, marginTop: 2 }}>{song?.title} \u2014 {card.perspective}</div>
          </div>
          <div style={{ ...skeuo.btnGhost, padding: "7px 14px", color: C.accent, fontSize: 9, fontFamily: MONO, letterSpacing: 2, cursor: "pointer", position: "relative", zIndex: 1 }}>PLAY</div>
        </div>

        {/* Completion */}
        <div style={{ fontSize: 9, fontFamily: MONO, letterSpacing: 3, color: C.textDim, marginBottom: 10 }}>
          {isBooster ? "BOOSTER" : "DROP"} COMPLETION
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
            {complete ? "\u2726 ALL 3 PERSPECTIVES \u2014 BONUS UNLOCKED" : `${uniquePerspectives} OF 3 \u2014 COLLECT ALL TO UNLOCK BONUS`}
          </div>
        </div>

        {/* Disconnect */}
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
            <div style={{ fontSize: 18, color: C.textDim, position: "relative", zIndex: 1 }}>\u203a</div>
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
                    background: `linear-gradient(180deg, #C87272, #B07272, #A06262)`,
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
