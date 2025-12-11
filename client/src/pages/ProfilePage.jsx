import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ label: "", line1: "", city: "", state: "", postalCode: "" });

  const addAddress = async () => {
    const res = await api.post("/api/auth/addresses", form);
    setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
    setForm({ label: "", line1: "", city: "", state: "", postalCode: "" });
  };

  const removeAddress = async (id) => {
    const res = await api.delete(`/api/auth/addresses/${id}`);
    setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Profile</h2>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm text-slate-700">Logged in as {user.email}</p>
        <p className="text-sm text-slate-700">Role: {user.role}</p>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 space-y-3">
        <h3 className="font-semibold text-slate-800">Addresses</h3>
        {user.addresses?.map((addr) => (
          <div key={addr._id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
            <div>
              <p className="font-medium text-slate-800">{addr.label || "Address"}</p>
              <p className="text-sm text-slate-600">
                {addr.line1}, {addr.city} {addr.state} {addr.postalCode}
              </p>
            </div>
            <button
              onClick={() => removeAddress(addr._id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        <div className="grid gap-2 sm:grid-cols-2">
          {["label", "line1", "city", "state", "postalCode"].map((field) => (
            <input
              key={field}
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          ))}
        </div>
        <button
          onClick={addAddress}
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Add Address
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

