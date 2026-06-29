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
  const [activeId, setActiveId] = useState(null);

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

  useEffect(() => {
    if (!categories.length) return;

    const observers = [];
    const visibleSections = new Map();

    categories.forEach(cat => {
      const el = document.getElementById(`category-${cat.id}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visibleSections.set(cat.id, entry.isIntersecting);
          const firstVisible = categories.find(c => visibleSections.get(c.id));
          setActiveId(firstVisible ? firstVisible.id : null);
        },
        { rootMargin: '-88px 0px -40% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [categories]);

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

          <Link href="/" className="flex-shrink-0">
            <img
              src="https://res.cloudinary.com/dnbklbswg/image/upload/v1779339112/LogoColorHorizontal_efbozz.png"
              alt="Aqua Health"
              className="h-10 md:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
            {categories.map(cat => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollTo(cat.id)}
                  className={`relative text-sm lg:text-base font-semibold uppercase tracking-wide transition-colors duration-200
                    after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:transition-all after:duration-300
                    ${isActive
                      ? 'text-bluePrimary after:w-full after:bg-bluePrimary'
                      : 'text-gray-700 hover:text-bluePrimary after:w-0 after:bg-bluePrimary hover:after:w-full'
                    }`}
                >
                  {cat.name}
                </button>
              );
            })}

            <Link
              href="/Contacto"
              className="relative text-sm lg:text-base font-semibold uppercase tracking-wide text-greenDark hover:text-bluePrimary transition-colors duration-200
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-bluePrimary after:transition-all after:duration-300 hover:after:w-full"
            >
              Contacto
            </Link>
          </nav>

          {/* Desktop cart (right) */}
          <div className="hidden md:flex flex-shrink-0 items-center">
            <CartIcon onClick={onCartOpen} />
          </div>


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

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {categories.map(cat => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollTo(cat.id)}
                  className={`text-left text-base font-semibold uppercase tracking-wide py-3 border-b border-gray-100 transition-colors duration-200
                    ${isActive ? 'text-bluePrimary' : 'text-gray-700 hover:text-bluePrimary'}`}
                >
                  {isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-bluePrimary mr-2 mb-0.5 align-middle" />}
                  {cat.name}
                </button>
              );
            })}
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
