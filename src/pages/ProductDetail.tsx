import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cart-store";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);

  const { data: product } = trpc.product.getBySlug.useQuery({ slug: slug || "" });
  const { data: related } = trpc.product.related.useQuery(
    { categoryId: product?.categoryId || 0, excludeId: product?.id || 0 },
    { enabled: !!product }
  );

  if (!product) {
    return (
      <div className="pt-24 min-h-screen bg-[#040507] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-[#7A8299] hover:text-cyan-400 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0A0C10]">
            <img src={product.imageUrl || ""} alt="" className="w-full h-full object-cover" />
            {product.isOnSale && (
              <div className="absolute top-4 left-4 bg-[#FF00A0] text-white text-sm font-bold px-3 py-1 rounded-lg">
                -{discount}%
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/10 rounded-full w-fit mb-4">
              <span className="text-xs font-medium text-cyan-400 uppercase">{product.platform}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-[#E8ECF1] mb-4">
              {i18n.language === "km" ? product.titleKh : product.titleEn}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? "text-[#FFD600] fill-[#FFD600]" : "text-[#7A8299]"}`} />
              ))}
              <span className="text-sm text-[#7A8299]">({product.reviewCount || 0} {t("product.reviews")})</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-cyan-400">${product.salePrice}</span>
              {product.isOnSale && (
                <span className="text-lg text-[#7A8299] line-through">${product.originalPrice}</span>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-[#7A8299] leading-relaxed">
                {i18n.language === "km" ? product.descriptionKh : product.descriptionEn}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                {product.stockQuantity && product.stockQuantity > 0 ? t("product.inStock") : t("product.outOfStock")}
              </span>
            </div>

            <div className="flex gap-4 mt-auto">
              <Button
                size="lg"
                onClick={() => addItem({
                  productId: product.id, quantity: 1, slug: product.slug,
                  titleEn: product.titleEn, titleKh: product.titleKh,
                  imageUrl: product.imageUrl, salePrice: product.salePrice, originalPrice: product.originalPrice,
                })}
                className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-[#040507] font-semibold h-14 text-base"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t("product.addToCart")}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#E8ECF1] mb-6">{t("product.related")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#0A0C10] mb-2">
                    <img src={p.imageUrl || ""} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                  <h3 className="text-sm font-medium text-[#E8ECF1] group-hover:text-cyan-400 transition-colors truncate">{p.titleEn}</h3>
                  <span className="text-sm font-bold text-cyan-400">${p.salePrice}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
