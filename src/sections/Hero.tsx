import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let raf: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 183, 92, ${p.alpha})`;
        ctx.fill();

        if (p.size > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 212, 200, ${p.alpha * 0.15})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#06080D" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/hero-dragon.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080D]/60 via-transparent to-[#06080D]" />
      <canvas ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5B75C]/30 bg-[#E5B75C]/5 mb-8 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B75C] animate-pulse" />
          <span className="text-[#E5B75C] text-sm font-medium tracking-widest uppercase">
            {t("Premium Digital Goods", "ទំនិញឌីជីថលប្រណីត")}
          </span>
        </div>

        <h1
          className={`transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-2 tracking-tight">
            Makara{" "}
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            style={{ color: "#E5B75C" }}>
            {t("Store", "ហាង")}
          </span>
        </h1>

        <p
          className={`mt-6 text-lg sm:text-xl text-white/50 max-w-xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {t(
            "Your trusted marketplace for premium subscriptions and digital services.",
            "ទីផ្សារដែលអ្នកទុកចិត្តសម្រាប់ការជាវពិសេស និងសេវាកម្មឌីជីថល។"
          )}
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <button
            onClick={scrollToProducts}
            className="group flex items-center gap-2 px-8 py-4 bg-[#E5B75C] text-[#0A1628] rounded-lg font-semibold text-base hover:bg-[#F0C975] hover:scale-[1.03] hover:shadow-lg hover:shadow-[#E5B75C]/20 transition-all duration-300"
          >
            {t("Browse Products", "រកមើលផលិតផល")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("howtoorder");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-lg font-medium text-base hover:border-[#E5B75C]/40 hover:text-[#E5B75C] transition-all duration-300"
          >
            {t("How to Order", "វិធីកម្មង់")}
          </button>
        </div>
      </div>

      <button
        onClick={scrollToProducts}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-[#E5B75C] transition-colors animate-bounce"
      >
        <span className="text-xs tracking-widest uppercase">{t("Scroll", "រំកិល")}</span>
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
}
