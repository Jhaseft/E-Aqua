import { useState } from 'react';
import CategorySwiper from './CategorySwiper';

/* ────────────────────────────────────────────────────────────────
   CARÁTULAS DE PRODUCTOS QUÍMICOS
   Cada rama (QB/QT/QC/QO/QW) se muestra como una sola "carátula".
   Al hacer clic se despliegan los productos actuales de esa rama.

   👉 PEGA AQUÍ LAS 5 URLs de las imágenes (Cloudinary o Drive público)
      en el campo `img` de cada rama. Si lo dejas vacío usa un placeholder.
   ──────────────────────────────────────────────────────────────── */
const BRANCHES = [
  { key: 'QB', label: 'Q-BOILER', subtitle: 'Generación de vapor · Calderos', img: 'https://res.cloudinary.com/dnbklbswg/image/upload/v1782750364/QboilerMiniatura_1_np8qta.png', border: 'border-red-500',    text: 'text-red-600',    badge: 'bg-red-600' },
  { key: 'QT', label: 'Q-TOWER',  subtitle: 'Torres de enfriamiento',          img: 'https://res.cloudinary.com/dnbklbswg/image/upload/v1782750363/QTowerMiniatura_gjmw6c.png', border: 'border-blue-600',   text: 'text-blue-700',   badge: 'bg-blue-600' },
  { key: 'QC', label: 'Q-CLEAN',  subtitle: 'Limpieza Industrial',             img: 'https://res.cloudinary.com/dnbklbswg/image/upload/v1782750365/QcleanMiniatura_w19wkm.png', border: 'border-cyan-400',   text: 'text-cyan-600',   badge: 'bg-cyan-500' },
  { key: 'QO', label: 'Q-OSMO',   subtitle: 'Ósmosis inversa',                 img: 'https://res.cloudinary.com/dnbklbswg/image/upload/v1782750363/QOsmoMiniatura_qoxdx6.png', border: 'border-green-600',  text: 'text-green-700',  badge: 'bg-green-600' },
  { key: 'QW', label: 'Q-WASTE',  subtitle: 'Aguas Residuales',                img: 'https://res.cloudinary.com/dnbklbswg/image/upload/v1782750364/QWasteMiniatura_wdtxjw.png', border: 'border-orange-500', text: 'text-orange-600', badge: 'bg-orange-500' },
];

// Detecta a qué rama pertenece un producto a partir de su nombre.
function getBranchKey(name = '') {
  const n = name.toUpperCase();
  const code = n.match(/Q\s*([BTCOW])\s*-?\s*\d/); // ej: "QB-1201"
  if (code) return 'Q' + code[1];
  if (n.includes('BOILER')) return 'QB';
  if (n.includes('TOWER')) return 'QT';
  if (n.includes('CLEAN')) return 'QC';
  if (n.includes('OSMO')) return 'QO';
  if (n.includes('WASTE')) return 'QW';
  return null;
}

export default function ChemicalBranches({ products = [] }) {
  const [open, setOpen] = useState(null);

  const grouped = {};
  const others = [];
  products.forEach(p => {
    const key = getBranchKey(p.name);
    if (key) (grouped[key] ??= []).push(p);
    else others.push(p);
  });

  const visible = BRANCHES.filter(b => grouped[b.key]?.length);
  const active = visible.find(b => b.key === open);

  if (!visible.length) {
    // Sin códigos reconocibles: cae al render normal
    return <CategorySwiper products={products} />;
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {visible.map(b => {
          const isOpen = open === b.key;
          const cover = b.img || `https://via.placeholder.com/600x600?text=${encodeURIComponent(b.label)}`;
          return (
            <button
              key={b.key}
              type="button"
              onClick={() => setOpen(isOpen ? null : b.key)}
              aria-expanded={isOpen}
              className={`
                group relative flex flex-col overflow-hidden rounded-3xl bg-white text-left
                border-4 ${b.border} shadow-lg transition-all duration-300
                hover:shadow-xl hover:-translate-y-1
                ${isOpen ? 'ring-4 ring-offset-2 ring-gray-200' : ''}
              `}
            >
              <div className="w-full aspect-[4/3] p-4 bg-white overflow-hidden flex-shrink-0">
                <img
                  src={cover}
                  alt={b.label}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 pt-3">
                <h3 className={`text-lg font-extrabold tracking-wide ${b.text}`}>{b.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{b.subtitle}</p>
                <span className={`inline-block mt-2 px-2.5 py-0.5 text-[11px] font-semibold rounded-full text-white ${b.badge}`}>
                  {grouped[b.key].length} producto{grouped[b.key].length !== 1 ? 's' : ''}
                </span>
              </div>
              <span className="absolute top-3 right-3 text-xs font-bold text-gray-400 group-hover:text-gray-600">
                {isOpen ? '▲' : '▼'}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="mt-10 animate-[fadeIn_.3s_ease]">
          <h3 className={`text-2xl md:text-3xl font-semibold tracking-wide pl-3 border-l-4 mb-2 ${active.border} ${active.text}`}
              style={{ fontFamily: "'Playfair Display', serif" }}>
            {active.label}
          </h3>
          <p className="text-sm text-gray-500 italic pl-3 mb-4">{active.subtitle}</p>
          <CategorySwiper products={grouped[active.key]} />
        </div>
      )}

      {others.length > 0 && (
        <div className="mt-10">
          <CategorySwiper products={others} />
        </div>
      )}
    </div>
  );
}
