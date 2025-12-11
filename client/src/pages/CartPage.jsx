import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, updateQty, removeItem } = useCart();
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.discountPrice || item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-3">
        <h2 className="text-2xl font-bold text-slate-800">Your Cart</h2>
        {items.length === 0 && (
          <div className="rounded-xl bg-white p-4 text-slate-600 shadow-sm">Cart is empty.</div>
        )}
        {items.map((item) => (
          <div key={item.productId || item.product?._id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="h-16 w-16 rounded-lg bg-primary-50" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{item.product?.name}</p>
              <p className="text-sm text-slate-500">${item.product?.discountPrice || item.product?.price}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQty(item.product?._id || item.productId, Number(e.target.value))}
              className="w-20 rounded-lg border border-slate-200 px-3 py-2"
            />
            <button
              onClick={() => removeItem(item.product?._id || item.productId)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h3 className="font-semibold text-slate-800">Order Summary</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${(subtotal * 0.08).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>${subtotal > 80 ? "0.00" : "4.99"}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-800">
            <span>Total</span>
            <span>${(subtotal * 1.08 + (subtotal > 80 ? 0 : 4.99)).toFixed(2)}</span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="mt-4 block rounded-full bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-700"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;

