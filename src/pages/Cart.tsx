import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useCartStore } from "@/store/cart-store";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#040507] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-[#7A8299] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#E8ECF1] mb-2">{t("cart.empty")}</h2>
          <Link to="/products" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            {t("cart.continue")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507]">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#E8ECF1] mb-8">{t("cart.title")}</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-[#0A0C10] rounded-xl p-4 border border-[#141821]">
              <Link to={`/products/${item.slug}`} className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                <img src={item.imageUrl || ""} alt="" className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.slug}`}>
                  <h3 className="text-sm font-medium text-[#E8ECF1] truncate hover:text-cyan-400 transition-colors">
                    {item.titleEn}
                  </h3>
                </Link>
                <p className="text-sm text-cyan-400 font-semibold mt-1">${item.salePrice}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-[#141821] flex items-center justify-center text-[#7A8299] hover:text-[#E8ECF1] transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium text-[#E8ECF1] w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-[#141821] flex items-center justify-center text-[#7A8299] hover:text-[#E8ECF1] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto p-2 text-[#7A8299] hover:text-[#FF00A0] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[#E8ECF1]">
                  ${(item.salePrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-[#0A0C10] rounded-xl p-6 border border-[#141821]">
          <div className="flex justify-between text-[#7A8299] mb-2">
            <span>{t("cart.subtotal")}</span>
            <span className="text-[#E8ECF1]">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-[#E8ECF1] pt-4 border-t border-[#141821]">
            <span>{t("cart.total")}</span>
            <span className="text-cyan-400">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={clearCart}
              className="border-[#141821] text-[#7A8299] hover:text-[#FF00A0] hover:border-[#FF00A0]/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={() => navigate("/checkout")}
              className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-[#040507] font-semibold h-11"
            >
              {t("cart.checkout")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
