import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        {regularCategories.map((category, idx) => {
          const filteredProducts = category.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const hasChildren = category.children?.length > 0;

          const normalized = category.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
          const isArmoQuimica = normalized.includes('armo') && (normalized.includes('quimica') || normalized.includes('química') || normalized.includes('quím'));

          return (
            <div key={category.id} id={`category-${category.id}`} style={{ scrollMarginTop: '88px' }} className="mb-16">
              {idx !== 0 && (
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


              {filteredProducts.length > 0 && (
                <CategorySwiper products={filteredProducts} accent={isArmoQuimica} />
              )}


              {hasChildren &&
                category.children.map(sub => {
                  const filteredSubProducts = sub.products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                  );

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
            </div>
          );
        })}


        <div ref={sentinelRef} className="h-4" />
        {loading && (
          <p className="text-center text-bluePrimary py-6 font-semibold">Cargando…</p>
        )}
      </section>
      </div>
    </div>
  );
}

function HeroSlider({ products, categories = [] }) {
  const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  const scrollToCategory = (description) => {
    const target = normalize(description);
    if (!target) return;

    const match = categories.find(cat => normalize(cat.name).includes(target) || target.includes(normalize(cat.name)));
    if (!match) return;

    const el = document.getElementById(`category-${match.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative w-full bg-gray-50" style={{ minHeight: '320px' }}>
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={true}
        speed={800}
        slidesPerView={1}
        className="w-full"
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next',
        }}
      >
        {products.map((product) => {
          const imageUrl = product.multimedia?.[0]?.url || 'https://via.placeholder.com/1600x900';
          const hasTarget = !!product.description;

          return (
            <SwiperSlide key={product.id}>
              {hasTarget ? (
                <button
                  onClick={() => scrollToCategory(product.description)}
                  className="block w-full cursor-pointer"
                >
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-auto block"
                    style={{ maxHeight: '90vh', objectFit: 'contain', margin: '0 auto' }}
                  />
                </button>
              ) : (
                <div className="block w-full">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-auto block"
                    style={{ maxHeight: '90vh', objectFit: 'contain', margin: '0 auto' }}
                  />
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      <button className="hero-prev absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-12 sm:w-11 sm:h-14 bg-white/80 backdrop-blur shadow-lg border border-gray-200 hover:bg-white transition rounded-sm">
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
      </button>
      <button className="hero-next absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-12 sm:w-11 sm:h-14 bg-white/80 backdrop-blur shadow-lg border border-gray-200 hover:bg-white transition rounded-sm">
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
      </button>
    </div>
  );
}

function CategorySwiper({ products, accent = false }) {
  if (!products?.length) return null;

  const isDesktopCarousel = products.length > 2;

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const borderGradient = accent
    ? 'linear-gradient(to bottom, #99f6e4, #2DD4BF, #0f766e) 1'
    : 'linear-gradient(to bottom, #bae6fd, #38bdf8, #1e40af) 1';

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return isDesktopCarousel ? (
    <div className="relative py-6">
      <Swiper
        className="z-[1]"
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={3}
        slidesPerGroup={3}
        speed={500}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          640: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
        }}
      >
        {products.map((product) => {
          const outOfStock =
            product.variants?.length > 0 &&
            product.variants.reduce((sum, v) => sum + v.stock, 0) === 0;

          return (
            <SwiperSlide
              key={product.id}
              className={`
                w-full h-full relative overflow-hidden rounded-3xl shadow-lg bg-white flex justify-center
                border-4
                ${outOfStock ? 'opacity-80' : ''}
              `}
              style={{
                borderImage: borderGradient,
                borderStyle: 'solid',
              }}
            >
              <ProductCard product={product} isInSwiper={true} accent={accent} />
            </SwiperSlide>
          );
        })}
      </Swiper>


      <button
        ref={prevRef}
        className="
              absolute top-1/2 -left-6 md:-left-12
              -translate-y-1/2
              z-20
              flex items-center justify-center
              w-10 h-14
              bg-white/80 backdrop-blur
              shadow-lg
              border border-gray-200
              hover:bg-white
              transition
            "
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>


      <button
        ref={nextRef}
        className="
                absolute top-1/2 -right-6 md:-right-12
                -translate-y-1/2
                z-20
                flex items-center justify-center
                w-10 h-14
                bg-white/80 backdrop-blur
                shadow-lg
                border border-gray-200
                hover:bg-white
                transition
              "
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-3xl border-4 overflow-hidden shadow-lg"
          style={{
            borderImage: accent
              ? 'linear-gradient(to bottom, #99f6e4, #2DD4BF, #0f766e) 1'
              : 'linear-gradient(to bottom, #bae6fd, #38bdf8, #1e40af) 1',
            borderStyle: 'solid',
          }}
        >
          <ProductCard product={product} accent={accent} />
        </div>
      ))}
    </div>
  );
}