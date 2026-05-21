import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import CartIcon from '@/Components/welcome/Cart/CartIcon';

const NAV_ORDER = [
  'equipos',
  'armo',
  'producto',
  'accesorio',
  'planta',
];

function sortCategories(cats) {
  const isDestacado = (name) => {
    const n = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return n.includes('destacado');
  };

  const getOrder = (name) => {
    const n = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const idx = NAV_ORDER.findIndex(k => n.includes(k));
    return idx === -1 ? 99 : idx;
  };

  return cats
    .filter(c => !isDestacado(c.name))
    .sort((a, b) => getOrder(a.name) - getOrder(b.name));
}

export default function Header({ auth, onCartOpen }) {
  const { props } = usePage();
  const [flashMessage, setFlashMessage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const rawCategories = props.categories || [];
  const categories = sortCategories(rawCategories);

  useEffect(() => {
    if (props?.flash?.success) {
      setFlashMessage({ type: 'success', message: props.flash.success });
      setTimeout(() => setFlashMessage(null), 2000);
    } else if (props?.flash?.error) {
      setFlashMessage({ type: 'error', message: props.flash.error });
      setTimeout(() => setFlashMessage(null), 3000);
    }
  }, [props]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(`category-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <>
      <header className="w-full bg-white text-gray-800 shadow-sm border-b border-blueLight sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="https://res.cloudinary.com/dnbklbswg/image/upload/v1779339112/LogoColorHorizontal_efbozz.png"
              alt="Aqua Health"
              className="h-10 md:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                className="relative text-sm lg:text-base font-semibold uppercase tracking-wide text-gray-700 hover:text-bluePrimary transition-colors duration-200
                  after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-bluePrimary after:transition-all after:duration-300 hover:after:w-full"
              >
                {cat.name}
              </button>
            ))}

            <Link
              href="/Contacto"
              className="relative text-sm lg:text-base font-semibold uppercase tracking-wide text-greenDark hover:text-bluePrimary transition-colors duration-200
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-bluePrimary after:transition-all after:duration-300 hover:after:w-full"
            >
              Contacto
            </Link>

            <CartIcon onClick={onCartOpen} />
          </nav>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-3">
            <CartIcon onClick={onCartOpen} />

            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Abrir menú"
              className="flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
            >
              <span className={`block h-[2px] w-6 bg-gray-700 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-[2px] w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] w-6 bg-gray-700 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>

        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                className="text-left text-base font-semibold uppercase tracking-wide text-gray-700 hover:text-bluePrimary py-3 border-b border-gray-100 transition-colors duration-200"
              >
                {cat.name}
              </button>
            ))}
            <Link
              href="/Contacto"
              onClick={() => setMenuOpen(false)}
              className="text-base font-semibold uppercase tracking-wide text-greenDark hover:text-bluePrimary py-3 transition-colors duration-200"
            >
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      {flashMessage && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500
            ${flashMessage.type === 'success' ? 'bg-greenDark text-white' : 'bg-red-600 text-white'}
            px-6 py-3 rounded-lg shadow-lg animate-slideDown`}
        >
          {flashMessage.message}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
          100% { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        .animate-slideDown { animation: slideDown 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}
