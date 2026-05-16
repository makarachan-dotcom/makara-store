import { useTranslation } from "react-i18next";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cart-store";
import { useState, useEffect } from "react";
import { Clock, Tag } from "lucide-react";

export function DealsSection() {
  const { t } = useTranslation();
  const { data: products } = trpc.product.onSale.useQuery();

  const deals = products?.slice(0, 4) || [];

  return (
    <section className="relative py-20 md:py-28 bg-[#0A0C10]">
      {/* Cyan glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-cyan-400/50 shadow-[0_0_20px_rgba(0,229,255,0.3)]" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF00A0]/10 rounded-full mb-4">
              <span className="w-2 h-2 bg-[#FF00A0] rounded-full animate-pulse" />
              <span className="text-xs font-medium text-[#FF00A0] uppercase tracking-wider">
                {t("deals.badge")}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#E8ECF1]">
              {t("deals.title")}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Clock className="w-5 h-5" />
            <CountdownTimer />
          </div>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((product) => (
            <DealCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DealCard({ product }: { product: { id: number; slug: string; titleKh: string; titleEn: string; imageUrl: string | null; originalPrice: number; salePrice: number; isOnSale: boolean | null; rating: number | null; reviewCount: number | null; descriptionKh: string | null; descriptionEn: string | null } }) {
  const { i18n } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  return (
    <div className="relative bg-[#0A0C10] rounded-2xl overflow-hidden border border-[#141821] group hover:border-[#FF00A0]/30 transition-all duration-300">
      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-10 bg-[#FF00A0] text-white text-xs font-bold px-2 py-1 rounded transform rotate-[8deg]">
        -{discount}%
      </div>

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.imageUrl || ""}
          alt={product.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#E8ECF1] mb-1 truncate">
          {i18n.language === "km" ? product.titleKh : product.titleEn}
        </h3>
        <p className="text-xs text-[#7A8299] mb-3 line-clamp-2">
          {i18n.language === "km" ? product.descriptionKh : product.descriptionEn}
        </p>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-cyan-400">${product.salePrice}</span>
          <span className="text-sm text-[#7A8299] line-through">${product.originalPrice}</span>
        </div>
        <button
          onClick={() =>
            addItem({
              productId: product.id,
              quantity: 1,
              slug: product.slug,
              titleEn: product.titleEn,
              titleKh: product.titleKh,
              imageUrl: product.imageUrl,
              salePrice: product.salePrice,
              originalPrice: product.originalPrice,
            })
          }
          className="w-full py-2.5 bg-[#FFD600] hover:bg-[#FFE600] text-[#040507] font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Tag className="w-4 h-4" />
          Claim Deal
        </button>
      </div>
    </div>
  );
}

function CountdownTimer() {
  const [time, setTime] = useState({ h: 4, m: 23, s: 17 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <span className="font-mono text-lg font-bold">
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </span>
  );
}


