// ─── SONG DATA ─────────────────────────────
export const SINGLES = [
  { id: 1, title: "Test Single 01", num: "01" },
  { id: 2, title: "[REDACTED]", num: "02" },
  { id: 3, title: "[REDACTED]", num: "03" },
  { id: 4, title: "[REDACTED]", num: "04" },
  { id: 5, title: "[REDACTED]", num: "05" },
  { id: 6, title: "[REDACTED]", num: "06" },
  { id: 7, title: "[REDACTED]", num: "07" },
  { id: 8, title: "[REDACTED]", num: "08" },
  { id: 9, title: "[REDACTED]", num: "09" },
  { id: 10, title: "[REDACTED]", num: "10" },
];

export const BOOSTERS = Array.from({ length: 22 }, (_, i) => ({
  id: 100 + i + 1,
  title: "[REDACTED]",
  num: String(i + 1).padStart(2, "0"),
}));

export const PERSPECTIVES = ["Jack G", "Jack J", "J&J"];

// ─── DEMO DATA ─────────────────────────────
export const generateOwnedCards = () => [];

export const generateUltraRares = () => {
  const urs = [];
  SINGLES.forEach((song) => {
    PERSPECTIVES.forEach((persp, pi) => {
      urs.push({
        id: `UR-${song.num}-${pi + 1}`,
        songId: song.id, songTitle: song.title, songNum: song.num,
        perspective: persp,
        owned: false,
        linked: false,
      });
    });
  });
  return urs;
};
