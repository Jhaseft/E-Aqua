// ProductCard.jsx
import { Link } from "@inertiajs/react";

export default function ProductCard({ product, isInSwiper = false }) {
  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

  const imageUrl =
    product.multimedia?.[0]?.url ||
    "https://via.placeholder.com/600x800";

  const isWhatsAppOnly = Number(product.price) === 0;

  return (
    <Link
      href={`/products/${product.name.replace(/\s+/g, '-').toLowerCase()}/${product.id}`}
      className={`
        w-full h-full relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col
        ${!isInSwiper ? 'border-4' : ''}
      `}
      style={{
        fontFamily: "'Playfair Display', serif",
        borderImage: !isInSwiper ? "linear-gradient(to bottom, #bae6fd, #38bdf8, #1e40af) 1" : undefined,
        borderStyle: !isInSwiper ? "solid" : undefined
      }}
    >
      <div className="w-full aspect-[4/5] p-4 bg-white border-b border-y-blueSecondary rounded-t-3xl overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 line-clamp-2">{product.name}</h3>

        <div className="flex flex-wrap gap-2 flex-1 content-start">
          {product.variants?.map(v => {
            const out = v.stock === 0;
            return (
              <span
                key={v.id}
                className={`
                  px-3 py-1 text-sm font-medium rounded-full border transition
                  ${out
                    ? "bg-gray-200 text-gray-400 border-gray-300"
                    : "bg-white text-blue-600 border-blue-400 hover:bg-blue-500 hover:text-white"
                  }
                `}
              >
                {v.values[0]?.value}
              </span>
            );
          })}
        </div>

        {isWhatsAppOnly ? (
          <span className="inline-block self-start px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
            Solo por WhatsApp
          </span>
        ) : (
          <p className="text-2xl font-bold tracking-wide text-green-700">
            $ {Number(product.price).toFixed(0)}
          </p>
        )}
      </div>
    </Link>
  );
}
