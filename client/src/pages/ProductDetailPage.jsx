import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-white">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-primary-600">No image</div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          {product.images?.slice(0, 4).map((img) => (
            <img key={img} src={img} className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-100" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary-700">{product.category}</p>
          <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
          <p className="text-sm text-slate-600">{product.desc}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary-700">${product.discountPrice || product.price}</span>
          {product.discountPrice && (
            <span className="text-slate-400 line-through">${product.price}</span>
          )}
          <span className="text-sm text-amber-600">⭐ {product.rating || 4.2}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Quantity</label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 rounded-lg border border-slate-200 px-3 py-2"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => addItem(product, qty)}
            className="rounded-full bg-primary-600 px-5 py-3 text-white font-semibold hover:bg-primary-700"
          >
            Add to Cart
          </button>
          <button
            onClick={async () => {
              await addItem(product, qty);
              navigate("/checkout");
            }}
            className="rounded-full border border-primary-200 px-5 py-3 font-semibold text-primary-700 hover:bg-primary-50"
          >
            Buy Now
          </button>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h3 className="font-semibold text-slate-800">Tags</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

