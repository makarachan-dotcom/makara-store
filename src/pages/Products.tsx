import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Link } from "react-router";
import { useCartStore } from "@/store/cart-store";
import { Star, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Products() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const { data: categories } = trpc.category.list.useQuery();
  const { data: productsData } = trpc.product.list.useQuery({
    search: search || undefined,
    categoryId: categoryFilter,
    page,
    limit: 12,
  });

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#E8ECF1] mb-4">
            {search ? `${t("common.search")}: "${search}"` : t("nav.store")}
          </h1>

          {/* Search Input */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8299]" />
            <input
              type="text"
              defaultValue={search}
              onChange={(e) => {
                if (e.target.value) {
                  setSearchParams({ search: e.target.value });
                } else {
                  setSearchParams({});
                }
                setPage(1);
              }}
              placeholder={t("common.search") + "..."}
              className="w-full bg-[#141821] border border-[#1A1F2E] rounded-lg py-2.5 pl-10 pr-4 text-[#E8ECF1] placeholder-[#7A8299] focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setCategoryFilter(undefined); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !categoryFilter ? "bg-cyan-400 text-[#040507]" : "bg-[#141821] text-[#7A8299] hover:text-[#E8ECF1] border border-[#1A1F2E]"
              }`}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategoryFilter(cat.id); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat.id ? "bg-cyan-400 text-[#040507]" : "bg-[#141821] text-[#7A8299] hover:text-[#E8ECF1] border border-[#1A1F2E]"
                }`}
              >
                {i18n.language === "km" ? cat.nameKh : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsData?.items.map((product) => (
            <div key={product.id} className="group relative bg-[#0A0C10] rounded-2xl overflow-hidden border border-[#141821] hover:border-cyan-400/20 transition-all">
              <Link to={`/products/${product.slug}`}>
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={product.imageUrl || ""} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.slug}`}>
                  <h3 className="text-sm font-semibold text-[#E8ECF1] mb-1 truncate hover:text-cyan-400 transition-colors">
                    {i18n.language === "km" ? product.titleKh : product.titleEn}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating || 0) ? "text-[#FFD600] fill-[#FFD600]" : "text-[#7A8299]"}`} />
                  ))}
                  <span className="text-xs text-[#7A8299]">({product.reviewCount || 0})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-cyan-400">${product.salePrice}</span>
                    {product.isOnSale && <span className="text-xs text-[#7A8299] line-through">${product.originalPrice}</span>}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addItem({
                      productId: product.id, quantity: 1, slug: product.slug,
                      titleEn: product.titleEn, titleKh: product.titleKh,
                      imageUrl: product.imageUrl, salePrice: product.salePrice, originalPrice: product.originalPrice,
                    })}
                    className="bg-cyan-400 hover:bg-cyan-500 text-[#040507] h-8 px-3"
                  >
                    <ShoppingCart className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {productsData && productsData.total > 12 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: Math.ceil(productsData.total / 12) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  page === i + 1 ? "bg-cyan-400 text-[#040507]" : "bg-[#141821] text-[#7A8299] hover:text-[#E8ECF1]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
