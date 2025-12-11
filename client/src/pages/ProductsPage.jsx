import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

const ProductsPage = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 12, sort: "newest" });
  const [data, setData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([
    { title: "Welcome to FreshCart", desc: "Your one-stop grocery store with 500+ fresh picks." },
    { title: "Buy 2 Get 1 Free", desc: "Snacks & beverages combo this week only." },
    { title: "Free delivery over $80", desc: "Auto-applies at checkout." },
  ]);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get("/api/products", { params: filters });
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    api.get("/api/products", { params: { limit: 200 } }).then((res) => {
      setCategories([...new Set(res.data.data.map((p) => p.category))]);
    });
  }, []);

  const totalPages = Math.ceil((data.total || 0) / (filters.limit || 12)) || 1;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white p-5 shadow-md">
        <h2 className="text-2xl font-bold">Welcome to FreshCart</h2>
        <p className="text-sm text-white/90">Discover 500+ items across 10 categories. Fresh, fast, and mobile-first.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {offers.map((o) => (
            <div key={o.title} className="rounded-xl bg-white/15 px-3 py-2 text-sm">
              <p className="font-semibold">{o.title}</p>
              <p className="text-white/85">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <ProductFilters filters={filters} setFilters={setFilters} categories={categories} />
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <button
          disabled={filters.page <= 1}
          onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}
          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-slate-600">
          Page {filters.page} of {totalPages}
        </span>
        <button
          disabled={filters.page >= totalPages}
          onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;

