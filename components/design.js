// âââ DESIGN SYSTEM âââââââââââââââââââââââââ
export const C = {
  bg: "#0C0B0E", bgWarm: "#11100F", surface: "#1A1816",
  surfaceRaised: "#201E1B", surfaceInset: "#0F0E0C",
  cream: "#F2EDE4", creamDim: "#D4CEBC", creamDark: "#A89F8E",
  accent: "#C8B88A", accentDim: "rgba(200,184,138,0.10)",
  teal: "#7FB5A8", tealDim: "rgba(127,181,168,0.08)",
  rose: "#B07272", text: "#E8E2D6", textSec: "#9A9488",
  textDim: "#5A564E", purple: "#917FB5", gold: "#C8B88A",
  megaGold: "#D4A43A", booster: "#6B8E7B",
};

export const SERIF = "Georgia, 'Times New Roman', serif";
export const SANS = "'General Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";
export const MONO = "'SF Mono', 'Menlo', 'Courier New', monospace";

// âââ SKEUOMORPHIC HELPERS ââââââââââââââââââ
export const skeuo = {
  card: {
    background: `linear-gradient(145deg, #1E1C19, #161412)`,
    boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)`,
    border: `1px solid rgba(255,255,255,0.04)`,
    borderRadius: 10,
  },
  inset: {
    background: `linear-gradient(180deg, #0A0908, #0E0D0B)`,
    boxShadow: `0 1px 2px rgba(0,0,0,0.5) inset, 0 -1px 0 rgba(255,255,255,0.03) inset`,
    border: `1px solid rgba(0,0,0,0.3)`,
    borderRadius: 8,
  },
  btnGold: {
    background: `linear-gradient(180deg, #D4C48E, #B8A470, #A89460)`,
    boxShadow: `0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 3px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)`,
    border: `1px solid rgba(0,0,0,0.15)`,
    borderRadius: 6,
  },
  btnGhost: {
    background: `linear-gradient(180deg, rgba(255,255,255,0.03), transparent)`,
    boxShadow: `0 1px 0 rgba(255,255,255,0.03) inset, 0 3px 8px rgba(0,0,0,0.3)`,
    border: `1px solid ${C.accent}44`,
    borderRadius: 6,
  },
  badge: {
    background: `linear-gradient(180deg, #252320, #1A1816)`,
    boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 2px 6px rgba(0,0,0,0.3)`,
    border: `1px solid rgba(255,255,255,0.04)`,
    borderRadius: 100,
  },
  gloss: {
    position: "absolute", top: 0, left: 0, right: 0, height: "50%",
    background: "linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
    borderRadius: "10px 10px 0 0", pointerEvents: "none",
  },
};
