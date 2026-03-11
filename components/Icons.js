"use client";
import { C } from "./design";

export const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
);

export const NfcIcon = ({ size = 24, color = C.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M8.5 14a4.5 4.5 0 016.5-4" />
    <path d="M8.5 11a2.2 2.2 0 013.2-2" />
    <circle cx="9" cy="14" r="0.8" fill={color} />
  </svg>
);

export const MusicIcon = ({ size = 15, color = C.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" fill={color} opacity="0.2" stroke={color} />
    <circle cx="18" cy="16" r="3" fill={color} opacity="0.2" stroke={color} />
  </svg>
);

export const CheckIcon = ({ size = 14, color = C.teal }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M4 10l4 4 8-8" /></svg>
);

export const LockSmall = ({ color = C.textDim }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
);

export const UnlinkIcon = ({ size = 16, color = C.rose }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M15 7h3a5 5 0 010 10h-3M9 17H6a5 5 0 010-10h3" /><line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export const LinkIcon = ({ size = 14, color = C.teal }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M15 7h3a5 5 0 010 10h-3M9 17H6a5 5 0 010-10h3" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const StarIcon = ({ color = C.megaGold, size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);

export const TrophyIcon = ({ size = 16, color = C.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <path d="M18 9h2a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
    <path d="M6 4h12v6a6 6 0 01-12 0V4z" />
    <path d="M10 16h4" />
    <path d="M12 16v4" />
    <path d="M8 20h8" />
  </svg>
);

export const ProfileIcon = ({ size = 16, color = C.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" />
  </svg>
);

export const FilmGrain = ({ opacity = 0.035 }) => (
  <div
    style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 999,
      mixBlendMode: "overlay", opacity,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat", backgroundSize: "128px 128px",
    }}
  />
);

export const Divider = ({ style = {} }) => (
  <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C.textDim}33, transparent)`, ...style }} />
);
