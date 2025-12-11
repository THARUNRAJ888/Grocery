import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const saveGuestCart = (items) => localStorage.setItem("guestCart", JSON.stringify(items));
const loadGuestCart = () => JSON.parse(localStorage.getItem("guestCart") || "[]");

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    if (user.role === "guest") {
      setItems(loadGuestCart());
      return;
    }
    setLoading(true);
    const res = await api.get("/api/cart");
    setItems(res.data.items || res.data?.items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const syncFromGuest = async () => {
    if (user?.role === "guest" || !user) return;
    const guestItems = loadGuestCart();
    if (guestItems.length === 0) return;
    await api.post("/api/cart/sync", {
      items: guestItems.map((i) => ({ product: i.product._id || i.productId, quantity: i.quantity })),
    });
    localStorage.removeItem("guestCart");
    fetchCart();
  };

  const addItem = async (product, quantity = 1) => {
    if (user?.role === "guest") {
      const next = [...items];
      const idx = next.findIndex((i) => i.productId === product._id);
      if (idx >= 0) next[idx].quantity += quantity;
      else next.push({ productId: product._id, product, quantity });
      setItems(next);
      saveGuestCart(next);
      return;
    }
    await api.post("/api/cart", { productId: product._id, quantity });
    fetchCart();
  };

  const updateQty = async (productId, quantity) => {
    if (user?.role === "guest") {
      const next = items.map((i) => (i.productId === productId ? { ...i, quantity } : i));
      setItems(next);
      saveGuestCart(next);
      return;
    }
    await api.put(`/api/cart/${productId}`, { quantity });
    fetchCart();
  };

  const removeItem = async (productId) => {
    if (user?.role === "guest") {
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
      value={{ items, loading, addItem, updateQty, removeItem, fetchCart, syncFromGuest }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
