import { useState } from "react";
import { useCart } from "@/Contexts/CartContext";
import ProductGallery from "./ProductGallery";

export default function ShowProduct({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.find(v => v.stock > 0) || null
  );

  const [quantity, setQuantity] = useState(
    selectedVariant ? Math.min(1, selectedVariant.stock) : 1
  );

  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const { addToCart } = useCart();

  const multimedia = product.multimedia || [];
  const mainImage =
    multimedia.find(m => m.type !== "video")?.url ||
    "https://via.placeholder.com/600x400";

  const stock = selectedVariant?.stock || 0;
  const isOutOfStock = stock === 0;
  const currentUrl = window.location.href;

  const selectedAttribute =
    selectedVariant?.values[0]?.attribute || "Variante";

  const selectedValue =
    selectedVariant?.values[0]?.value || "";

  const handleAddToCart = async () => {
    if (!selectedVariant || isOutOfStock) return;

    setAdding(true);

    await addToCart({
      id: product.id,
      nombre: product.name,
      precio: selectedVariant.price,
      cantidad: quantity,
      image: mainImage,
      sku: selectedVariant.sku,
      stock: selectedVariant.stock,
      variant: `${selectedAttribute}: ${selectedValue}`,
    });

    setAdding(false);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      
      <div className="max-h-[80vh] overflow-y-auto">
        <ProductGallery multimedia={multimedia} productName={product.name} />
      </div>

    
      <div className="space-y-6 sticky top-0" style={{ fontFamily: "'Playfair Display', serif" }}>
        <h1 className="text-4xl font-extrabold uppercase text-bluePrimary">{product.name}</h1>
        <p className="text-3xl font-bold text-bluePrimary">
          $ {Number(selectedVariant?.price ?? product.price).toFixed(0)}
        </p>

        {selectedVariant && (
          <p className="text-md font-semibold text-greenDark">
            <span className="font-bold">{selectedVariant.sku}</span>
          </p>
        )}

        <p className="text-lg text-greenDark">{product.description}</p>

        
        <h3 className="text-xl font-semibold text-greenDark">Seleccionar {selectedAttribute}:</h3>
        <div className="flex flex-wrap gap-3">
          {product.variants.map(v => {
            const label = v.values[0]?.value;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVariant(v);
                  setQuantity(1);
                }}
                disabled={v.stock === 0}
                className={`min-w-[45px] h-10 flex items-center justify-center border rounded-xl text-lg font-bold transition
                  ${selectedVariant?.id === v.id
                    ? `bg-bluePrimary text-white border-bluePrimary`
                    : `bg-white text-greenDark border-blueSecondary`
                  }
                  ${v.stock === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-bluePrimary"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        {selectedVariant && (
          <div className="pt-2">
            {isOutOfStock ? (
              <p className="text-red-500 font-bold text-lg">NO DISPONIBLE</p>
            ) : (
              <>
                <p className="font-semibold text-greenDark">Stock disponible: {stock}</p>
                <div className="w-full h-2 bg-blueLight/30 rounded-full mt-1">
                  <div
                    className="h-full bg-bluePrimary rounded-full"
                    style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
        )}

       
        {!isOutOfStock && selectedVariant && (
          <div>
            <h3 className="text-lg font-semibold text-greenDark">Cantidad:</h3>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 border border-blueSecondary rounded-full text-2xl hover:border-bluePrimary transition"
              >−</button>
              <span className="text-2xl font-bold text-greenDark">{quantity}</span>
              <button
                onClick={() => setQuantity(q => (q < stock ? q + 1 : q))}
                className="w-10 h-10 border border-blueSecondary rounded-full text-2xl hover:border-bluePrimary transition"
              >+</button>
            </div>
          </div>
        )}

       
        <button
          disabled={!selectedVariant || isOutOfStock || adding}
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-xl text-lg font-bold transition
            ${!selectedVariant || isOutOfStock
              ? "bg-blueLight text-white cursor-not-allowed"
              : "bg-bluePrimary text-white hover:bg-blueSecondary"
            }`}
        >
          {adding ? "Añadiendo..." : success ? "Añadido " : "Añadir al carrito"}
        </button>

        <a
          href={`https://wa.me/56978843627?text=Hola!%20Estoy%20interesado%20en%20este%20producto:%0A${encodeURIComponent(product.name)}%0A${encodeURIComponent(currentUrl)}`}
          target="_blank"
          className="block text-center w-full py-4 rounded-xl border border-greenDark text-greenDark font-bold text-lg hover:bg-greenDark/10 transition"
        >
          Comprar por WhatsApp
        </a>
      </div>
    </div>
  );
}
