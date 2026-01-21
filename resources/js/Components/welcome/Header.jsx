import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Header({ auth }) {
  const { props } = usePage();
  const [flashMessage, setFlashMessage] = useState(null);

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
    
      <header className="w-full bg-white text-gray-800 shadow-sm py-4 border-b border-blueLight">
        <div className="container mx-auto flex justify-between items-center px-6">

          
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dnbklbswg/image/upload/v1759791758/Logo_AH_con_HTW_wzxlez.jpg"
              alt="Logo de la tienda"
              className="h-16 w-32 md:h-24 md:w-48 object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          
          <nav className="flex md:text-2xl md:gap-10 text-xl gap-4 font-medium">
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
