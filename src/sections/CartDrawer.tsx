import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const { t } = useLanguage();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0A1628] border-l border-white/10 z-[70] transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E5B75C]" />
              <h3 className="text-white font-semibold text-lg">
                {t("Your Cart", "កន្ត្រករបស់អ្នក")}
              </h3>
              <span className="px-2 py-0.5 bg-[#E5B75C]/10 text-[#E5B75C] text-xs font-medium rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/40 text-sm mb-2">
                  {t("Your cart is empty", "កន្ត្រករបស់អ្នកទទេ")}
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#E5B75C] text-sm hover:underline"
                >
                  {t("Browse Products", "រកមើលផលិតផល")}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                    <p className="text-[#E5B75C] text-sm font-semibold mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1.5 rounded-md text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">{t("Subtotal", "សរុប")}</span>
                <span className="text-[#E5B75C] text-xl font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#E5B75C] text-[#0A1628] rounded-lg font-semibold hover:bg-[#F0C975] transition-all">
                {t("Checkout", "ពិនិត្យចេញ")}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={clearCart}
                className="w-full text-center text-white/30 text-sm hover:text-red-400 transition-colors"
              >
                {t("Clear Cart", "លុបកន្ត្រក")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
