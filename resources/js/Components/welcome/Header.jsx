import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import CartIcon from '@/Components/welcome/Cart/CartIcon';

export default function Header({ auth, onCartOpen }) {
  const { props } = usePage();
  const [flashMessage, setFlashMessage] = useState(null);
  const categories = props.categories || [];
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (props?.flash?.success) {
      setFlashMessage({ type: 'success', message: props.flash.success });
      setTimeout(() => setFlashMessage(null), 2000);
    } else if (props?.flash?.error) {
      setFlashMessage({ type: 'error', message: props.flash.error });
      setTimeout(() => setFlashMessage(null), 3000);
    }
  }, [props]);

  return (
    <>
      <header className="w-full bg-white text-gray-800 shadow-sm py-4 border-b border-blueLight sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center px-6">

          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dnbklbswg/image/upload/v1759791758/Logo_AH_con_HTW_wzxlez.jpg"
              alt="Logo de la tienda"
              className="h-16 w-32 md:h-24 md:w-48 object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          <nav className="flex md:text-2xl md:gap-10 text-xl gap-4 font-medium items-center">

            {categories.length > 0 && (
              <div className="relative" ref={catRef}>
                <button
                  onClick={() => setCatOpen(v => !v)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-bluePrimary transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                  <span className="hidden sm:inline">Categorías</span>
                </button>

                {catOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 min-w-[180px] z-50">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCatOpen(false);
                          document.getElementById(`category-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-bluePrimary hover:bg-blue-50 transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link
              href="/Contacto"
              className="
                relative
                font-semibold
                text-greenDark
                transition-colors
                duration-300
                hover:text-bluePrimary

                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-0
                after:bg-bluePrimary
                after:transition-all
                after:duration-300
                hover:after:w-full
              "
            >
              Contacto
            </Link>

            <CartIcon onClick={onCartOpen} />
          </nav>

        </div>
      </header>

      {flashMessage && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500
            ${flashMessage.type === 'success'
              ? 'bg-greenDark text-white'
              : 'bg-red-600 text-white'}
            px-6 py-3 rounded-lg shadow-lg animate-slideDown`}
        >
          {flashMessage.message}
        </div>
      )}

      <style>
        {`
          @keyframes slideDown {
            0% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
            100% { opacity: 1; transform: translateY(0) translateX(-50%); }
          }
          .animate-slideDown {
            animation: slideDown 0.4s ease-out forwards;
          }
        `}
      </style>
    </>
  );
}
