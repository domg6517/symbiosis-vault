"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, NfcIcon, CheckIcon, LockSmall, StarIcon, TrophyIcon, ProfileIcon } from "./Icons";
import { SINGLES, BOOSTERS, PERSPECTIVES, generateUltraRares } from "./data";
import { SongRow } from "./SharedComponents";
import ActivityFeed from "./ActivityFeed";

export default function CollectionScreen({ ownedCards, onCardClick, onScan, onLeaderboard, onProfile, onViewCollector, onRefresh, session }) {
  const [view, setView] = useState("singles");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [urData, setUrData] = useState({}); // chipId -> { owner, isOwnedByMe, imageUrl }
  const [selectedUR, setSelectedUR] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  // Derive owned ultra rares from ownedCards prop
  const ownedURCards = ownedCards.filter((c) => c.rarity === "ultra_rare" && c.linked);
  const ULTRA_RARES = generateUltraRares().map((ur) => {
    const match = ownedURCards.find(
      (c) => c.songId === ur.songId && c.perspective === ur.perspective
    );
    return { ...ur, owned: !!match, imageUrl: match?.imageUrl || null, chipId: match?.chipId || null };
  });

  const linked = ownedCards.filter((c) => c.linked);
  const singleCards = linked.filter((c) => c.type === "single" && c.rarity !== "ultra_rare");
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

  // Fetch ultra rare owner data
  useEffect(() => {
    async function fetchURData() {
      try {
        const res = await fetch("/api/ultra-rare/list", {
          headers: session?.access_token
            ? { Authorization: "Bearer " + session.access_token }
            : {},
        });
        const data = await res.json();
        if (data.ultraRares) {
          const map = {};
          data.ultraRares.forEach((ur) => {
            const val = { owner: ur.owner, isOwnedByMe: ur.isOwnedByMe, imageUrl: ur.imageUrl };
            if (ur.chipId) map[ur.chipId] = val;
            map[ur.songId + "-" + ur.perspective] = val;
          });
          setUrData(map);
        }
      } catch (e) {
        console.error("UR data fetch error:", e);
      }
    }
    fetchURData();
  }, [session]);

  async function handleSearch(q) {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);

    try {
      const res = await fetch("/api/users/search?q=" + encodeURIComponent(q.trim()), {
        headers: session?.access_token ? { Authorization: "Bearer " + session.access_token } : {},
      });
      const data = await res.json();
      if (data.users) setSearchResults(data.users);
    } catch (e) {
      console.error("Search error:", e);
    }
    setSearching(false);
  }

  async function handleDisconnectUR(chipId) {
    if (!session?.access_token || !chipId) return;
    setDisconnecting(true);
    try {
      await fetch("/api/cards/unlink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.access_token,
        },
        body: JSON.stringify({ chipId }),
      });
      setSelectedUR(null);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error("Disconnect error:", e);
    }
    setDisconnecting(false);
  }

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
            <div style={{ width: 34, height: 34, ...skeuo.card, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
              <img src="/vault-logo.png" style={{ width: 34, height: 34, borderRadius: 8, display: "block" }} alt="" />
            </div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: C.textDim, fontFamily: MONO }}>{"SYMBIOSIS VAULT"}</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 4, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>Collection</div>
          </div>
          <div style={{ flex: 1 }} />
          <div onClick={() => setSearchOpen(true)} style={{
            width: 34, height: 34, marginLeft: 6,
            ...skeuo.card,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", borderRadius: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSec} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div onClick={onProfile} style={{
            width: 34, height: 34, marginLeft: 6,
            ...skeuo.card,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", borderRadius: 8,
          }}><ProfileIcon size={16} color={C.textSec} /></div>
          <div onClick={onLeaderboard} style={{
            width: 34, height: 34, marginLeft: 6,
            ...skeuo.card,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", borderRadius: 8,
          }}><TrophyIcon size={16} color={C.textSec} /></div>
        </div>

        {/* Stats badges */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ ...skeuo.badge, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.accent, fontFamily: MONO, fontWeight: 600, fontSize: 12 }}>{linked.length}</span>
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: MONO }}>linked</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 6, marginTop: 14, paddingBottom: 10,
          overflowX: "auto", scrollbarWidth: "none",
        }}>
          {[
            { key: "singles", label: "I" },
            { key: "boosters", label: "II" },
            { key: "ultra", label: "1/1" },
            { key: "feed", label: "FEED" },
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
        {/* Empty State */}
        {linked.length === 0 && (
          <div style={{ padding: "20px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: C.cream }}>Your vault is empty</div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 8, lineHeight: 1.5, maxWidth: 260 }}>
                Scan the NFC chip on the back of any Symbiosis photo card to add it to your collection.
              </div>
            </div>
            <div onClick={onScan} style={{
              ...skeuo.card, marginTop: 24, padding: "14px 32px", borderRadius: 14,
              border: "1px solid " + C.accent + "33", cursor: "pointer",
              background: "linear-gradient(180deg, rgba(162,160,180,0.1), transparent)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <NfcIcon size={16} color={C.accent} />
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: C.accent, fontWeight: 600 }}>SCAN YOUR FIRST CARD</span>
            </div>
            <a href="https://jackandjack.store/" target="_blank" rel="noopener noreferrer" style={{
              marginTop: 14, fontFamily: MONO, fontSize: 9, letterSpacing: 2, color: C.textDim,
              textDecoration: "none", padding: "10px 20px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
            }}>GET MORE CARDS</a>
          </div>
        )}

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
              </div>
              <div style={{ width: 32, flexShrink: 0 }} />
            </div>
            {SINGLES.map((song, idx) => (
              <SongRow
                key={song.id} song={song}
                ownedCards={ownedCards.filter((c) => c.type === "single" && c.rarity !== "ultra_rare")}
                onCardClick={onCardClick}
                isLast={idx === SINGLES.length - 1}
              />
            ))}
          </div>
        )}

        {view === "boosters" && (
          <div>
            <div style={{
              padding: "14px 20px 10px",
              fontSize: 13, fontFamily: SANS, color: C.textSec, lineHeight: 1.5,
            }}>
              More to come. Stay tuned.
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
          </div>
        )}

        {view === "feed" && <ActivityFeed session={session} onViewCollector={onViewCollector} />}

        {view === "ultra" && (
          <div style={{ padding: "14px 20px" }}>
            <div style={{
              fontSize: 13, fontFamily: SANS, color: C.textSec, lineHeight: 1.6, marginBottom: 20,
            }}>
              Something special. More details coming soon.
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px", ...skeuo.card, position: "relative", overflow: "hidden",
              marginBottom: 16,
            }}>
              <div style={skeuo.gloss} />
              <StarIcon size={14} />
              <div style={{ flex: 1, fontSize: 12, fontFamily: SANS, color: C.textSec, position: "relative", zIndex: 1 }}>
                <span style={{ color: C.megaGold, fontFamily: MONO, fontWeight: 600 }}>{ownedUltraCount}</span> discovered
              </div>
              <div style={{ height: 4, width: 80, ...skeuo.inset, overflow: "hidden", borderRadius: 4, position: "relative", zIndex: 1 }}>
                <div style={{ width: `${(ownedUltraCount / 30) * 100}%`, height: "100%", background: `linear-gradient(180deg, #A2A0B4, #B8B6D0, #8280A0)`, boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset", borderRadius: 4 }} />
              </div>
            </div>

            {SINGLES.map((song) => {
              const songURs = ULTRA_RARES.filter((ur) => ur.songId === song.id);
              const songOwnedCount = songURs.filter((ur) => ur.owned).length;
              return (
                <div key={song.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0 6px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.textDim, letterSpacing: 1 }}>{song.num}</div>
                    <div style={{ fontSize: 13, fontFamily: SANS, fontWeight: 500, color: C.textSec, flex: 1 }}>{song.title}</div>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: songOwnedCount > 0 ? C.megaGold : C.textDim, letterSpacing: 1 }}>
                      {songOwnedCount} found
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {songURs.map((ur) => {
                      const pLabel = ur.perspective === "J&J" ? "J&J" : ur.perspective.split(" ")[1];
                      const liveData = ur.chipId ? urData[ur.chipId] : urData[ur.songId + "-" + ur.perspective];
                      const ownerInfo = liveData?.owner || null;
                      const isOwnedByMe = liveData?.isOwnedByMe || false;
                      const liveImageUrl = liveData?.imageUrl || ur.imageUrl;
                      const anyoneOwns = !!ownerInfo;

                      return (
                        <div
                          key={ur.id}
                          onClick={() => {
                            if (ur.owned || anyoneOwns) {
                              setSelectedUR({ ...ur, ownerInfo, isOwnedByMe, imageUrl: liveImageUrl });
                            }
                          }}
                          style={{
                            flex: 1, padding: "10px 6px", textAlign: "center",
                            position: "relative", overflow: "hidden",
                            borderRadius: 10,
                            cursor: (ur.owned || anyoneOwns) ? "pointer" : "default",
                            ...(ur.owned
                              ? {
                                  background: "linear-gradient(145deg, #2A2416, #1E1A0E, #2A2416)",
                                  boxShadow: "0 1px 0 rgba(228,188,74,0.15) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 4px 12px rgba(0,0,0,0.5), 0 0 16px rgba(184,160,60,0.12)",
                                  border: "1px solid rgba(228,188,74,0.35)",
                                }
                              : anyoneOwns
                              ? {
                                  background: "linear-gradient(145deg, #1E1A10, #171410)",
                                  border: "1px solid rgba(228,188,74,0.18)",
                                  boxShadow: "0 0 8px rgba(184,160,60,0.06)",
                                }
                              : skeuo.inset),
                          }}
                        >
                          {ur.owned ? (
                            <>
                              {liveImageUrl ? (
                                <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", borderRadius: 6, marginBottom: 6 }}>
                                  <img src={liveImageUrl} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="" />
                                </div>
                              ) : (
                                <StarIcon size={12} />
                              )}
                              <div style={{ fontSize: 11, fontFamily: SERIF, fontWeight: 300, color: "#E4BC4A", marginTop: liveImageUrl ? 0 : 4, position: "relative", zIndex: 1 }}>{pLabel}</div>
                              <div style={{ fontSize: 7, fontFamily: MONO, color: "#C4A030", letterSpacing: 2, marginTop: 3, position: "relative", zIndex: 1 }}>1 OF 1</div>
                            </>
                          ) : anyoneOwns ? (
                            <>
                              {liveImageUrl ? (
                                <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", borderRadius: 6, marginBottom: 6 }}>
                                  <img src={liveImageUrl} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="" />
                                </div>
                              ) : (
                                <StarIcon size={12} />
                              )}
                              <div style={{ fontSize: 11, fontFamily: SERIF, fontWeight: 300, color: "#E4BC4A", marginTop: liveImageUrl ? 0 : 4, position: "relative", zIndex: 1 }}>{pLabel}</div>
                              <div style={{ fontSize: 7, fontFamily: MONO, color: C.textDim, letterSpacing: 1, marginTop: 3, position: "relative", zIndex: 1 }}>{ownerInfo?.username || "OWNED"}</div>
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

      {/* Bottom Nav */}
      <div style={{
        display: "flex", justifyContent: "space-evenly", alignItems: "center",
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

      {/* Search Users Modal */}
      {searchOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "60px 20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, ...skeuo.inset, padding: 2 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search collectors..."
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                style={{ width: "100%", padding: "12px", background: "transparent", border: "none", color: C.cream, fontSize: 15, fontFamily: SANS, outline: "none", boxSizing: "border-box", caretColor: C.accent }}
              />
            </div>
            <div onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }} style={{ fontSize: 12, fontFamily: MONO, color: C.textDim, cursor: "pointer", padding: "8px 12px", letterSpacing: 1 }}>CLOSE</div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "0 20px" }}>
            {searching && <div style={{ textAlign: "center", padding: 20, fontSize: 11, fontFamily: MONO, color: C.textDim, letterSpacing: 2 }}>SEARCHING...</div>}
            {!searching && searchQuery && searchResults.length === 0 && (
              <div style={{ textAlign: "center", padding: 30, fontSize: 13, fontFamily: SANS, color: C.textDim }}>No collectors found</div>
            )}
            {searchResults.map((user) => (
              <div key={user.user_id} onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); onViewCollector(user); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid " + C.border, cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", ...skeuo.inset, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.accent, fontFamily: SERIF, fontWeight: 600 }}>
                  {(user.display_name || "?")[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontFamily: SANS, color: C.cream, fontWeight: 500 }}>{user.display_name}</div>
                </div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: C.textDim, letterSpacing: 1 }}>VIEW</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ultra Rare Detail Sheet */}
      {selectedUR && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedUR(null); }}
        >
          <div style={{
            background: "linear-gradient(180deg, #1A1714, #0F0E0C)",
            borderRadius: "20px 20px 0 0",
            padding: "24px 24px 40px",
            border: "1px solid rgba(228,188,74,0.2)",
            borderBottom: "none",
            boxShadow: "0 -4px 40px rgba(0,0,0,0.6)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div onClick={() => setSelectedUR(null)} style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", cursor: "pointer" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              {selectedUR.imageUrl ? (
                <div style={{
                  width: 120, height: 160, borderRadius: 10, overflow: "hidden",
                  border: "1.5px solid rgba(228,188,74,0.4)",
                  boxShadow: "0 0 24px rgba(184,160,60,0.25)",
                }}>
                  <img src={selectedUR.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                </div>
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: 14,
                  background: "linear-gradient(145deg, #2A2416, #1E1A0E)",
                  border: "1.5px solid rgba(228,188,74,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <StarIcon size={24} />
                </div>
              )}
            </div>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: "#E4BC4A", marginBottom: 4 }}>
                {selectedUR.perspective === "J&J" ? "J&J" : selectedUR.perspective?.split(" ")[1] || selectedUR.perspective}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: 2 }}>
                {selectedUR.songNum} · {selectedUR.songTitle}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: "#C4A030", letterSpacing: 3, marginTop: 6 }}>1 OF 1</div>
            </div>

            <div style={{ ...skeuo.inset, padding: "16px", borderRadius: 14, marginBottom: selectedUR.isOwnedByMe ? 16 : 0 }}>
              {selectedUR.isOwnedByMe ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E4BC4A", boxShadow: "0 0 6px #E4BC4A" }} />
                  <div style={{ fontFamily: SANS, fontSize: 14, color: C.cream, fontWeight: 500 }}>You own this</div>
                </div>
              ) : selectedUR.ownerInfo ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                  onClick={() => {
                    setSelectedUR(null);
                    if (onViewCollector && selectedUR.ownerInfo) {
                      onViewCollector({ user_id: selectedUR.ownerInfo.userId, display_name: selectedUR.ownerInfo.username });
                    }
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", ...skeuo.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.accent, fontFamily: SERIF, fontWeight: 600 }}>
                    {(selectedUR.ownerInfo.username || "?")[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginBottom: 1 }}>Owned by</div>
                    <div style={{ fontFamily: SANS, fontSize: 15, color: C.cream, fontWeight: 500 }}>{selectedUR.ownerInfo.username}</div>
                  </div>
                  <div style={{ fontSize: 14, color: C.textDim }}>{String.fromCodePoint(0x2197)}</div>
                </div>
              ) : (
                <div style={{ fontFamily: SANS, fontSize: 14, color: C.textDim, textAlign: "center" }}>Unclaimed</div>
              )}
            </div>

            {selectedUR.isOwnedByMe && selectedUR.chipId && (
              <div
                onClick={() => !disconnecting && handleDisconnectUR(selectedUR.chipId)}
                style={{
                  padding: "14px", borderRadius: 12,
                  border: "1px solid rgba(176,114,114,0.3)",
                  background: "linear-gradient(180deg, rgba(176,114,114,0.08), transparent)",
                  textAlign: "center",
                  cursor: disconnecting ? "default" : "pointer",
                  opacity: disconnecting ? 0.5 : 1,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: C.rose }}>
                  {disconnecting ? "DISCONNECTING..." : "DISCONNECT CARD"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}