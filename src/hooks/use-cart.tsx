import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  nameKh: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
  setIsOpen: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("makara_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  const addMutation = trpc.cart.add.useMutation();

  const persist = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("makara_cart", JSON.stringify(newItems));
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        let newItems: CartItem[];
        if (existing) {
          newItems = prev.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...prev, { ...item, quantity: 1 }];
        }
        localStorage.setItem("makara_cart", JSON.stringify(newItems));
        return newItems;
      });
      setIsOpen(true);
      toast.success("Added to cart");
      try {
        addMutation.mutate({ productId: item.productId, quantity: 1 });
      } catch {
        // silent fail for guest users
      }
    },
    [addMutation]
  );

  const removeItem = useCallback(
    (id: number) => {
      const newItems = items.filter((i) => i.id !== id);
      persist(newItems);
    },
    [items, persist]
  );

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity < 1) {
        removeItem(id);
        return;
      }
      const newItems = items.map((i) => (i.id === id ? { ...i, quantity } : i));
      persist(newItems);
    },
    [items, persist, removeItem]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
