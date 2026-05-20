import { Link } from "@inertiajs/react";
import { currency } from "@/utils/currency";

export default function ProductCard({ product, isInSwiper = false, accent = false }) {
  const imageUrl =
    product.multimedia?.[0]?.url ||
    "https://via.placeholder.com/600x800";

  const isWhatsAppOnly = Number(product.price) === 0;

  const priceColor = accent ? "text-aquamarine" : "text-green-700";
  const variantActiveColor = accent
    ? "text-aquamarine border-aquamarine hover:bg-aquamarine hover:text-white"
    : "text-blue-600 border-blue-400 hover:bg-blue-500 hover:text-white";

  return (
    <Link
      href={`/products/${product.name.replace(/\s+/g, '-').toLowerCase()}/${product.id}`}
      className="w-full h-full relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
    >
      <div className="w-full aspect-[4/5] p-4 bg-white border-b border-y-blueSecondary rounded-t-3xl overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2 overflow-hidden">
        {/* Nombre: siempre 2 líneas de altura para que todos los cards queden alineados */}
        <h3
          className="text-sm font-extrabold uppercase tracking-wide text-gray-900 line-clamp-2 leading-snug"
          style={{ minHeight: '2.6em', letterSpacing: '0.04em' }}
        >
          {product.name}
        </h3>

        {/* Variantes: ancho máximo fijo, exceso cortado */}
        <div className="flex flex-wrap gap-1.5 overflow-hidden" style={{ maxHeight: '4.5rem' }}>
          {product.variants?.map(v => {
            const out = v.stock === 0;
            return (
              <span
                key={v.id}
                className={`
                  px-2 py-0.5 text-xs font-medium rounded-full border transition flex-shrink-0
                  ${out ? "bg-gray-200 text-gray-400 border-gray-300" : variantActiveColor}
                `}
              >
                {v.values[0]?.value}
              </span>
            );
          })}
        </div>

        {/* Precio anclado al fondo */}
        <div className="mt-auto pt-2">
          {isWhatsAppOnly ? (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
              Solo por WhatsApp
            </span>
          ) : (
            <p className={`text-xl font-bold font-sans tabular-nums ${priceColor}`}>
              {currency} {Number(product.price).toFixed(0)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
