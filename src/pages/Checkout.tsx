import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useCartStore } from "@/store/cart-store";
import { trpc } from "@/providers/trpc";
import { CreditCard, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"aba" | "acleda" | "wing">("aba");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [step, setStep] = useState<"payment" | "success">("payment");

  const { data: khqrCodes } = trpc.public.khqrCodes.useQuery();
  const selectedKhqr = khqrCodes?.find((k) => k.bankName === paymentMethod);

  if (items.length === 0 && step === "payment") {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#040507] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#7A8299]">Your cart is empty</p>
          <Button onClick={() => navigate("/products")} className="mt-4 bg-cyan-400 text-[#040507]">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    clearCart();
    setStep("success");
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507]">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8">
        {step === "payment" ? (
          <>
            <h1 className="text-3xl font-bold text-[#E8ECF1] mb-8">{t("checkout.title")}</h1>

            {/* Order Summary */}
            <div className="bg-[#0A0C10] rounded-xl p-5 border border-[#141821] mb-6">
              <h2 className="text-sm font-semibold text-[#7A8299] uppercase tracking-wider mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between py-2 border-b border-[#141821] last:border-0">
                  <span className="text-sm text-[#E8ECF1]">{item.titleEn} x{item.quantity}</span>
                  <span className="text-sm text-[#E8ECF1]">${(item.salePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 mt-2 border-t border-[#141821]">
                <span className="font-semibold text-[#E8ECF1]">{t("cart.total")}</span>
                <span className="text-xl font-bold text-cyan-400">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#0A0C10] rounded-xl p-5 border border-[#141821] mb-6">
              <h2 className="text-sm font-semibold text-[#7A8299] uppercase tracking-wider mb-4">{t("checkout.paymentMethod")}</h2>
              <div className="grid grid-cols-3 gap-3">
                {(["aba", "acleda", "wing"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      paymentMethod === method
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                        : "border-[#141821] text-[#7A8299] hover:border-[#1A1F2E]"
                    }`}
                  >
                    {method === "aba" && "ABA Bank"}
                    {method === "acleda" && "ACLEDA"}
                    {method === "wing" && "Wing Bank"}
                  </button>
                ))}
              </div>
            </div>

            {/* KHQR Code */}
            {selectedKhqr && (
              <div className="bg-[#0A0C10] rounded-xl p-5 border border-[#141821] mb-6 text-center">
                <h2 className="text-sm font-semibold text-[#7A8299] uppercase tracking-wider mb-4">
                  {t("checkout.scanQr")}
                </h2>
                <div className="w-48 h-48 mx-auto bg-white rounded-xl p-3 mb-4">
                  <img src={selectedKhqr.imageUrl} alt={`${paymentMethod} KHQR`} className="w-full h-full object-contain" />
                </div>
                {selectedKhqr.accountNameEn && (
                  <p className="text-sm text-[#7A8299]">{selectedKhqr.accountNameEn}</p>
                )}
                {selectedKhqr.accountNumber && (
                  <p className="text-sm text-[#E8ECF1] font-mono">{selectedKhqr.accountNumber}</p>
                )}
              </div>
            )}

            {/* Receipt Upload */}
            <div className="bg-[#0A0C10] rounded-xl p-5 border border-[#141821] mb-6">
              <h2 className="text-sm font-semibold text-[#7A8299] uppercase tracking-wider mb-4">
                {t("checkout.uploadReceipt")}
              </h2>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#141821] rounded-xl cursor-pointer hover:border-cyan-400/50 transition-colors">
                {receiptFile ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="text-sm">{receiptFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#7A8299] mb-2" />
                    <span className="text-sm text-[#7A8299]">Click to upload receipt</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {/* Complete Button */}
            <Button
              onClick={handleComplete}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-[#040507] font-semibold h-14 text-base"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Complete Order
            </Button>
          </>
        ) : (
          /* Success */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#E8ECF1] mb-2">{t("checkout.orderSuccess")}</h2>
            <p className="text-[#7A8299] mb-8">{t("checkout.orderPending")}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/products")} variant="outline" className="border-[#141821] text-[#7A8299]">
                Continue Shopping
              </Button>
              <Button onClick={() => navigate("/dashboard")} className="bg-cyan-400 text-[#040507]">
                View Orders
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
