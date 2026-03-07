"use client";
import { useState, useEffect, useRef } from "react";
import { C, SERIF, SANS, MONO } from "./design";
import { Divider } from "./Icons";

// âââ ANIMATED PRISMATIC BACKGROUND (canvas fallback) âââââ
const PrismaticCanvas = ({ width = 390, height = 844 }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    let time = 0;
    let raf;
    const draw = () => {
      time += 0.004;
      const angle = -0.4 + Math.sin(time * 0.4) * 0.15;
      const W = width, H = height;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      const atmo = ctx.createRadialGradient(W*0.4, H*0.35, 0, W*0.4, H*0.35, H*0.6);
      atmo.addColorStop(0, "rgba(50,40,20,0.40)");
      atmo.addColorStop(0.6, "rgba(30,25,10,0.18)");
      atmo.addColorStop(1, "transparent");
      ctx.fillStyle = atmo;
      ctx.fillRect(0, 0, W, H);
      const oX = W * 0.12, oY = H * 0.92;
      ctx.save();
      ctx.translate(oX, oY);
      ctx.rotate(angle);
      const beams = [
        { o: -0.04, c1: "rgba(200,184,138,0.40)", c2: "rgba(180,160,100,0.14)", w: 50 },
        { o: -0.07, c1: "rgba(212,164,58,0.28)", c2: "rgba(200,150,60,0.10)", w: 80 },
        { o: -0.01, c1: "rgba(220,180,80,0.45)", c2: "rgba(200,160,40,0.12)", w: 70 },
        { o: 0.02, c1: "rgba(180,150,60,0.38)", c2: "rgba(160,130,40,0.10)", w: 65 },
        { o: 0.05, c1: "rgba(200,170,80,0.30)", c2: "rgba(160,130,50,0.08)", w: 55 },
        { o: 0.08, c1: "rgba(160,140,60,0.22)", c2: "rgba(120,100,40,0.06)", w: 45 },
        { o: -0.10, c1: "rgba(220,200,140,0.15)", c2: "rgba(200,180,120,0.05)", w: 140 },
        { o: 0.14, c1: "rgba(180,160,80,0.18)", c2: "rgba(150,130,60,0.05)", w: 70 },
        { o: 0.18, c1: "rgba(200,175,100,0.14)", c2: "rgba(170,140,70,0.04)", w: 60 },
        { o: 0.11, c1: "rgba(160,145,80,0.12)", c2: "rgba(130,110,50,0.03)", w: 50 },
      ];
      const bL = H * 1.8;
      beams.forEach(b => {
        ctx.save();
        ctx.rotate(b.o);
        const g = ctx.createLinearGradient(0, 0, 0, -bL);
        g.addColorStop(0, b.c1);
        g.addColorStop(0.25, b.c2);
        g.addColorStop(0.6, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        const sN = b.w * 0.08, sF = b.w * 3;
        ctx.moveTo(-sN, 0);
        ctx.lineTo(-sF, -bL);
        ctx.lineTo(sF, -bL);
        ctx.lineTo(sN, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();
      const hs = ctx.createRadialGradient(oX, oY, 0, oX, oY, 250);
      hs.addColorStop(0, "rgba(212,164,58,0.40)");
      hs.addColorStop(0.15, "rgba(200,184,138,0.20)");
      hs.addColorStop(0.4, "rgba(180,150,80,0.08)");
      hs.addColorStop(1, "transparent");
      ctx.fillStyle = hs;
      ctx.fillRect(0, 0, W, H);
      const mg = ctx.createRadialGradient(W*0.25, H*0.55, 0, W*0.25, H*0.55, 200);
      mg.addColorStop(0, "rgba(200,184,138,0.10)");
      mg.addColorStop(0.5, "rgba(180,150,80,0.04)");
      mg.addColorStop(1, "transparent");
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.globalAlpha = 0.018 + Math.sin(time * 3) * 0.006;
      for (let y = 0; y < H; y += 2) {
        ctx.fillStyle = y % 4 === 0 ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
        ctx.fillRect(0, y, W, 1);
      }
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.translate(oX, oY);
      ctx.rotate(angle + 0.12);
      const fr = ctx.createLinearGradient(0, 0, 0, -bL * 0.7);
      fr.addColorStop(0, "rgba(212,164,58,0.08)");
      fr.addColorStop(0.3, "rgba(200,184,138,0.04)");
      fr.addColorStop(1, "transparent");
      ctx.fillStyle = fr;
      ctx.beginPath();
      ctx.moveTo(-5, 0); ctx.lineTo(-200, -bL*0.7); ctx.lineTo(-100, -bL*0.7); ctx.lineTo(5, 0);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      const v = ctx.createRadialGradient(W*0.5, H*0.5, W*0.25, W*0.5, H*0.5, W);
      v.addColorStop(0, "transparent");
      v.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0}} />;
};

// âââ SPLASH SCREEN âââââââââââââââââââââââââ
export default function SplashScreen({ onEnter }) {
  const [step, setStep] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setTimeout(() => setStep(1), 300);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 1700);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, width: "100vw", height: "100dvh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#000", overflow: "hidden", zIndex: 50,
    }}>
      {/* Animated prismatic background (always renders as base layer) */}
      <PrismaticCanvas />

      {/* Looping background video */}
      {!videoFailed && (
        <video
          autoPlay muted loop playsInline
          onError={() => setVideoFailed(true)}
          style={{
            position: "absolute", top: "50%", left: "50%",
            width: "100vw", height: "100dvh",
            minWidth: "100%", minHeight: "100%",
            transform: "translate(-50%, -50%)",
            objectFit: "cover", zIndex: 1,
          }}
        >
          <source src="/retro-beams-muted.mp4" type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 2,
      }} />

      {/* Flicker layer */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        animation: "flicker 0.12s infinite alternate",
      }} />

      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        mixBlendMode: "overlay", opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px 128px",
      }} />

      {/* Main content */}
      <div style={{
        textAlign: "center", zIndex: 10, position: "relative",
        opacity: step >= 1 ? 1 : 0,
        transform: step >= 1 ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.2, 0, 0, 1)",
      }}>
        <div style={{
          fontSize: 11, letterSpacing: 8, color: "rgba(255,255,255,0.3)",
          fontFamily: SANS, fontWeight: 500, marginBottom: 20,
          opacity: step >= 2 ? 1 : 0, transition: "opacity 0.8s ease 0.3s",
        }}>JACK &nbsp; & &nbsp; JACK</div>

        <div style={{
          fontSize: 50, fontWeight: 300, color: "rgba(255,255,255,0.92)",
          fontFamily: SERIF, letterSpacing: 2, lineHeight: 1,
          textShadow: "0 2px 30px rgba(0,0,0,0.5)",
        }}>Symbiosis</div>

        <div style={{
          fontSize: 11, letterSpacing: 10, color: C.accent,
          fontFamily: SANS, fontWeight: 500, marginTop: 12,
          textShadow: `0 0 20px rgba(200,184,138,0.3)`,
        }}>VAULT</div>

        <Divider style={{ width: 120, margin: "32px auto 24px" }} />

        <div style={{
          fontSize: 13, color: "rgba(255,255,255,0.38)", fontFamily: SANS,
          fontWeight: 300, lineHeight: 1.7, textAlign: "center",
          opacity: step >= 2 ? 1 : 0, transition: "opacity 0.8s ease 0.5s",
        }}>
          10 singles. 22 boosters. 3 perspectives.<br />Scan. Collect. Trade. Unlock.
        </div>
      </div>

      {/* Liquid Glass ENTER button */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0,
        display: "flex", justifyContent: "center", zIndex: 10,
        opacity: step >= 3 ? 1 : 0, transition: "opacity 0.8s ease",
      }}>
        <button onClick={onEnter} style={{
          position: "relative", overflow: "hidden",
          background: `linear-gradient(145deg,
            rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 30%,
            rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 70%,
            rgba(255,255,255,0.10) 100%)`,
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderTopColor: "rgba(255,255,255,0.28)",
          borderRadius: 14,
          color: "rgba(255,255,255,0.85)",
          padding: "16px 64px",
          fontSize: 11, fontFamily: SANS, fontWeight: 500,
          letterSpacing: 5, cursor: "pointer",
          boxShadow: `0 1px 0 rgba(255,255,255,0.12) inset,
            0 -1px 0 rgba(0,0,0,0.15) inset,
            0 8px 32px rgba(0,0,0,0.25),
            0 2px 8px rgba(0,0,0,0.15)`,
          transition: "all 0.3s ease",
        }}>ENTER</button>
      </div>

      {/* Bottom label */}
      <div style={{
        position: "absolute", bottom: 24, left: 0, right: 0,
        textAlign: "center", zIndex: 10,
        fontSize: 8, fontFamily: SANS, fontWeight: 400,
        color: "rgba(255,255,255,0.10)", letterSpacing: 3,
        opacity: step >= 1 ? 1 : 0, transition: "opacity 1.5s ease",
      }}>NFC COLLECTIBLE SERIES Â· EST. 2026</div>
    </div>
  );
}
"use client";
import { useState, useEffect, useRef } from "react";
import { C, SERIF, SANS, MONO } from "./design";
import { Divider } from "./Icons";

// âââ ANIMATED PRISMATIC BACKGROUND (canvas fallback) âââââ
const PrismaticCanvas = ({ width = 390, height = 844 }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    let time = 0;
    let raf;
    const draw = () => {
      time += 0.004;
      const angle = -0.4 + Math.sin(time * 0.4) * 0.15;
      const W = width, H = height;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      const atmo = ctx.createRadialGradient(W*0.4, H*0.35, 0, W*0.4, H*0.35, H*0.6);
      atmo.addColorStop(0, "rgba(50,40,20,0.40)");
      atmo.addColorStop(0.6, "rgba(30,25,10,0.18)");
      atmo.addColorStop(1, "transparent");
      ctx.fillStyle = atmo;
      ctx.fillRect(0, 0, W, H);
      const oX = W * 0.12, oY = H * 0.92;
      ctx.save();
      ctx.translate(oX, oY);
      ctx.rotate(angle);
      const beams = [
        { o: -0.04, c1: "rgba(200,184,138,0.40)", c2: "rgba(180,160,100,0.14)", w: 50 },
        { o: -0.07, c1: "rgba(212,164,58,0.28)", c2: "rgba(200,150,60,0.10)", w: 80 },
        { o: -0.01, c1: "rgba(220,180,80,0.45)", c2: "rgba(200,160,40,0.12)", w: 70 },
        { o: 0.02, c1: "rgba(180,150,60,0.38)", c2: "rgba(160,130,40,0.10)", w: 65 },
        { o: 0.05, c1: "rgba(200,170,80,0.30)", c2: "rgba(160,130,50,0.08)", w: 55 },
        { o: 0.08, c1: "rgba(160,140,60,0.22)", c2: "rgba(120,100,40,0.06)", w: 45 },
        { o: -0.10, c1: "rgba(220,200,140,0.15)", c2: "rgba(200,180,120,0.05)", w: 140 },
        { o: 0.14, c1: "rgba(180,160,80,0.18)", c2: "rgba(150,130,60,0.05)", w: 70 },
        { o: 0.18, c1: "rgba(200,175,100,0.14)", c2: "rgba(170,140,70,0.04)", w: 60 },
        { o: 0.11, c1: "rgba(160,145,80,0.12)", c2: "rgba(130,110,50,0.03)", w: 50 },
      ];
      const bL = H * 1.8;
      beams.forEach(b => {
        ctx.save();
        ctx.rotate(b.o);
        const g = ctx.createLinearGradient(0, 0, 0, -bL);
        g.addColorStop(0, b.c1);
        g.addColorStop(0.25, b.c2);
        g.addColorStop(0.6, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        const sN = b.w * 0.08, sF = b.w * 3;
        ctx.moveTo(-sN, 0);
        ctx.lineTo(-sF, -bL);
        ctx.lineTo(sF, -bL);
        ctx.lineTo(sN, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();
      const hs = ctx.createRadialGradient(oX, oY, 0, oX, oY, 250);
      hs.addColorStop(0, "rgba(212,164,58,0.40)");
      hs.addColorStop(0.15, "rgba(200,184,138,0.20)");
      hs.addColorStop(0.4, "rgba(180,150,80,0.08)");
      hs.addColorStop(1, "transparent");
      ctx.fillStyle = hs;
      ctx.fillRect(0, 0, W, H);
      const mg = ctx.createRadialGradient(W*0.25, H*0.55, 0, W*0.25, H*0.55, 200);
      mg.addColorStop(0, "rgba(200,184,138,0.10)");
      mg.addColorStop(0.5, "rgba(180,150,80,0.04)");
      mg.addColorStop(1, "transparent");
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.globalAlpha = 0.018 + Math.sin(time * 3) * 0.006;
      for (let y = 0; y < H; y += 2) {
        ctx.fillStyle = y % 4 === 0 ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
        ctx.fillRect(0, y, W, 1);
      }
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.translate(oX, oY);
      ctx.rotate(angle + 0.12);
      const fr = ctx.createLinearGradient(0, 0, 0, -bL * 0.7);
      fr.addColorStop(0, "rgba(212,164,58,0.08)");
      fr.addColorStop(0.3, "rgba(200,184,138,0.04)");
      fr.addColorStop(1, "transparent");
      ctx.fillStyle = fr;
      ctx.beginPath();
      ctx.moveTo(-5, 0); ctx.lineTo(-200, -bL*0.7); ctx.lineTo(-100, -bL*0.7); ctx.lineTo(5, 0);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      const v = ctx.createRadialGradient(W*0.5, H*0.5, W*0.25, W*0.5, H*0.5, W);
      v.addColorStop(0, "transparent");
      v.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0}} />;
};

// âââ SPLASH SCREEN âââââââââââââââââââââââââ
export default function SplashScreen({ onEnter }) {
  const [step, setStep] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setTimeout(() => setStep(1), 300);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 1700);
  }, []);

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#000", position: "relative", overflow: "hidden",
    }}>
      {/* Animated prismatic background (always renders as base layer) */}
      <PrismaticCanvas />

      {/* Looping background video */}
      {!videoFailed && (
        <video
          autoPlay muted loop playsInline
          onError={() => setVideoFailed(true)}
          style={{
            position: "absolute", top: "50%", left: "50%",
            width: "100vw", height: "100dvh",
            minWidth: "100%", minHeight: "100%",
            transform: "translate(-50%, -50%)",
            objectFit: "cover", zIndex: 1,
          }}
        >
          <source src="/retro-beams-muted.mp4" type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 2,
      }} />

      {/* Flicker layer */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        animation: "flicker 0.12s infinite alternate",
      }} />

      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        mixBlendMode: "overlay", opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px 128px",
      }} />

      {/* Main content */}
      <div style={{
        textAlign: "center", zIndex: 10, position: "relative",
        opacity: step >= 1 ? 1 : 0,
        transform: step >= 1 ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.2, 0, 0, 1)",
      }}>
        <div style={{
          fontSize: 11, letterSpacing: 8, color: "rgba(255,255,255,0.3)",
          fontFamily: SANS, fontWeight: 500, marginBottom: 20,
          opacity: step >= 2 ? 1 : 0, transition: "opacity 0.8s ease 0.3s",
        }}>JACK &nbsp; & &nbsp; JACK</div>

        <div style={{
          fontSize: 50, fontWeight: 300, color: "rgba(255,255,255,0.92)",
          fontFamily: SERIF, letterSpacing: 2, lineHeight: 1,
          textShadow: "0 2px 30px rgba(0,0,0,0.5)",
        }}>Symbiosis</div>

        <div style={{
          fontSize: 11, letterSpacing: 10, color: C.accent,
          fontFamily: SANS, fontWeight: 500, marginTop: 12,
          textShadow: `0 0 20px rgba(200,184,138,0.3)`,
        }}>VAULT</div>

        <Divider style={{ width: 120, margin: "32px auto 24px" }} />

        <div style={{
          fontSize: 13, color: "rgba(255,255,255,0.38)", fontFamily: SANS,
          fontWeight: 300, lineHeight: 1.7, textAlign: "center",
          opacity: step >= 2 ? 1 : 0, transition: "opacity 0.8s ease 0.5s",
        }}>
          10 singles. 22 boosters. 3 perspectives.<br />Scan. Collect. Trade. Unlock.
        </div>
      </div>

      {/* Liquid Glass ENTER button */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0,
        display: "flex", justifyContent: "center", zIndex: 10,
        opacity: step >= 3 ? 1 : 0, transition: "opacity 0.8s ease",
      }}>
        <button onClick={onEnter} style={{
          position: "relative", overflow: "hidden",
          background: `linear-gradient(145deg,
            rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 30%,
            rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 70%,
            rgba(255,255,255,0.10) 100%)`,
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderTopColor: "rgba(255,255,255,0.28)",
          borderRadius: 14,
          color: "rgba(255,255,255,0.85)",
          padding: "16px 64px",
          fontSize: 11, fontFamily: SANS, fontWeight: 500,
          letterSpacing: 5, cursor: "pointer",
          boxShadow: `0 1px 0 rgba(255,255,255,0.12) inset,
            0 -1px 0 rgba(0,0,0,0.15) inset,
            0 8px 32px rgba(0,0,0,0.25),
            0 2px 8px rgba(0,0,0,0.15)`,
          transition: "all 0.3s ease",
        }}>ENTER</button>
      </div>

      {/* Bottom label */}
      <div style={{
        position: "absolute", bottom: 24, left: 0, right: 0,
        textAlign: "center", zIndex: 10,
        fontSize: 8, fontFamily: SANS, fontWeight: 400,
        color: "rgba(255,255,255,0.10)", letterSpacing: 3,
        opacity: step >= 1 ? 1 : 0, transition: "opacity 1.5s ease",
      }}>NFC COLLECTIBLE SERIES Â· EST. 2026</div>
    </div>
  );
}
