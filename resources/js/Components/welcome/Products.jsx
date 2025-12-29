import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

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

/* ------------------ SWIPER ------------------ */

function CategorySwiper({ products }) {
  if (!products?.length) return null;

  const isDesktopCarousel = products.length > 3;

  return isDesktopCarousel ? (
    <Swiper
      className="z-[1] py-6"
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={24}
      slidesPerView={1}
      navigation
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      style={{
        '--swiper-navigation-color': '#0784c5',
        '--swiper-pagination-color': '#0784c5',
      }}
    >
      {products.map(product => {
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
              borderImage: "linear-gradient(to bottom, #bae6fd, #38bdf8, #1e40af) 1",
              borderStyle: "solid"
            }}
          >
            <ProductCard product={product} isInSwiper={true} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
