import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, fetchCart } = useCart();
  const [addressId, setAddressId] = useState("");
  const [newAddress, setNewAddress] = useState({ line1: "", city: "", state: "", postalCode: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.addresses?.length) setAddressId(user.addresses[0]._id);
  }, [user]);

  if (!user || user.role === "guest") {
    return <div className="rounded-xl bg-white p-4 shadow-sm">Login to checkout.</div>;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.discountPrice || item.product?.price || 0) * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const delivery = subtotal > 80 ? 0 : 4.99;

  const placeOrder = async () => {
    try {
      setError("");
      const payload = {
        items: items.map((i) => ({ productId: i.product?._id || i.productId, quantity: i.quantity })),
        addressId,
        address: addressId ? undefined : newAddress,
        paymentMethod,
        cardLast4: paymentMethod === "card" ? card.number.slice(-4) : undefined,
      };
      await api.post("/api/orders", payload);
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Order failed");
    }
  };

  const addAddress = async () => {
    const res = await api.post("/api/auth/addresses", newAddress);
    setAddressId(res.data.addresses.slice(-1)[0]._id);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h3 className="font-semibold text-slate-800">Select Address</h3>
          <div className="mt-3 space-y-2">
            {user.addresses?.map((addr) => (
              <label key={addr._id} className="flex items-start gap-2 rounded-lg border border-slate-200 p-3">
                <input
                  type="radio"
                  name="address"
                  checked={addressId === addr._id}
                  onChange={() => setAddressId(addr._id)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-slate-800">{addr.label || "Saved Address"}</p>
                  <p className="text-sm text-slate-600">
                    {addr.line1}, {addr.city} {addr.state} {addr.postalCode}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <h4 className="text-sm font-semibold text-slate-700">Add new address</h4>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                placeholder="Line 1"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
              />
              <input
                placeholder="City"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
              <input
                placeholder="State"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
              <input
                placeholder="Postal Code"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={addAddress}
              className="mt-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Save Address
            </button>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h3 className="font-semibold text-slate-800">Payment</h3>
          <div className="mt-3 flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Card (mock)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              Cash on Delivery
            </label>
          </div>
          {paymentMethod === "card" && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input
                placeholder="Card Number"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(e) => setCard({ ...card, number: e.target.value })}
              />
              <input
                placeholder="Name on Card"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(e) => setCard({ ...card, name: e.target.value })}
              />
              <input
                placeholder="MM/YY"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              />
              <input
                placeholder="CVV"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h3 className="font-semibold text-slate-800">Summary</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>${delivery.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-800">
            <span>Total</span>
            <span>${(subtotal + tax + delivery).toFixed(2)}</span>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          onClick={placeOrder}
          className="mt-4 w-full rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;

