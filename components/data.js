// ─── SONG DATA ─────────────────────────────
export const SINGLES = [
  { id: 1, title: "If This Isn't Love", num: "01" },
  { id: 2, title: "Hideaway", num: "02" },
  { id: 3, title: "All on You", num: "03" },
  { id: 4, title: "Serotonin Pools", num: "04" },
  { id: 5, title: "Tell Me You Love Me", num: "05" },
  { id: 6, title: "Hindsight", num: "06" },
  { id: 7, title: "One Good Reason", num: "07" },
  { id: 8, title: "Goodbye LA", num: "08" },
  { id: 9, title: "Wrong Mind", num: "09" },
  { id: 10, title: "Bulletproof", num: "10" },
];

export const BOOSTERS = Array.from({ length: 22 }, (_, i) => ({
  id: 100 + i + 1,
  title: `Addl ${i + 1}`,
  num: String(i + 1).padStart(2, "0"),
}));

export const PERSPECTIVES = ["Jack G", "Jack J", "J&J"];

// ─── DEMO DATA ─────────────────────────────
export const generateOwnedCards = () => [
  { chipId: "NFC-S001", songId: 1, perspective: "Jack G", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S002", songId: 1, perspective: "Jack G", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S003", songId: 1, perspective: "Jack G", rarity: "rare", linked: true, type: "single" },
  { chipId: "NFC-S004", songId: 1, perspective: "Jack J", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S005", songId: 1, perspective: "J&J", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S006", songId: 2, perspective: "Jack G", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S007", songId: 2, perspective: "Jack J", rarity: "rare", linked: true, type: "single" },
  { chipId: "NFC-S008", songId: 3, perspective: "J&J", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S009", songId: 3, perspective: "Jack G", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S010", songId: 3, perspective: "Jack J", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S011", songId: 5, perspective: "Jack G", rarity: "rare", linked: true, type: "single" },
  { chipId: "NFC-S012", songId: 7, perspective: "J&J", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S013", songId: 9, perspective: "Jack G", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-S014", songId: 9, perspective: "Jack G", rarity: "rare", linked: true, type: "single" },
  { chipId: "NFC-S015", songId: 10, perspective: "Jack J", rarity: "common", linked: true, type: "single" },
  { chipId: "NFC-B001", songId: 101, perspective: "Jack G", rarity: "common", linked: true, type: "booster" },
  { chipId: "NFC-B002", songId: 101, perspective: "Jack J", rarity: "common", linked: true, type: "booster" },
  { chipId: "NFC-B003", songId: 103, perspective: "J&J", rarity: "rare", linked: true, type: "booster" },
  { chipId: "NFC-B004", songId: 105, perspective: "Jack G", rarity: "common", linked: true, type: "booster" },
];

export const generateUltraRares = () => {
  const urs = [];
  SINGLES.forEach((song) => {
    PERSPECTIVES.forEach((persp, pi) => {
      urs.push({
        id: `UR-${song.num}-${pi + 1}`,
        songId: song.id, songTitle: song.title, songNum: song.num,
        perspective: persp,
        owned: (song.id === 1 && pi === 0) || (song.id === 3 && pi === 2),
        linked: (song.id === 1 && pi === 0) || (song.id === 3 && pi === 2),
      });
    });
  });
  return urs;
};
