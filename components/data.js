// Ã¢ÂÂÃ¢ÂÂ SONG DATA Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
export const SINGLES = [
  { id: 36, title: "Hideaway", num: "01" },
  { id: 37, title: "ITIL", num: "02" },
  { id: 38, title: "HS", num: "03" },
  { id: 39, title: "WM", num: "04" },
  { id: 41, title: "SP", num: "05" },
  { id: 7, title: "[REDACTED]", num: "06" },
  { id: 8, title: "[REDACTED]", num: "07" },
  { id: 9, title: "[REDACTED]", num: "08" },
  { id: 10, title: "[REDACTED]", num: "09" },
  { id: 11, title: "[REDACTED]", num: "10" },
];

export const BOOSTERS = [{ id: 40, title: "Savage", num: "01" }];

export const PERSPECTIVES = ["Jack G", "Jack J", "J&J"];
export const BOOSTER_PERSPECTIVES = ["Jack G", "Jack J", "J&J", "Sammy"];

// Ã¢ÂÂÃ¢ÂÂ DEMO DATA Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
export const generateOwnedCards = () => [];

export const generateUltraRares = () => {
  const urs = [];
  SINGLES.forEach((song) => {
    PERSPECTIVES.forEach((persp, pi) => {
      urs.push({
        id: "UR-" + song.num + "-" + (pi + 1),
        songId: song.id, songTitle: song.title, songNum: song.num,
        perspective: persp,
        owned: false,
        linked: false,
        imageUrl: null,
        owner: null,
        isOwnedByMe: false,
      });
    });
  });
  return urs;
};
