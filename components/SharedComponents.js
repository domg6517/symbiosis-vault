"use client";
import { C, SERIF, SANS, MONO, skeuo } from "./design";
import { LockSmall } from "./Icons";
import { PERSPECTIVES } from "./data";

// ─── MINI PHOTO CARD (SKEUOMORPHIC) ──────────
export const MiniPhotoCard = ({ perspective, rarity, count, onClick, isBooster = false, imageUrl = null, editionNum = null }) => {
  const label = perspective === "J&J" ? "J&J" : perspective.split(" ")[1];
  const isRare = rarity === "rare";
  return (
    <div onClick={onClick} style={{
      width: 52, height: 66, flexShrink: 0,
      background: `linear-gradient(170deg, ${isBooster ? "#EBE8E0" : "#F0EBE2"}, ${isBooster ? "#DDD9CF" : "#E4DDD0"})`,
      padding: 3, cursor: "pointer", position: "relative",
      boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset, 0 2px 6px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)",
      borderRadius: 2,
    }}>
      <div style={{
        width: "100%", height: "70%",
        background: isBooster
          ? `linear-gradient(140deg, #141C17, #1A221D)`
          : `linear-gradient(140deg, #1A1714, #1E1C17)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3) inset",
      }}>
        {!imageUrl && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)" }} />}
        {imageUrl ? (
          <img src={imageUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", inset: 0, zIndex: 1 }} />
        ) : (
          <div style={{ fontSize: 12, fontWeight: 300, color: C.cream, fontFamily: SERIF, zIndex: 1, letterSpacing: 1 }}>{label}</div>
        )}
        {isRare && (
          <div style={{ position: "absolute", top: 2, right: 3, fontSize: 6, color: C.purple, fontFamily: MONO }}>R</div>
        )}
        {isBooster && (
          <div style={{ position: "absolute", bottom: 2, left: 3, fontSize: 5, color: C.booster, fontFamily: MONO, letterSpacing: 1 }}>B</div>
        )}
      </div>
      <div style={{
        textAlign: "center", paddingTop: 2,
        fontSize: 6, fontFamily: SERIF, fontStyle: "italic", color: "#5A5550",
      }}>{label}</div>
      {count > 1 && (
        <div style={{
          position: "absolute", top: -4, right: -4,
          width: 16, height: 16, borderRadius: "50%",
          ...skeuo.btnGold,
          color: C.bg, fontSize: 9, fontFamily: MONO, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{count}</div>
      )}
    </div>
  );
};

export const EmptyCell = () => (
  <div style={{
    width: 52, height: 66, flexShrink: 0,
    ...skeuo.inset,
    display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5,
  }}><LockSmall /></div>
);

// ─── SONG ROW (SKEUOMORPHIC) ─────────────────
export const SongRow = ({ song, ownedCards, onCardClick, isBooster = false, isLast = false }) => {
  const songCards = ownedCards.filter((c) => c.songId === song.id && c.linked);
  const uniquePerspectives = new Set(songCards.map((c) => c.perspective)).size;
  const complete = uniquePerspectives === 3;

  const perspGroups = PERSPECTIVES.map((persp) => {
    const matching = songCards.filter((c) => c.perspective === persp);
    return { perspective: persp, cards: matching };
  });

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center",
        padding: "10px 16px", minHeight: 82,
        background: complete ? `linear-gradient(135deg, rgba(162,160,180,0.06), rgba(162,160,180,0.02))` : "transparent",
        transition: "background 0.3s ease",
      }}>
        <div style={{ width: 80, flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontFamily: MONO, color: isBooster ? C.booster : C.textDim, letterSpacing: 1, marginBottom: 2 }}>
            {isBooster ? `B${song.num}` : song.num}
          </div>
          <div style={{
            fontSize: 13, fontFamily: SANS, fontWeight: 500,
            color: complete ? C.cream : C.textSec, lineHeight: 1.2,
          }}>{song.title}</div>
          <div style={{ fontSize: 9, fontFamily: MONO, color: C.textDim, marginTop: 3 }}>
            {songCards.length} card{songCards.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div style={{
          flex: 1, display: "flex", gap: 6,
          overflowX: "auto", padding: "4px 4px",
          scrollbarWidth: "none", msOverflowStyle: "none",
        }}>
          {perspGroups.map((pg) => {
            if (pg.cards.length === 0) {
              return <EmptyCell key={pg.perspective} />;
            }
            return pg.cards.map((card, ci) => (
              <MiniPhotoCard
                key={card.chipId}
                perspective={card.perspective}
                rarity={card.rarity}
                count={ci === 0 ? pg.cards.length : 0}
                onClick={() => onCardClick(card)}
                isBooster={isBooster}
                imageUrl={card.imageUrl}
              />
            ));
          })}
        </div>

        <div style={{ width: 32, textAlign: "center", flexShrink: 0 }}>
          {complete ? (
            <div style={{ width: 24, height: 24, borderRadius: "50%", ...skeuo.card, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round"><path d="M4 10l4 4 8-8" /></svg>
            </div>
          ) : (
            <div style={{ fontSize: 10, fontFamily: MONO, color: C.textDim }}>
              {uniquePerspectives}/3
            </div>
          )}
        </div>
      </div>
      {!isLast && (
        <div style={{ height: 1, marginLeft: 16, marginRight: 16, background: C.textDim + "11" }} />
      )}
    </div>
  );
};
