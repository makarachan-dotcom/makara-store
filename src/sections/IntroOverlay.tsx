import { useState, useEffect } from "react";

export default function IntroOverlay() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("makara_visited");
    if (!visited) {
      setShow(true);
      localStorage.setItem("makara_visited", "true");
      const timer = setTimeout(() => setFadeOut(true), 2500);
      const hideTimer = setTimeout(() => setShow(false), 3500);
      return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#06080D] flex flex-col items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-[#E5B75C]/30 flex items-center justify-center animate-spin" style={{ animationDuration: "8s" }}>
          <div className="w-20 h-20 rounded-full border border-[#00D4C8]/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E5B75C]/20 to-[#00D4C8]/20 flex items-center justify-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-[#E5B75C] to-[#00D4C8] bg-clip-text text-transparent">
                M
              </span>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-white/40 text-sm tracking-[0.3em] uppercase mb-2">Made with Unreal Engine 5</h2>
      <h1 className="text-[#E5B75C] text-2xl font-bold tracking-wider">By Makara Store</h1>
      <div className="mt-8 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#E5B75C]/40 to-transparent">
        <div className="h-full bg-[#E5B75C] animate-pulse" style={{ width: "100%" }} />
      </div>
    </div>
  );
}
