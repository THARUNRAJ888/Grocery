// src/context/CartProvider.jsx
import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";
import CartContext from "./CartContext";

const GUEST_KEY = "guestCart";

const saveGuestCart = (items) => {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
};

const loadGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || "[]");
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState(() => loadGuestCart());
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user || user.role === "guest") {
      setItems(loadGuestCart());
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      setItems(res.data?.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const syncFromGuest = async () => {
    if (!user || user.role === "guest") return;

    const guestItems = loadGuestCart();
    if (!guestItems.length) return;

    setLoading(true);
    try {
      const payload = {
        items: guestItems.map((i) => ({
          productId: i.productId ?? i.product?._id,
          quantity: i.quantity,
        })),
      };

      await api.post("/api/cart/sync", payload);
      localStorage.removeItem(GUEST_KEY);
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product, qty = 1) => {
    if (!product?._id) return;

    if (!user || user.role === "guest") {
      const next = [...items];
      const idx = next.findIndex((i) => i.productId === product._id);

      if (idx >= 0) next[idx].quantity += qty;
      else next.push({ productId: product._id, product, quantity: qty });

      setItems(next);
      saveGuestCart(next);
      return;
    }

    await api.post("/api/cart", { productId: product._id, quantity: qty });
    fetchCart();
  };

  const updateQty = async (productId, quantity) => {
    if (!user || user.role === "guest") {
      const next = items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
      setItems(next);
      saveGuestCart(next);
      return;
    }

    await api.put(`/api/cart/${productId}`, { quantity });
    fetchCart();
  };

  const removeItem = async (productId) => {
    if (!user || user.role === "guest") {
      const next = items.filter((i) => i.productId !== productId);
      setItems(next);
      saveGuestCart(next);
      return;
    }

    await api.delete(`/api/cart/${productId}`);
    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        updateQty,
        removeItem,
        fetchCart,
        syncFromGuest,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
