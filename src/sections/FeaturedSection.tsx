import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export function FeaturedSection() {
  const { t } = useTranslation();
  const { data: products } = trpc.product.featured.useQuery();

  return (
    <section className="relative py-24 md:py-32 bg-[#040507]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-cyan-400 uppercase tracking-[0.1em] mb-3">
            {t("featured.eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#E8ECF1] mb-3">
            {t("featured.title")}
          </h2>
          <p className="text-[#7A8299]">{t("featured.subtitle")}</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <GameCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GameCard({ product }: { product: { id: number; slug: string; titleKh: string; titleEn: string; imageUrl: string | null; originalPrice: number; salePrice: number; isOnSale: boolean | null; platform: string | null; rating: number | null; reviewCount: number | null } }) {
  const { i18n } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      quantity: 1,
      slug: product.slug,
      titleEn: product.titleEn,
      titleKh: product.titleKh,
      imageUrl: product.imageUrl,
      salePrice: product.salePrice,
      originalPrice: product.originalPrice,
    });
  };

  return (
    <Link to={`/products/${product.slug}`} className="group game-card relative rounded-2xl overflow-hidden bg-[#0A0C10] cursor-pointer aspect-[3/4]" style={{ transformStyle: "preserve-3d" }}>
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-600"
        style={{ backgroundImage: `url(${product.imageUrl})`, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-transparent opacity-80" />

      {/* Shimmer Layer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
        <div
          className="absolute -inset-1/2 animate-[spin_4s_linear_infinite]"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, #00E5FF 15%, #FF00A0 30%, transparent 45%, transparent 55%, #00E5FF 70%, #FF00A0 85%, transparent 100%)",
            filter: "blur(20px)",
          }}
        />
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2 py-1 bg-cyan-400 text-[#040507] text-[10px] font-bold uppercase rounded">
          {product.platform}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10]/90 via-[#0A0C10]/40 to-transparent" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-[#E8ECF1] mb-2" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
            {i18n.language === "km" ? product.titleKh : product.titleEn}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating || 0) ? "text-[#FFD600] fill-[#FFD600]" : "text-[#7A8299]"}`} />
            ))}
            <span className="text-xs text-[#7A8299] ml-1">({product.reviewCount || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            {product.isOnSale && (
              <span className="text-sm text-[#7A8299] line-through">${product.originalPrice}</span>
            )}
            <span className="text-xl font-bold text-cyan-400">${product.salePrice}</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="absolute bottom-0 left-0 right-0 h-12 bg-cyan-400 hover:bg-cyan-500 text-[#040507] font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400 z-20"
        style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>

      {/* Default visible info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#040507] to-transparent group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-sm font-semibold text-[#E8ECF1] truncate">{product.titleEn}</h3>
        <div className="flex items-center gap-2 mt-1">
          {product.isOnSale && <span className="text-xs text-[#7A8299] line-through">${product.originalPrice}</span>}
          <span className="text-base font-bold text-cyan-400">${product.salePrice}</span>
        </div>
      </div>
    </Link>
  );
}


