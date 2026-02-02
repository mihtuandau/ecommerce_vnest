import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export const useFireworks = () => {
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const triggerIntenseFireworks = useCallback(() => {
    clearTimers();

    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const scale = Math.min(1.35, Math.max(0.85, w / 1200));

    // ✅ To lên xíu (nếu muốn to thêm nữa: 0.66)
    const globalScalar = 0.62;

    const colors = ["#FFD700", "#FF8C00", "#FF5E78", "#8A2BE2", "#00C2FF", "#00FFA8"];

    const t = (ms, fn) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    const shoot = (opts) => {
      const baseScalar = opts.scalar ?? 1;

      confetti({
        disableForReducedMotion: true,
        zIndex: 9999,
        colors,
        ...opts,
        ticks: Math.round((opts.ticks ?? 220) * scale),
        gravity: (opts.gravity ?? 0.8) / scale,
        scalar: baseScalar * globalScalar,
      });
    };

    // 1) Side cannons (ít hạt hơn)
    const sideCannons = (ms, boost = 1) => {
      t(ms, () => {
        // Left main
        shoot({
          particleCount: Math.round(38 * scale * boost), // ↓ từ 55
          angle: 75,
          spread: 50,
          startVelocity: 70 * boost,
          origin: { x: 0.06, y: 0.92 },
          shapes: ["square", "circle"],
          scalar: 1.15,
        });

        // Left trail (ít hơn)
        shoot({
          particleCount: Math.round(14 * scale * boost), // ↓ từ 28
          angle: 78,
          spread: 18,
          startVelocity: 50 * boost,
          origin: { x: 0.08, y: 0.92 },
          ticks: 150,
          gravity: 0.95,
          scalar: 0.6,
          shapes: ["circle"],
        });

        // Right main
        shoot({
          particleCount: Math.round(38 * scale * boost),
          angle: 105,
          spread: 50,
          startVelocity: 70 * boost,
          origin: { x: 0.94, y: 0.92 },
          shapes: ["square", "circle"],
          scalar: 1.15,
        });

        // Right trail (ít hơn)
        shoot({
          particleCount: Math.round(14 * scale * boost),
          angle: 102,
          spread: 18,
          startVelocity: 50 * boost,
          origin: { x: 0.92, y: 0.92 },
          ticks: 150,
          gravity: 0.95,
          scalar: 0.6,
          shapes: ["circle"],
        });
      });
    };

    // 2) Burst giữa trời (ít hơn nhưng vẫn đã)
    const midBurst = (ms, x, y, power = 1) => {
      t(ms, () => {
        // core
        shoot({
          particleCount: Math.round(85 * scale * power), // ↓ từ 115
          angle: 90,
          spread: 240,
          startVelocity: 48 * power,
          gravity: 0.55,
          origin: { x, y },
          scalar: 1.25,
          shapes: ["circle"],
        });

        // glitter (ít hơn)
        shoot({
          particleCount: Math.round(55 * scale * power), // ↓ từ 120
          angle: 90,
          spread: 320,
          startVelocity: 34 * power,
          gravity: 0.68,
          origin: { x, y },
          scalar: 0.45,
          ticks: 220,
          shapes: ["square"],
        });
      });
    };

    // 3) Ring (giữ vừa)
    const ring = (ms, x, y, power = 1) => {
      t(ms, () => {
        shoot({
          particleCount: Math.round(95 * scale * power), // ↓ từ 140
          angle: 90,
          spread: 360,
          startVelocity: 30 * power,
          gravity: 0.35,
          ticks: 270,
          origin: { x, y },
          scalar: 1.2,
          shapes: ["circle"],
        });
      });
    };

    // 4) Drizzle (giảm lượng rõ)
    const drizzle = (ms, durationMs = 850) => {
      const steps = 6; // ↓ từ 10
      for (let i = 0; i < steps; i++) {
        t(ms + (i * durationMs) / steps, () => {
          shoot({
            particleCount: Math.round(10 * scale), // ↓ từ 20
            angle: 90,
            spread: 110,
            startVelocity: 18,
            gravity: 0.35,
            ticks: 240,
            origin: { x: 0.5, y: 0.08 },
            scalar: 0.42,
            shapes: ["circle", "square"],
          });
        });
      }
    };

    // ======= TIMELINE (giữ nhịp, không spam) =======

    sideCannons(0, 1.0);
    sideCannons(260, 1.05);

    midBurst(650, 0.35, 0.32, 1.0);
    midBurst(800, 0.65, 0.32, 1.0);

    ring(980, 0.5, 0.26, 1.05);

    sideCannons(1180, 1.2);

    midBurst(1450, 0.5, 0.22, 1.25);

    drizzle(1680, 900);

    // Optional cleanup
    // t(3200, () => confetti.reset());
  }, [clearTimers]);

  return { triggerIntenseFireworks };
};
