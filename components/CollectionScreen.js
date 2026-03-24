"use client";
import { useState, useEffect } from "react";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { FilmGrain, NfcIcon, CheckIcon, LockSmall, StarIcon, TrophyIcon, ProfileIcon } from "./Icons";
import { SINGLES, BOOSTERS, PERSPECTIVES, generateUltraRares } from "./data";
import { SongRow } from "./SharedComponents";
import ActivityFeed from "./ActivityFeed";

const BASE_ULTRA_RARES = generateUltraRares();

export default function CollectionScreen({ ownedCards, onCardClick, onScan, onLeaderboard, onProfile, onViewCollector, session }) {
  const [view, setView] = useState("singles")
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [ultraRaresData, setUltraRaresData] = useState(null);
  const [selectedUR, setSelectedUR] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

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

  useEffect(() => {
    if (view !== "ultra") return;
    const headers = session?.access_token ? { Authorization: "Bearer " + session.access_token } : {};
    fetch("/api/ultra-rare/list", { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.ultraRares) setUltraRaresData(d.ultraRares); })
      .catch(() => {});
  }, [view, session?.access_token]);

  const ultraRares = ultraRaresData || BASE_ULTRA_RARES;
  const ownedUltraCount = ultraRaresData
    ? ultraRaresData.filter((ur) => ur.isOwnedByMe).length
    : BASE_ULTRA_RARES.filter((ur) => ur.owned).length;

  async function handleDisconnectUR(ur) {
    if (!session?.access_token || disconnecting) return;
    setDisconnecting(true);
    try {
      const res = await fetch("/api/ultra-rare/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + session.access_token },
        body: JSON.stringify({ ultraRareId: ur.id }),
      });
      if (res.ok) {
        // Mirror how regular card unlinks work: update local state directly, no re-fetch
        setUltraRaresData(prev => prev
          ? prev.map(u => u.id === ur.id ? { ...u, isOwnedByMe: false, owner: null } : u)
          : prev
        );
        setSelectedUR(null);
      }
    } catch (e) {}
    setDisconnecting(false);
  }

  async function handleSearch(q) {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch("/api/users/search?q=" + encodeURIComponent(q.trim()), { headers: session?.access_token ? { Authorization: "Bearer " + session.access_token } : {} });
      const data = await res.json();
      if (data.users) setSearchResults(data.users);
    } catch (e) {}
    setSearching(false);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bg, position: "relative" }}>
      <FilmGrain opacity={0.03} />

      <div style={{ padding: "18px 20px 0", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ width: 34, height: 34, ...skeuo.card, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
              <img src="/vault-logo.png" style={{ width: 34, height: 34, borderRadius: 8, display: "block" }} alt="" />
            </div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: C.textDim, fontFamily: MONO }}>SYMBIOSIS VAULT</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: C.cream, fontFamily: SERIF, marginTop: 4, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>Collection</div>
          </div>
          <div style={{ flex: 1 }} />
          <div onClick={() => setSearchOpen(true)} style={{ width: 34, height: 34, marginLeft: 6, ...skeuo.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSec} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div onClick={onProfile} style={{ width: 34, height: 34, marginLeft: 6, ...skeuo.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8 }}>
            <ProfileIcon size={16} color={C.textSec} />
          </div>
          <div onClick={onLeaderboard} style={{ width: 34, height: 34, marginLeft: 6, ...skeuo.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8 }}>
            <TrophyIcon size={16} color={C.textSec} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ ...skeuo.badge, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.accent, fontFamily: MONO, fontWeight: 600, fontSize: 12 }}>{linked.length}</span>
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: MONO }}>linked</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 14, paddingBottom: 10, overflowX: "auto", scrollbarWidth: "none" }}>
          {[
            { key: "singles", label: "I" },
            { key: "boosters", label: "II" },
            { key: "ultra", label: "1/1" },
            { key: "feed", label: "FEED" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setView(tab.key)} style={{
              padding: "8px 16px",
              ...(view === tab.key ? skeuo.card : {}),
              background: view === tab.key ? "linear-gradient(180deg,#252220,#1A1816)" : "transparent",
              border: view === tab.key ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
              borderRadius: 8,
              color: view === tab.key ? (tab.key === "ultra" ? C.megaGold : C.accent) : C.textDim,
              fontSize: 9, fontFamily: MONO, letterSpacing: 2,
              cursor: "pointer", transition: "all 0.3s ease", whiteSpace: "nowrap",
              boxShadow: view === tab.key ? "0 1px 0 rgba(255,255,255,0.04) inset, 0 3px 8px rgba(0,0,0,0.3)" : "none",
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", zIndex: 1 }}>
        {linked.length === 0 && (
          <div style={{ padding: "20px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: C.cream }}>Your vault is empty</div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, marginTop: 8, lineHeight: 1.5, maxWidth: 260 }}>Scan the NFC chip on the back of any Symbiosis photo card to add it to your collection.</div>
            </div>
            <div onClick={onScan} style={{ ...skeuo.card, marginTop: 24, padding: "14px 32px", borderRadius: 14, border: "1px solid " + C.accent + "33", cursor: "pointer", background: "linear-gradient(180deg,rgba(162,160,180,0.1),transparent)", display: "flex", alignItems: "center", gap: 10 }}>
              <NfcIcon size={16} color={C.accent} />
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: C.accent, fontWeight: 600 }}>SCAN YOUR FIRST CARD</span>
            </div>
            <a href="https://jackandjack.store/" target="_blank" rel="noopener noreferrer" style={{ marginTop: 14, fontFamily: MONO, fontSize: 9, letterSpacing: 2, color: C.textDim, textDecoration: "none", padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>GET MORE CARDS</a>
          </div>
        )}

        {view === "singles" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 16px 8px", position: "sticky", top: 0, background: C.bg, zIndex: 2 }}>
              <div style={{ width: 80, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: C.textDim }}>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>G</div>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>J</div>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>J&J</div>
              </div>
              <div style={{ width: 32, flexShrink: 0 }} />
            </div>
            {SINGLES.map((song, idx) => (
              <SongRow key={song.id} song={song} ownedCards={ownedCards.filter((c) => c.type === "single")} onCardClick={onCardClick} isLast={idx === SINGLES.length - 1} />
            ))}
          </div>
        )}

        {view === "boosters" && (
          <div>
            <div style={{ padding: "14px 20px 10px", fontSize: 13, fontFamily: SANS, color: C.textSec, lineHeight: 1.5 }}>More to come. Stay tuned.</div>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 16px 8px", position: "sticky", top: 0, background: C.bg, zIndex: 2 }}>
              <div style={{ width: 80, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: C.textDim }}>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>G</div>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>J</div>
                <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>J&J</div>
              </div>
              <div style={{ width: 32, flexShrink: 0 }} />
            </div>
            {BOOSTERS.map((song, idx) => (
              <SongRow key={song.id} song={song} ownedCards={ownedCards.filter((c) => c.type === "booster")} onCardClick={onCardClick} isBooster isLast={idx === BOOSTERS.length - 1} />
            ))}
          </div>
        )}

        {view === "feed" && <ActivityFeed session={session} onViewCollector={onViewCollector} />}

        {view === "ultra" && (
          <div style={{ padding: "14px 20px" }}>
            <div style={{ fontSize: 13, fontFamily: SANS, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>
              One of a kind. Each 1/1 belongs to a single collector.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", ...skeuo.card, position: "relative", overflow: "hidden", marginBottom: 16 }}>
              <div style={skeuo.gloss} />
              <StarIcon size={14} />
              <div style={{ flex: 1, fontSize: 12, fontFamily: SANS, color: C.textSec, position: "relative", zIndex: 1 }}>
                <span style={{ color: C.megaGold, fontFamily: MONO, fontWeight: 600 }}>{ownedUltraCount}</span> discovered
              </div>
              <div style={{ height: 4, width: 80, ...skeuo.inset, overflow: "hidden", borderRadius: 4, position: "relative", zIndex: 1 }}>
                <div style={{ width: (ownedUltraCount / 30) * 100 + "%", height: "100%", background: "linear-gradient(180deg,#A2A0B4,#B8B6D0,#8280A0)", boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset", borderRadius: 4 }} />
              </div>
            </div>
            {SINGLES.map((song) => {
              const songURs = BASE_ULTRA_RARES.filter((ur) => ur.songId === song.id).map(b => ultraRares.find(a => a.id === b.id) || b);
              const songOwnedCount = songURs.filter((ur) => ur.isOwnedByMe || ur.owned).length;
              return (
                <div key={song.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0 6px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.textDim, letterSpacing: 1 }}>{song.num}</div>
                    <div style={{ fontSize: 13, fontFamily: SANS, fontWeight: 500, color: C.textSec, flex: 1 }}>{song.title}</div>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: songOwnedCount > 0 ? C.megaGold : C.textDim, letterSpacing: 1 }}>{songOwnedCount} found</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {songURs.map((ur) => {
                      const pLabel = ur.perspective === "J&J" ? "J&J" : ur.perspective ? ur.perspective.split(" ")[1] : "?";
                      const isOwned = ur.isOwnedByMe || ur.owned;
                      const hasImage = !!ur.imageUrl;
                      const isClaimed = !!ur.owner || isOwned;
                      return (
                        <div
                          key={ur.id}
                          onClick={() => (isClaimed || hasImage) ? setSelectedUR(ur) : null}
                          style={{
                            flex: 1, textAlign: "center",
                            ...(isOwned ? skeuo.card : skeuo.inset),
                            position: "relative", overflow: "hidden",
                            border: isOwned ? "1.5px solid " + C.megaGold + "55" : undefined,
                            cursor: isClaimed ? "pointer" : "default",
                            padding: hasImage && isClaimed ? 0 : "10px 6px",
                            borderRadius: 8,
                          }}
                        >
                          {isOwned && !hasImage && <div style={skeuo.gloss} />}
                          {hasImage && isClaimed ? (
                            <div style={{ position: "relative" }}>
                              <img src={ur.imageUrl} alt={pLabel + " 1/1"} style={{ width: "100%", display: "block", borderRadius: 6 }} />
                              {isOwned && (
                                <div style={{ position: "absolute", top: 4, right: 4, background: C.megaGold, borderRadius: 4, padding: "2px 5px", fontSize: 7, fontFamily: MONO, letterSpacing: 1, color: "#000", fontWeight: 700 }}>MINE</div>
                              )}
                            </div>
                          ) : isOwned ? (
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

      <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", padding: "6px 16px 22px", position: "relative", zIndex: 2, background: "linear-gradient(180deg,transparent," + C.bg + " 30%)" }}>
        <div style={{ ...skeuo.badge, padding: "8px 20px", fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: C.accent, cursor: "pointer" }}>VAULT</div>
        <div onClick={onScan} style={{ width: 54, height: 54, borderRadius: "50%", ...skeuo.card, border: "1.5px solid " + C.accent + "44", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: -18, boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(0,0,0,0.4), 0 0 20px " + C.accentDim }}>
          <NfcIcon size={18} color={C.accent} />
        </div>
        <div onClick={onProfile} style={{ ...skeuo.badge, padding: "8px 20px", fontSize: 9, fontFamily: MONO, letterSpacing: 2, color: C.textDim, cursor: "pointer" }}>PROFILE</div>
      </div>

      {selectedUR && (
        <div onClick={() => setSelectedUR(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 320, ...skeuo.card, borderRadius: 16, padding: 24, textAlign: "center", position: "relative" }}>
            <div onClick={() => setSelectedUR(null)} style={{ position: "absolute", top: 12, left: 12, ...skeuo.card, width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, zIndex: 1 }}>{String.fromCodePoint(0x2190)}</div>
            {selectedUR.imageUrl && (
              <img src={selectedUR.imageUrl} alt="1/1" style={{ width: "100%", borderRadius: 10, marginBottom: 16, display: "block" }} />
            )}
            <div style={{ fontSize: 9, fontFamily: MONO, letterSpacing: 3, color: C.megaGold, marginBottom: 6 }}>1 OF 1</div>
            <div style={{ fontSize: 18, fontFamily: SERIF, fontWeight: 300, color: C.cream }}>
              {selectedUR.perspective === "J&J" ? "Jack & Jack" : selectedUR.perspective}
            </div>
            <div style={{ fontSize: 11, fontFamily: SANS, color: C.textSec, marginTop: 4 }}>{selectedUR.songTitle}</div>
            {selectedUR.owner && !selectedUR.isOwnedByMe && (
              <div onClick={() => { setSelectedUR(null); onViewCollector({ user_id: selectedUR.owner.userId, display_name: selectedUR.owner.username }); }} style={{ marginTop: 14, padding: "8px 14px", ...skeuo.inset, borderRadius: 8, cursor: "pointer" }}>
                <div style={{ fontSize: 9, fontFamily: MONO, color: C.textDim, letterSpacing: 2 }}>OWNED BY</div>
                <div style={{ fontSize: 14, fontFamily: SANS, color: C.accent, fontWeight: 500, marginTop: 4 }}>{selectedUR.owner.username}</div>
              </div>
            )}
            {selectedUR.isOwnedByMe && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 9, fontFamily: MONO, color: C.megaGold, letterSpacing: 2, marginBottom: 12 }}>YOU OWN THIS</div>
                <button
                  onClick={() => handleDisconnectUR(selectedUR)}
                  disabled={disconnecting}
                  style={{ width: "100%", padding: "12px", background: "transparent", border: "1px solid " + C.rose + "66", borderRadius: 8, color: C.rose, fontFamily: MONO, fontSize: 10, letterSpacing: 3, cursor: disconnecting ? "default" : "pointer", opacity: disconnecting ? 0.5 : 1 }}
                >
                  {disconnecting ? "DISCONNECTING..." : "DISCONNECT"}
                </button>
                <div style={{ fontSize: 10, fontFamily: SANS, color: C.textDim, marginTop: 8, lineHeight: 1.4 }}>Disconnecting releases the card. The chip becomes available again and you lose 5 pts.</div>
              </div>
            )}
            {!selectedUR.owner && !selectedUR.isOwnedByMe && (
              <div style={{ marginTop: 14, fontSize: 13, fontFamily: SANS, color: C.textDim }}>No one has claimed this yet.</div>
            )}
            <div style={{ marginTop: 16, fontSize: 10, fontFamily: MONO, color: C.textDim, letterSpacing: 2, cursor: "pointer", opacity: 0.5 }} onClick={() => setSelectedUR(null)}>CLOSE</div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "60px 20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, ...skeuo.inset, padding: 2 }}>
              <input
                type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search collectors..." autoFocus autoCapitalize="none" autoCorrect="off"
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
    </div>
  );
          }
