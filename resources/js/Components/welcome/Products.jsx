import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <section className="bg-white p-4 text-gray-800">
        {categories.map((category, idx) => {
          const filteredProducts = category.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const hasChildren = category.children?.length > 0;

          return (
            <div key={category.id} className="mb-16">
              {idx !== 0 && (
                <hr className="border-blueLight my-14" />
              )}


              <div className="relative mb-6">
                <h2
                  className="
                    text-4xl
                    md:text-5xl
                    font-bold
                    tracking-wide
                    uppercase
                    pl-4
                    py-2
                    border-l-[6px]
                    border-bluePrimary
                    text-bluePrimary
                  "
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
                <CategorySwiper products={filteredProducts} />
              )}


              {hasChildren &&
                category.children.map(sub => {
                  const filteredSubProducts = sub.products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                  );

                  return (
                    <div key={sub.id} className="mt-14">
                      <h3
                        className="
                          text-2xl
                          md:text-3xl
                          font-semibold
                          tracking-wide
                          pl-3
                          border-l-4
                          border-blueSecondary
                          text-gray-700
                          mb-10
                        "
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {sub.name}
                      </h3>

                      {filteredSubProducts.length > 0 && (
                        <CategorySwiper products={filteredSubProducts} />
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}


        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleVerMasCategorias}
              disabled={loading}
              className="
                px-8
                py-3
                rounded-xl
                border
                border-bluePrimary
                text-bluePrimary
                font-semibold
                hover:bg-bluePrimary
                hover:text-white
                transition
                disabled:opacity-50
              "
            >
              {loading ? 'Cargando…' : 'Ver más categorías'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function CategorySwiper({ products }) {
  if (!products?.length) return null;

  const isDesktopCarousel = products.length > 3;

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      // Asignar refs de navegación después del montaje
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
            product.variants?.reduce((sum, v) => sum + v.stock, 0) === 0;

          return (
            <SwiperSlide
              key={product.id}
              className={`
                w-full h-full relative overflow-hidden rounded-3xl shadow-lg bg-white flex justify-center
                border-4
                ${outOfStock ? 'border-blueSecondary opacity-80' : 'border-blueLight'}
              `}
              style={{
                fontFamily: "'Playfair Display', serif",
                borderImage:
                  'linear-gradient(to bottom, #bae6fd, #38bdf8, #1e40af) 1',
                borderStyle: 'solid',
              }}
            >
              <ProductCard product={product} isInSwiper={true} />
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
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}