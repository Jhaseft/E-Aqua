import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-center py-12 mt-10 border-t border-blueLight">
      
   
      <p className="text-gray-600 font-medium tracking-wide mb-6">
        © {new Date().getFullYear()} AquaHealth — Todos los derechos reservados.
      </p>

     
      <div className="flex justify-center mb-6">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-bluePrimary hover:text-blueSecondary transition-colors"
        >
          <FaInstagram size={34} />
        </a>
      </div>


      <div className="text-gray-600 text-sm space-y-3">
        <p className="text-lg text-greenDark font-semibold">
          +56 9 7884 3627
        </p>

        <p className="text-xs tracking-wide">
          Política de privacidad | Términos de uso
        </p>

        <div className="mt-4 font-medium">
          <p className="text-bluePrimary font-semibold mb-1">
            Bolivia bo
          </p>
          <p>Atención personalizada vía WhatsApp e Instagram</p>
        </div>
      </div>
    </footer>
  );
}
