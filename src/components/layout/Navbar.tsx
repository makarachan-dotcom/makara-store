import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/providers/theme";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart, Search, User, Menu, X, Sun, Moon, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const cartItems = useCartStore((s) => s.items);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "km" ? "en" : "km");
  };

  const navLinks = [
    { to: "/products", label: t("nav.store") },
    { to: "/products", label: t("nav.categories") },
    { to: "/products", label: t("nav.deals") },
    { to: "/instructions", label: t("nav.support") },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#040507]/90 backdrop-blur-xl border-b border-[#141821]/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 relative">
              <Zap className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-cyan-400">M</span>AKARA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to + link.label}
                to={link.to}
                className="text-sm font-medium text-[#7A8299] hover:text-[#E8ECF1] transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#7A8299] hover:text-[#E8ECF1] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-[#7A8299] hover:text-[#E8ECF1] transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language */}
            <button
              onClick={toggleLang}
              className="p-2 text-[#7A8299] hover:text-[#E8ECF1] transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="p-2 text-[#7A8299] hover:text-[#E8ECF1] transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 text-[#040507] text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-cyan-400/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#141821] flex items-center justify-center ring-2 ring-cyan-400/30">
                      <User className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button
                  size="sm"
                  className="bg-cyan-400 hover:bg-cyan-500 text-[#040507] font-semibold"
                >
                  {t("nav.login")}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 text-[#7A8299] hover:text-[#E8ECF1]">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-[#0A0C10] border-l border-[#141821]">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to + link.label}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-[#E8ECF1] hover:text-cyan-400 transition-colors py-2 border-b border-[#141821]"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg text-[#E8ECF1] hover:text-cyan-400 py-2 border-b border-[#141821]">
                        {t("nav.dashboard")}
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg text-[#E8ECF1] hover:text-cyan-400 py-2 border-b border-[#141821]">
                          {t("nav.admin")}
                        </Link>
                      )}
                      <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-lg text-[#FF00A0] py-2 text-left">
                        {t("nav.logout")}
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg text-cyan-400 py-2">
                      {t("nav.login")}
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("common.search") + "..."}
                className="w-full bg-[#141821] border border-[#1A1F2E] rounded-lg py-2 px-4 text-[#E8ECF1] placeholder-[#7A8299] focus:outline-none focus:border-cyan-400/50"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8299] hover:text-[#E8ECF1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
}


