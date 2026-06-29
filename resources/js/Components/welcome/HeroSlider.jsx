import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider({ products, categories = [] }) {
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
    <div className="relative w-full">
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
                    className="w-full h-auto max-h-[500px] object-contain block"
                  />
                </button>
              ) : (
                <div className="block w-full">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-auto max-h-[500px] object-contain block"
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
