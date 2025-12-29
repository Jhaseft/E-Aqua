import Layout from "@/Layouts/LayoutCheckout";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Contacto() {
    return (
        <Layout>
            <div
                className="bg-white text-center py-10 mt-10 border-t border-blueLight shadow-inner rounded-2xl"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}
            >
               
                <h2 className="text-greenDark text-3xl font-bold mb-6">Contacto</h2>

                
                <div className="text-greenDark text-lg mb-6 space-y-2">
                    <p> WhatsApp: <span className="text-bluePrimary font-semibold">+56 978843627</span></p>
                </div>

             
                <div className="flex justify-center space-x-10 mb-6">
                    <a 
                        href="https://www.instagram.com/maro_uniformes_?igsh=MTZwcm02bzdmMnl5ZA==" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-bluePrimary hover:text-blueSecondary transition-colors"
                    >
                        <FaInstagram size={50} />
                    </a>
                    <a 
                        href="https://wa.me/56978843627" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-bluePrimary hover:text-blueSecondary transition-colors"
                    >
                        <FaWhatsapp size={50} />
                    </a>
                </div>
            </div>
        </Layout>
    ); 
}
