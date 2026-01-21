import { Head } from '@inertiajs/react';
import Header from '@/Components/welcome/Header';
import Footer from '@/Components/welcome/Footer';
import { CartProvider } from '@/Contexts/CartContext';
import { useState } from 'react';
import CartIcon from '@/Components/welcome/Cart/CartIcon';
import CartModal from '@/Components/welcome/Cart/CartModal';

export default function Layout({ title, auth, children }) {
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <Head title={title || "Aqua Health "} />

      <div className="min-h-screen flex flex-col bg-white text-darkGray relative">
        <Header auth={auth} />

        <main className="flex-1 container mx-auto px-6 py-10">
          {children}
        </main>

        <Footer />

        
        <div className="fixed bottom-24 right-6 z-[9000]">
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

       
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setCartOpen(false)}
        />

        <a
          href="https://wa.me/59177427374"
          target="_blank"
          rel="noopener noreferrer"
          className="
            fixed
            bottom-6
            right-6
            w-16
            h-16
            rounded-full
            bg-green-500
            shadow-xl
            flex
            items-center
            justify-center
            hover:bg-green-800
            transition
            z-[8000]
          "
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-9 h-9"
          />
        </a>
      </div>
    </CartProvider>
  );
}
