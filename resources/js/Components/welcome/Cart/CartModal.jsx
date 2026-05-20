import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { currency } from '@/utils/currency';

export default function CartModal({ isOpen, onClose }) {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setShow(true), 20);
    } else {
      setShow(false);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000000] flex justify-end transition-colors duration-300
        ${show ? 'bg-black/50' : 'bg-black/0'}`}
    >
      <div
        className={`
          bg-white
          w-full
          sm:w-96
          h-full
          p-6
          relative
          flex
          flex-col
          text-gray-800
          shadow-2xl
          rounded-l-3xl
          transform
          transition-transform
          duration-300
          ${show ? 'translate-x-0' : 'translate-x-full'}
        `}
      >

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-bluePrimary transition"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-bluePrimary">
            Mi carrito
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              El carrito está vacío
            </p>
          ) : (
            cart.map(item => (
              <div
                key={item.rowId}
                className="flex gap-3 p-3 border border-blueLight rounded-2xl"
              >
                <img
                  src={item.options.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-16 h-16 flex-shrink-0 object-cover rounded-xl"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="font-semibold truncate text-sm">
                      {item.name}
                    </p>

                    {item.options.variant && (
                      <p className="text-xs text-gray-500">
                        {item.options.variant}
                      </p>
                    )}

                    <p className="font-bold text-greenDark text-sm mt-1 tabular-nums">
                      {currency} {(item.price * item.qty).toFixed(0)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.rowId, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className="p-1 border border-blueLight rounded hover:bg-blueLight transition disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="px-2 font-semibold text-sm">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.rowId, item.qty + 1)}
                        className="p-1 border border-blueLight rounded hover:bg-blueLight transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className="text-xs text-gray-400 hover:text-red-500 transition ml-2"
                      onClick={() => removeFromCart(item.rowId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <button
              onClick={clearCart}
              className="flex items-center justify-center text-lg text-gray-500 hover:text-red-500 transition mr-10"
            >
              <Trash2 size={18} className="mr-1" />
              Vaciar
            </button>

            <div className="mt-4 border-t border-blueLight pt-4 flex flex-col gap-4">
              <p className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-greenDark tabular-nums">
                  {currency} {total.toFixed(0)}
                </span>
              </p>

              <Link
                href="/checkout"
                className="
                  block
                  w-full
                  py-3
                  text-center
                  bg-bluePrimary
                  text-white
                  font-semibold
                  rounded-xl
                  hover:bg-blueSecondary
                  transition
                "
              >
                Confirmar pedido
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
