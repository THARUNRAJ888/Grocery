import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100 p-4 flex flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary-50 to-white">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://picsum.photos/seed/fallback/640/640";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary-600 text-sm">No image</div>
        )}
      </div>
      <div className="mt-3 flex-1">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-slate-500">{product.unit || "per item"}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-primary-700">${product.discountPrice || product.price}</span>
          {product.discountPrice && (
            <span className="text-xs text-slate-400 line-through">${product.price}</span>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => addItem(product, 1)}
          className="flex-1 rounded-full bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Add to Cart
        </button>
        <Link
          to={`/products/${product.id}`}
          className="rounded-full border border-primary-200 px-3 py-2 text-sm text-primary-700 hover:bg-primary-50"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

