import { useEffect, useState } from "react";
import api from "../lib/api";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    sku: "",
    category: "",
    price: 0,
    discountPrice: 0,
    desc: "",
    stock: 0,
    unit: "",
  });

  const fetchProducts = async () => {
    const res = await api.get("/api/products", { params: { limit: 50 } });
    setProducts(res.data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveProduct = async () => {
    if (editing) {
      await api.put(`/api/products/${editing}`, form);
    } else {
      await api.post("/api/products", form);
    }
    setForm({ id: "", name: "", sku: "", category: "", price: 0, discountPrice: 0, desc: "", stock: 0, unit: "" });
    setEditing(null);
    fetchProducts();
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice || 0,
      desc: p.desc || "",
      stock: p.stock || 0,
      unit: p.unit || "",
    });
  };

  const remove = async (id) => {
    await api.delete(`/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Admin: Products</h2>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 space-y-3">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {["id", "name", "sku", "category", "unit"].map((field) => (
            <input
              key={field}
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          ))}
          {["price", "discountPrice", "stock"].map((field) => (
            <input
              key={field}
              type="number"
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          ))}
        </div>
        <textarea
          placeholder="Description"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          onClick={saveProduct}
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {editing ? "Update Product" : "Create Product"}
        </button>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
            <div>
              <p className="font-semibold text-slate-800">{p.name}</p>
              <p className="text-xs text-slate-500">
                {p.category} • ${p.price}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(p)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                Edit
              </button>
              <button
                onClick={() => remove(p.id)}
                className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsPage;

