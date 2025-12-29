import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

export default function CartIcon({ onClick }) {
  const { cartCount } = useCart();

  return (
    <div
      className="fixed top-1/2 right-0 -translate-y-1/2 flex items-center cursor-pointer z-50"
      onClick={onClick}
    >
      <div
        className="
          bg-white
          w-12
          h-40
          rounded-l-full
          border
          border-blueLight
          shadow-lg
          flex
          flex-col
          items-center
          justify-center
          relative
          transition-all
          duration-300
          hover:bg-blueLight
        "
      >
     
        <ShoppingCart
          size={30}
          className="text-bluePrimary transition-colors duration-300"
        />

        {cartCount > 0 && (
          <span
            className="
              absolute
              top-12
              right-1
              bg-greenDark
              text-white
              text-xs
              font-bold
              w-7
              h-7
              rounded-full
              flex
              items-center
              justify-center
              shadow-md
            "
          >
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
}
