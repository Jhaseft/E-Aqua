import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategorySwiper({ products, accent = false }) {
  if (!products?.length) return null;

  const isDesktopCarousel = products.length > 2;
  // Solo activamos el bucle/autoplay si hay más productos que los visibles en PC (5)
  const canLoop = products.length > 5;

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
        className="z-[1] !items-stretch"
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={4} 
        slidesPerGroup={1}
        speed={600}
        loop={canLoop}
        autoplay={canLoop ? {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 5, spaceBetween: 24 },
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
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
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
