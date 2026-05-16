import { createContext, useContext, type ReactNode } from "react";
import { useCartStore } from "@/store/cart-store";

const CartContext = createContext<ReturnType<typeof useCartStore> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCartStore();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
