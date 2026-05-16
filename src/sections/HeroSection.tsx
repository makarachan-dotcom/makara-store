import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const GAME_COVERS = [
  "/covers/cyber-odyssey.jpg",
  "/covers/shadow-realms.jpg",
  "/covers/star-forge.jpg",
  "/covers/blood-arena.jpg",
  "/covers/neon-drift.jpg",
  "/covers/echoes-of-eden.jpg",
];

export function HeroSection() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero-section");
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * 2)));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero-section" className="relative min-h-[100dvh] flex items-end overflow-hidden">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Radial Glow */}
      <div className="absolute inset-0 z-[1]">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Rotating Ring of Game Covers */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]"
        style={{
          perspective: "1200px",
          transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 0.3})`,
        }}
      >
        <div
          className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${scrollProgress * 360}deg)`,
            transition: "transform 0.1s linear",
          }}
        >
          {GAME_COVERS.map((cover, i) => {
            const angle = (360 / GAME_COVERS.length) * i;
            const radius = typeof window !== "undefined" && window.innerWidth < 768 ? 140 : 240;
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-[60px] h-[90px] md:w-[100px] md:h-[150px] rounded-lg overflow-hidden border border-cyan-400/20 shadow-lg shadow-cyan-400/10"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) translate(-50%, -50%)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={cover}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 ring-1 ring-cyan-400/30 rounded-lg" />
              </div>
            );
          })}

          {/* Center Logo */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ transform: "translate(-50%, -50%) rotateY(180deg)" }}
          >
            <div className="text-cyan-400 font-bold text-2xl md:text-4xl tracking-[0.3em] opacity-80"
              style={{ textShadow: "0 0 20px rgba(0,229,255,0.5)" }}
            >
              MAKARA
            </div>
          </div>
        </div>
      </div>

      {/* Hero Text */}
      <div
        className="relative z-[3] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-32"
        style={{ opacity: 1 - scrollProgress * 3 }}
      >
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#E8ECF1] mb-4"
          style={{
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {t("hero.title")}
        </h1>
        <p className="text-base md:text-lg text-[#7A8299] mb-6 flex items-center gap-2">
          {t("hero.subtitle")}
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </p>
      </div>

      {/* Scroll-triggered cyan burst at midpoint */}
      {scrollProgress > 0.4 && scrollProgress < 0.6 && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none"
          style={{ opacity: 1 - Math.abs(scrollProgress - 0.5) * 10 }}
        >
          <div className="w-[600px] h-[600px] rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />
        </div>
      )}
    </section>
  );
}
