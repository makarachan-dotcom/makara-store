import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export function IntroOverlay() {
  const [visible, setVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("makara-intro-seen");
    if (!hasSeen) {
      setVisible(true);
      sessionStorage.setItem("makara-intro-seen", "true");
      const timer = setTimeout(() => {
        setAnimateOut(true);
        setTimeout(() => setVisible(false), 800);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#040507] flex flex-col items-center justify-center transition-all duration-800 ${
        animateOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className={`relative transition-all duration-1000 ${animateOut ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}>
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
          <Zap className="w-24 h-24 text-cyan-400 relative z-10" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text */}
      <div className={`text-center transition-all duration-1000 delay-300 ${animateOut ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}>
        <h1 className="text-3xl md:text-4xl font-bold text-[#E8ECF1] mb-2">
          Made with Unreal Engine 5
        </h1>
        <p className="text-lg text-cyan-400 font-semibold tracking-widest">
          BY MAKARA STORE
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-0.5 bg-[#141821] rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-cyan-400 rounded-full animate-[load_3s_ease-out_forwards]" />
      </div>

      <style>{`
        @keyframes load {
          from { width: 0%; }
          to { width: 100%; }
        }
        .duration-800 {
          transition-duration: 800ms;
        }
      `}</style>
    </div>
  );
}
