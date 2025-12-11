const ProductFilters = ({ filters, setFilters, categories = [] }) => {
  const update = (field, value) => setFilters((f) => ({ ...f, [field]: value, page: 1 }));

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 grid gap-3 sm:grid-cols-4">
      <div className="col-span-2 sm:col-span-1">
        <label className="text-xs text-slate-500">Search</label>
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Search products"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-slate-500">Category</label>
        <select
          value={filters.category || ""}
          onChange={(e) => update("category", e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-slate-500">Sort</label>
        <select
          value={filters.sort || ""}
          onChange={(e) => update("sort", e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => update("inStock", e.target.checked)}
          />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={filters.ratingMin >= 4}
            onChange={(e) => update("ratingMin", e.target.checked ? 4 : undefined)}
          />
          4★+
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;

