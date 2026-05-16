import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Sun, Moon, Globe, LogIn, LogOut, Shield, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout, getOAuthUrl } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { totalItems, setIsOpen } = useCart();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A1628]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E5B75C] to-[#00D4C8] flex items-center justify-center">
              <span className="text-[#0A1628] font-bold text-sm">M</span>
            </div>
            <span className="text-[#E5B75C] font-bold text-lg tracking-wider">MAKARA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { id: "products", en: "Products", kh: "ផលិតផល" },
              { id: "howtoorder", en: "How to Order", kh: "វិធីកម្មង់" },
              { id: "support", en: "Support", kh: "ជំនួយ" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative text-white/80 hover:text-[#E5B75C] text-[15px] font-medium transition-colors group"
              >
                {t(item.en, item.kh)}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E5B75C] transition-all group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "kh" : "en")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/70 hover:text-[#E5B75C] hover:border-[#E5B75C]/30 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "en" ? "EN" : "KH"}
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-white/60 hover:text-[#E5B75C] hover:bg-white/5 transition-all"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-full text-white/60 hover:text-[#E5B75C] hover:bg-white/5 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E5B75C] text-[#0A1628] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="p-2 rounded-full text-[#00D4C8] hover:bg-[#00D4C8]/10 transition-all"
                    title="Admin"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full border border-[#E5B75C]/30" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#E5B75C]/20 flex items-center justify-center text-[#E5B75C] text-xs font-bold">
                      {user?.name?.[0] || "U"}
                    </div>
                  )}
                  <span className="text-white/80 text-sm max-w-[100px] truncate">{user?.name || "User"}</span>
                  <button onClick={() => logout()} className="p-1.5 rounded-full text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <a
                href={getOAuthUrl()}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5B75C]/40 text-[#E5B75C] text-sm font-medium hover:bg-[#E5B75C]/10 hover:border-[#E5B75C] transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t("Sign In", "ចូល")}
              </a>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-white/60 hover:text-white transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0A1628]/95 backdrop-blur-xl border-t border-white/5 py-4 px-6 space-y-3">
          {[
            { id: "products", en: "Products", kh: "ផលិតផល" },
            { id: "howtoorder", en: "How to Order", kh: "វិធីកម្មង់" },
            { id: "support", en: "Support", kh: "ជំនួយ" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left text-white/80 hover:text-[#E5B75C] py-2 transition-colors"
            >
              {t(item.en, item.kh)}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "kh" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/70"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "en" ? "EN" : "KH"}
            </button>
            {!isLoggedIn && (
              <a href={getOAuthUrl()} className="flex-1 text-center py-2 rounded-lg bg-[#E5B75C] text-[#0A1628] font-medium text-sm">
                {t("Sign In", "ចូល")}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
