import { useState, useRef, useEffect } from 'react';
import HeroSlider from './HeroSlider';
import CategorySwiper from './CategorySwiper';
import ChemicalBranches from './ChemicalBranches';

export default function Products({
  categories: initialCategories = [],
  search: initialSearch = '',
  page: initialPage = 1,
  hasMore: initialHasMore = false,
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [searchTerm] = useState(initialSearch);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          handleVerMasCategorias();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleVerMasCategorias = async () => {
    try {
      setLoading(true);
      const token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');

      const nextOffset = categories.length;
      const params = new URLSearchParams({ offset: nextOffset });

      const response = await fetch(`/ventas/json?${params.toString()}`, {
        headers: { 'X-CSRF-TOKEN': token },
      });

      const data = await response.json();

      if (data.categories?.length) {
        setCategories(prev => [...prev, ...data.categories]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const NAV_ORDER = ['equipos', 'armo', 'producto', 'accesorio', 'planta'];

  const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const isDestacado = (name) => normalize(name).includes('destacado');

  const getOrder = (name) => {
    const n = normalize(name);
    const idx = NAV_ORDER.findIndex(k => n.includes(k));
    return idx === -1 ? 99 : idx;
  };

  const featuredCategory = categories.find(c => isDestacado(c.name));
  const regularCategories = categories
    .filter(c => !isDestacado(c.name))
    .sort((a, b) => getOrder(a.name) - getOrder(b.name));

  const featuredProducts = featuredCategory
    ? [
        ...featuredCategory.products,
        ...(featuredCategory.children?.flatMap(ch => ch.products) ?? []),
      ].filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div>
      {featuredProducts.length > 0 && (
        <HeroSlider products={featuredProducts} categories={regularCategories} />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <section className="bg-white text-gray-800">
        {regularCategories.map((category, idx) => (
          <CategorySection
            key={category.id}
            category={category}
            isFirst={idx === 0}
            searchTerm={searchTerm}
          />
        ))}


        <div ref={sentinelRef} className="h-4" />
        {loading && (
          <p className="text-center text-bluePrimary py-6 font-semibold">Cargando…</p>
        )}
      </section>
      </div>
    </div>
  );
}

function CategorySection({ category, isFirst, searchTerm }) {
  const matchesSearch = (product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase());

  const filteredProducts = category.products.filter(matchesSearch);
  const hasChildren = category.children?.length > 0;

  const normalized = category.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const isArmoQuimica = normalized.includes('armo') && (normalized.includes('quimica') || normalized.includes('química') || normalized.includes('quím'));
  // Línea de "Productos Químicos": se muestra como carátulas por rama (QB/QT/QC/QO/QW)
  const isProductosQuimicos = normalized.includes('producto') && normalized.includes('quimic');

  return (
    <div id={`category-${category.id}`} style={{ scrollMarginTop: '88px' }} className="mb-16">
      {!isFirst && (
        <hr className="border-blueLight my-14" />
      )}

      <div className="relative mb-6">
        <h2
          className={`
            text-4xl
            md:text-5xl
            font-bold
            tracking-wide
            uppercase
            pl-4
            py-2
            border-l-[6px]
            ${isArmoQuimica ? 'border-aquamarine text-aquamarine' : 'border-bluePrimary text-bluePrimary'}
          `}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {category.name}
        </h2>

        {category.description && (
          <p className="text-gray-500 mt-2 italic pl-4">
            {category.description}
          </p>
        )}
      </div>

      {isProductosQuimicos ? (
        <ChemicalBranches products={filteredProducts} />
      ) : (
        <>
          {filteredProducts.length > 0 && (
            <CategorySwiper products={filteredProducts} accent={isArmoQuimica} />
          )}

          {hasChildren &&
            category.children.map(sub => {
              const filteredSubProducts = sub.products.filter(matchesSearch);

              return (
                <div key={sub.id} className="mt-14">
                  <h3
                    className={`
                      text-2xl
                      md:text-3xl
                      font-semibold
                      tracking-wide
                      pl-3
                      border-l-4
                      mb-10
                      ${isArmoQuimica ? 'border-aquamarine text-aquamarine' : 'border-blueSecondary text-gray-700'}
                    `}
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {sub.name}
                  </h3>

                  {filteredSubProducts.length > 0 && (
                    <CategorySwiper products={filteredSubProducts} accent={isArmoQuimica} />
                  )}
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}
