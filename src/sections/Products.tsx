import { useState, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { ChevronLeft, ChevronRight, ShoppingCart, Check, Package, AlertTriangle } from "lucide-react";

const MOCK_PRODUCTS = [
  { id: 1, nameEn: "ChatGPT Plus Monthly", nameKh: "ChatGPT Plus ប្រចាំខែ", price: 15, originalPrice: 20, category: "AI", image: "/products/chatgpt.jpg", stock: 50, delivery: "auto" },
  { id: 2, nameEn: "Claude Pro Monthly", nameKh: "Claude Pro ប្រចាំខែ", price: 18, originalPrice: 25, category: "AI", image: "/products/claude.jpg", stock: 30, delivery: "auto" },
  { id: 3, nameEn: "Gemini Advanced", nameKh: "Gemini Advanced", price: 12, originalPrice: 18, category: "AI", image: "/products/gemini.jpg", stock: 45, delivery: "auto" },
  { id: 4, nameEn: "Grok AI Monthly", nameKh: "Grok AI ប្រចាំខែ", price: 16, originalPrice: 22, category: "AI", image: "/products/grok.jpg", stock: 20, delivery: "auto" },
  { id: 5, nameEn: "Midjourney Pro", nameKh: "Midjourney Pro", price: 10, originalPrice: 15, category: "Design", image: "/products/midjourney.jpg", stock: 60, delivery: "manual" },
  { id: 6, nameEn: "Spotify Premium", nameKh: "Spotify Premium", price: 5, originalPrice: 8, category: "Music", image: "/products/spotify.jpg", stock: 100, delivery: "auto" },
  { id: 7, nameEn: "YouTube Premium", nameKh: "YouTube Premium", price: 6, originalPrice: 10, category: "Video", image: "/products/youtube.jpg", stock: 80, delivery: "auto" },
  { id: 8, nameEn: "Netflix Premium", nameKh: "Netflix Premium", price: 8, originalPrice: 12, category: "Video", image: "/products/netflix.jpg", stock: 40, delivery: "manual" },
  { id: 9, nameEn: "Apple iTunes Gift Card", nameKh: "កាតអំណោយ Apple iTunes", price: 10, originalPrice: 12, category: "Gift Card", image: "/products/apple.jpg", stock: 200, delivery: "auto" },
];

const CATEGORIES = ["All", "AI", "Design", "Music", "Video", "Gift Card"];

export default function Products() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === "All" ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section id="products" className="py-20 lg:py-28 bg-[#0A1628] relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-3">
              {t("Our Products", "ផលិតផលរបស់យើង")}
            </h2>
            <p className="text-white/50 text-base max-w-lg">
              {t(
                "Premium subscriptions and services at competitive prices.",
                "ការជាវពិសេស និងសេវាកម្មក្នុងតម្លៃប្រកួតប្រជែង។"
              )}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-[#0A1628] hover:bg-[#E5B75C] hover:border-[#E5B75C] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-[#0A1628] hover:bg-[#E5B75C] hover:border-[#E5B75C] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#E5B75C] text-[#0A1628]"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-[#E5B75C]/30 hover:text-[#E5B75C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[280px] lg:w-[320px] group rounded-xl bg-[#0A1628]/80 border border-white/8 hover:border-[#E5B75C]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E5B75C]/5 overflow-hidden snap-start"
            >
              <div className="relative overflow-hidden h-44">
                <img
                  src={product.image}
                  alt={product.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                {product.originalPrice > product.price && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#E5B75C] text-[#0A1628] text-xs font-bold rounded-md">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 ${
                  product.delivery === "auto" ? "bg-[#00D4C8]/20 text-[#00D4C8]" : "bg-[#5ED4F4]/20 text-[#5ED4F4]"
                }`}>
                  {product.delivery === "auto" ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {product.delivery === "auto" ? t("Auto", "ស្វ័យប្រវត្តិ") : t("Manual", "ដៃ")}
                </span>
              </div>

              <div className="p-4">
                <span className="inline-block px-2 py-0.5 bg-[#1B2838] text-[#00D4C8] text-xs font-medium rounded-md mb-2">
                  {product.category}
                </span>
                <h3 className="text-white font-semibold text-base mb-1 line-clamp-1">
                  {t(product.nameEn, product.nameKh)}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#E5B75C] font-bold text-lg">${product.price.toFixed(2)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-white/30 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                  <Package className="w-3.5 h-3.5" />
                  {product.stock > 20 ? t("In Stock", "មានស្តុក") : t("Low Stock", "ស្តុកតិច")}
                </div>
                <button
                  onClick={() =>
                    addItem({
                      id: product.id,
                      productId: product.id,
                      name: product.nameEn,
                      nameKh: product.nameKh,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#E5B75C] text-[#0A1628] rounded-lg font-semibold text-sm hover:bg-[#F0C975] transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t("Add to Cart", "បន្ថែមទៅកន្ត្រក")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
