import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  const fetchOrders = async () => {
    const res = await api.get("/api/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId) => {
    const draft = statusUpdate[orderId] || {};
    const body = {};
    if (draft.status) body.status = draft.status;
    if (draft.delivery) {
      const d = {};
      if (draft.delivery.trackingId) d.trackingId = draft.delivery.trackingId.trim();
      if (draft.delivery.courier) d.courier = draft.delivery.courier.trim();
      if (draft.delivery.expectedDate) d.expectedDate = draft.delivery.expectedDate;
      if (Object.keys(d).length) body.delivery = d;
    }
    await api.patch(`/api/orders/${orderId}/status`, body);
    fetchOrders();
  };

  const downloadInvoice = async (orderId) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/api/orders/${orderId}/invoice`, {
      responseType: "blob",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Orders</h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-800">Order #{order._id}</p>
                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleString()} • {order.status}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadInvoice(order._id)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Invoice PDF
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              {order.items.map((item) => (
                <div key={item.sku}>
                  {item.name} x {item.quantity} — ${item.discountPrice || item.price}
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-slate-700 font-semibold">Total: ${order.total?.toFixed(2)}</div>
            {user?.role === "admin" && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <select
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={statusUpdate[order._id]?.status || order.status}
                  onChange={(e) =>
                    setStatusUpdate((s) => ({
                      ...s,
                      [order._id]: { ...s[order._id], status: e.target.value },
                    }))
                  }
                >
                  {["Placed", "Processing", "Out for Delivery", "Delivered"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <input
                  placeholder="Tracking ID"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onChange={(e) =>
                    setStatusUpdate((s) => ({
                      ...s,
                      [order._id]: {
                        ...s[order._id],
                        delivery: { ...s[order._id]?.delivery, trackingId: e.target.value },
                      },
                    }))
                  }
                />
                <input
                  placeholder="Courier"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onChange={(e) =>
                    setStatusUpdate((s) => ({
                      ...s,
                      [order._id]: {
                        ...s[order._id],
                        delivery: { ...s[order._id]?.delivery, courier: e.target.value },
                      },
                    }))
                  }
                />
                <input
                  type="date"
                  placeholder="Expected Date"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onChange={(e) =>
                    setStatusUpdate((s) => ({
                      ...s,
                      [order._id]: {
                        ...s[order._id],
                        delivery: { ...s[order._id]?.delivery, expectedDate: e.target.value },
                      },
                    }))
                  }
                />
                <button
                  onClick={() => updateStatus(order._id)}
                  className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Update Status
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;

