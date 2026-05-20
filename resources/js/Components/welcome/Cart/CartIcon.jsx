import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

export default function CartIcon({ onClick }) {
  const { cartCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-blueLight bg-white shadow hover:bg-blueLight transition-colors duration-300"
      aria-label="Abrir carrito"
    >
      <ShoppingCart size={20} className="text-bluePrimary" />

      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-greenDark text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
          {cartCount}
        </span>
      )}
    </button>
  );
}
