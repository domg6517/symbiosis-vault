"use client";
import { useState } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, NfcIcon, CheckIcon, LockSmall, StarIcon } from "./Icons";
import { SINGLES, BOOSTERS, PERSPECTIVES, generateUltraRares } from "./data";
import { SongRow } from "./SharedComponents";

const ULTRA_RARES = generateUltraRares();

export default function CollectionScreen({ ownedCards, onCardClick, onScan, onProfile }) {
  const [view, setView] = useState("singles");

  const linked = ownedCards.filter((c) => c.linked);
  const singleCards = linked.filter((c) => c.type === "single");
  const boosterCards = linked.filter((c) => c.type === "booster");

  const completeSingles = SINGLES.filter((s) => {
    const persps = new Set(singleCards.filter((c) => c.songId === s.id).map((c) => c.perspective));
    return persps.size === 3;
  }).length;

  const completeBoosters = BOOSTERS.filter((s) => {
    const persps = new Set(boosterCards.filter((c) => c.songId === s.id).map((c) => c.perspective));
    return persps.size === 3;
  }).length;

  const ownedUltraCount = ULTRA_RARES.filter((ur) => ur.owned).length;

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: C.bg, position: "relative",
    }}>
      <FilmGrain opacity={0.03} />

      {/* Header */}
      <div style={{ padding: "18px 20px 0", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: C.textDim, fontFamily: MONO }}>SYMBIOSIS VAULT</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 4, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>Collection</div>
          </div>
          <div onClick={onProfile} style={{
            width: 34, height: 34,
            ...skeuo.card,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 13, fontFamily: SERIF, color: C.textSec,
            borderRadius: 8,
          }}>D</div>
        </div>

        {/* Stats badges */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ ...skeuo.badge, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.accent, fontFamily: MONO, fontWeight: 600, fontSize: 12 }}>{linked.length}</span>
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: MONO }}>linked</span>
          </div>
          <div style={{ ...skeuo.badge, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.teal, fontFamily: MONO, fontWeight: 600, fontSize: 12 }}>{completeSingles}</span>
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: MONO }}>/10</span>
          </div>
          <div style={{ ...skeuo.badge, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.booster, fontFamily: MONO, fontWeight: 600, fontSize: 12 }}>{completeBoosters}</span>
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: MONO }}>/22</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 6, marginTop: 14, paddingBottom: 10,
          overflowX: "auto", scrollbarWidth: "none",
        }}>
          {[
            { key: "singles", label: "SINGLES", count: 10 },
            { key: "boosters", label: "BOOSTERS", count: 22 },
            { key: "ultra", label: "ULTRA RARES", count: 30 },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setView(tab.key)} style={{
              padding: "8px 16px",
              ...(view === tab.key ? skeuo.card : {}),
              background: view === tab.key ? `linear-gradient(180deg, #252220, #1A1816)` : "transparent",
              border: view === tab.key ? `1px solid rgba(255,255,255,0.06)` : `1px solid transparent`,
              borderRadius: 8,
              color: view === tab.key ? C.accent : C.textDim,
              fontSize: 9, fontFamily: MONO, letterSpacing: 2,
              cursor: "pointer", transition: "all 0.3s ease", whiteSpace: "nowrap",
              boxShadow: view === tab.key ? "0 1px 0 rgba(255,255,255,0.04) inset, 0 3px 8px rgba(0,0,0,0.3)" : "none",
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", zIndex: 1 }}>
        {view === "singles" && (
          <div>
            <div style={{
              display: "flex", alignItems: "center", padding: "14px 16px 8px",
              position: "sticky", top: 0, background: C.bg, zIndex: 2,
            }}>
              <div style={{ width: 80, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: C.textDim }}>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>G</div>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>J</div>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>J&J</div>
                <div style={{ flex: 1, textAlign: "left", paddingLeft: 8, fontSize: 8, color: C.textDim + "66" }}>DUPES →</div>
              </div>
              <div style={{ width: 32, flexShrink: 0 }} />
            </div>

            {SINGLES.map((song, idx) => (
              <SongRow
                key={song.id} song={song}
                ownedCards={ownedCards.filter((c) => c.type === "single")}
                onCardClick={onCardClick}
                isLast={idx === SINGLES.length - 1}
              />
            ))}

            <div style={{ margin: "16px 16px 20px", padding: "16px", ...skeuo.card, position: "relative", overflow: "hidden", textAlign: "center" }}>
              <div style={skeuo.gloss} />
              <div style={{ fontSize: 9, fontFamily: MONO, letterSpacing: 3, color: completeSingles === 10 ? C.accent : C.textDim, position: "relative", zIndex: 1 }}>
                {completeSingles === 10 ? "✦ ALL 10 SINGLES COMPLETE" : "COMPLETE ALL 10 SINGLES TO UNLOCK ULTIMATE REWARD"}
              </div>
              <div style={{ marginTop: 8, height: 4, ...skeuo.inset, overflow: "hidden", borderRadius: 4, position: "relative", zIndex: 1 }}>
                <div style={{ width: `${(completeSingles / 10) * 100}%`, height: "100%", ...skeuo.btnGold, borderRadius: 4, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.textDim, marginTop: 6, position: "relative", zIndex: 1 }}>{completeSingles} / 10</div>
            </div>
          </div>
        )}

        {view === "boosters" && (
          <div>
            <div style={{
              padding: "14px 20px 10px",
              fontSize: 13, fontFamily: SANS, color: C.textSec, lineHeight: 1.5,
            }}>
              Booster packs cover the rest of the album. Same rules — 3 perspectives per song, 70/30 common/rare split.
            </div>

            <div style={{
              display: "flex", alignItems: "center", padding: "8px 16px 8px",
              position: "sticky", top: 0, background: C.bg, zIndex: 2,
            }}>
              <div style={{ width: 80, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: C.textDim }}>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>G</div>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>J</div>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>J&J</div>
                <div style={{ flex: 1, textAlign: "left", paddingLeft: 8, fontSize: 8, color: C.textDim + "66" }}>DUPES →</div>
              </div>
              <div style={{ width: 32, flexShrink: 0 }} />
            </div>

            {BOOSTERS.map((song, idx) => (
              <SongRow
                key={song.id} song={song}
                ownedCards={ownedCards.filter((c) => c.type === "booster")}
                onCardClick={onCardClick}
                isBooster isLast={idx === BOOSTERS.length - 1}
              />
            ))}

            <div style={{ margin: "16px 16px 20px", padding: "16px", ...skeuo.card, position: "relative", overflow: "hidden", textAlign: "center" }}>
              <div style={skeuo.gloss} />
              <div style={{ fontSize: 9, fontFamily: MONO, letterSpacing: 3, color: C.textDim, position: "relative", zIndex: 1 }}>
                COMPLETE ALL 22 BOOSTERS TO UNLOCK BONUS
              </div>
              <div style={{ marginTop: 8, height: 4, ...skeuo.inset, overflow: "hidden", borderRadius: 4, position: "relative", zIndex: 1 }}>
                <div style={{ width: `${(completeBoosters / 22) * 100}%`, height: "100%", background: `linear-gradient(180deg, #8AAE98, #6B8E7B, #5A7D6A)`, boxShadow: "0 1px 0 rgba(255,255,255,0.2) inset", borderRadius: 4, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.textDim, marginTop: 6, position: "relative", zIndex: 1 }}>{completeBoosters} / 22</div>
            </div>
          </div>
        )}

        {view === "ultra" && (
          <div style={{ padding: "14px 20px" }}>
            <div style={{
              fontSize: 13, fontFamily: SANS, color: C.textSec, lineHeight: 1.6, marginBottom: 20,
            }}>
              3 hand-printed, signed polaroids per single. 30 total across all drops. Each is one of a kind.
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px", ...skeuo.card, position: "relative", overflow: "hidden",
              marginBottom: 16,
            }}>
              <div style={skeuo.gloss} />
              <StarIcon size={14} />
              <div style={{ flex: 1, fontSize: 12, fontFamily: SANS, color: C.textSec, position: "relative", zIndex: 1 }}>
                <span style={{ color: C.megaGold, fontFamily: MONO, fontWeight: 600 }}>{ownedUltraCount}</span> / 30 discovered
              </div>
              <div style={{ height: 4, width: 80, ...skeuo.inset, overflow: "hidden", borderRadius: 4, position: "relative", zIndex: 1 }}>
                <div style={{ width: `${(ownedUltraCount / 30) * 100}%`, height: "100%", background: `linear-gradient(180deg, #E4BC4A, #D4A43A, #C49430)`, boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset", borderRadius: 4 }} />
              </div>
            </div>

            {SINGLES.map((song) => {
              const songURs = ULTRA_RARES.filter((ur) => ur.songId === song.id);
              const songOwnedCount = songURs.filter((ur) => ur.owned).length;
              return (
                <div key={song.id} style={{ marginBottom: 12 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 0 6px",
                  }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.textDim, letterSpacing: 1 }}>{song.num}</div>
                    <div style={{ fontSize: 13, fontFamily: SANS, fontWeight: 500, color: C.textSec, flex: 1 }}>{song.title}</div>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: songOwnedCount > 0 ? C.megaGold : C.textDim, letterSpacing: 1 }}>
                      {songOwnedCount}/3
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {songURs.map((ur) => {
                      const pLabel = ur.perspective === "J&J" ? "J&J" : ur.perspective.split(" ")[1];
                      return (
                        <div key={ur.id} style={{
                          flex: 1, padding: "10px 6px", textAlign: "center",
                          ...(ur.owned ? skeuo.card : skeuo.inset),
                          position: "relative", overflow: "hidden",
                        }}>
                          {ur.owned && <div style={skeuo.gloss} />}
                          {ur.owned ? (
                            <>
                              <StarIcon size={12} />
                              <div style={{ fontSize: 13, fontFamily: SERIF, fontWeight: 300, color: C.cream, marginTop: 4, position: "relative", zIndex: 1 }}>{pLabel}</div>
                              <div style={{ fontSize: 7, fontFamily: MONO, color: C.megaGold, letterSpacing: 2, marginTop: 3, position: "relative", zIndex: 1 }}>OWNED</div>
                            </>
                          ) : (
                            <>
                              <LockSmall color={C.textDim} />
                              <div style={{ fontSize: 11, fontFamily: SANS, color: C.textDim, marginTop: 4 }}>{pLabel}</div>
                              <div style={{ fontSize: 7, fontFamily: MONO, color: C.textDim, letterSpacing: 1, marginTop: 3 }}>SEALED</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Nav — raised dock */}
      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "6px 16px 22px",
        position: "relative", zIndex: 2,
        background: `linear-gradient(180deg, transparent, ${C.bg} 30%)`,
      }}>
        <div style={{
          ...skeuo.badge, padding: "8px 20px",
          fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: C.accent, cursor: "pointer",
        }}>VAULT</div>
        <div onClick={onScan} style={{
          width: 54, height: 54, borderRadius: "50%",
          ...skeuo.card,
          border: `1.5px solid ${C.accent}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", marginTop: -18,
          boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(0,0,0,0.4), 0 0 20px ${C.accentDim}`,
        }}>
          <NfcIcon size={18} color={C.accent} />
        </div>
        <div onClick={onProfile} style={{
          ...skeuo.badge, padding: "8px 20px",
          fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: C.textDim, cursor: "pointer",
        }}>PROFILE</div>
      </div>
    </div>
  );
}
