// Footer.jsx
import {  Linkedin } from "lucide-react"; // LinkedIn de Lucide
import { SiTiktok, SiYoutube, SiFacebook, SiInstagram, SiGmail, SiX } from "@icons-pack/react-simple-icons";
const socialIcons = [
    { Icon: SiTiktok, name: 'TikTok', href: 'https://www.tiktok.com/@aquahealthbolivia?_r=1&_t=ZM-937dYVCpbg4' },
    { Icon: Linkedin, name: 'LinkedIn', href: 'https://www.linkedin.com/company/aqua-health-bolivia/' },
    { Icon: SiGmail, name: 'Email', href: 'mailto:info@aquahealth.com.bo' },
    { Icon: SiFacebook, name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100093996880986' },
    { Icon: SiInstagram, name: 'Instagram', href: 'https://www.instagram.com/aqua_healthbolivia' },
  ];
 
export default function Footer() {
  const ubicaciones = [
    {
      ciudad: "La Paz",
      direccion: "Av. Francisco Bedrega N° 675",
      telefono: null
    },
    {
      ciudad: "Santa Cruz",
      direccion: "c/ Diamante N° 64 Urb. Ucebol",
      telefono: "(+591 - 4) 4334062"
    },
    {
      ciudad: "Quillacollo",
      direccion: "c/ Tres Chorros y Suarez Miranda",
      telefono: "(+591) 68830208"
    },
    {
      ciudad: "Cochabamba",
      direccion: "Av.Blanco Galindo Km1, SUPERMALL piso 1 OF.43",
      telefono: "+591 77427374"
    }
  ];

const BASE_URL = "https://www.aquahealth.com.bo";

const enlaces = [
  { label: "Inicio", href: `${BASE_URL}` },
  { label: "Quienes Somos", href: `${BASE_URL}/quienes-somos` },
  { label: "Equipo Directivo", href: `${BASE_URL}/equipo-directivo` },
  { label: "Nuestra Historia", href: `${BASE_URL}/historia` },
  { label: "Políticas", href: `${BASE_URL}/politicas` },
  { label: "Casos De Éxito", href: `${BASE_URL}/casos-de-exito` },
  { label: "Contacto", href: `${BASE_URL}/contacto` },
];

const lineasNegocio = [
  { label: "INGENIERÍA & CONSULTORÍA", href: `${BASE_URL}/ingenieria-consultoria` },
  { label: "PLANTAS & EQUIPOS", href: `${BASE_URL}/plantas-equipos` },
  { label: "ARMO QUÍMICA", href: `${BASE_URL}/armo-quimica` },
  { label: "PRODUCTOS QUÍMICOS", href: `${BASE_URL}/productos-quimicos` },
  { label: "CAPACITACIÓN & ENTRENAMIENTO", href: `${BASE_URL}/capacitacion-entrenamiento` },
];
  return (
    <footer className="bg-gradient-to-br mt-10 from-blue-950 via-blue-900 to-blue-950 text-white">
      <div className="max-w-7xl mx-auto py-16 px-6 md:px-12">


        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">


          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-blue-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Nuestras Oficinas
            </h3>
            <div className="space-y-5">
              {ubicaciones.map((ubicacion, index) => (
                <div key={index} className="border-l-2 border-blue-400 pl-4 hover:border-blue-300 transition-colors duration-300">
                  <p className="font-semibold text-blue-200 text-sm mb-1">{ubicacion.ciudad}</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{ubicacion.direccion}</p>
                  {ubicacion.telefono && (
                    <p className="text-sm text-blue-300 mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {ubicacion.telefono}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>


          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {enlaces.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-blue-300 transition-all duration-300 inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all duration-300"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Líneas de Negocio
            </h3>
            <ul className="space-y-3">
              {lineasNegocio.map((linea, index) => (
                <li key={index}>
                     <a
                    href={linea.href}
                    className="text-sm text-gray-300 leading-relaxed hover:text-blue-300 transition-colors duration-300 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all duration-300"></span>
                    {linea.label}
                  </a>
                </li>
                
              ))}
            </ul>
          </div>
        </div>


        <div className="border-t border-blue-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <a
              href="https://www.aquahealth.com.bo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors duration-300 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="font-medium">www.aquahealth.com.bo</span>
            </a>

            <div className="flex items-center gap-6">
              <a
                href="mailto:info@aquahealth.com.bo"
                className="flex items-center gap-2 text-gray-300 hover:text-blue-300 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">info@aquahealth.com.bo</span>
              </a>
            </div>

          
            <div className="flex items-center gap-4">
              {socialIcons.map(({ Icon, name, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>


      <div className="bg-blue-950/80 backdrop-blur-sm border-t border-blue-800">
        <div className="max-w-7xl mx-auto py-6 px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} <span className="text-blue-300 font-semibold">AquaHealth</span>. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}