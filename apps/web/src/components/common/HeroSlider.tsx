import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BrandButton } from './BrandButton';
import { apiClient } from '@/lib/apiClient';
import { ApiListResponse, HeroSlide } from '@grandmas-ladle/shared';

import defaultHeroImg from '@/assets/hero_grandmas_ladle.jpg';

const fetchHeroSlides = async (): Promise<HeroSlide[]> => {
  const response = await apiClient.get<ApiListResponse<HeroSlide>>('/HeroSlide/GetPublicHeroSlides');
  return response.data.data;
};

export function HeroSlider() {
  const navigate = useNavigate();
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['heroSlides'],
    queryFn: fetchHeroSlides,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const containerClasses = "relative w-full aspect-[16/9] md:aspect-auto md:h-[calc(100dvh-var(--header-height,80px))] md:min-h-[500px] md:max-h-[920px] overflow-hidden bg-[#1a1612]";

  if (isLoading) {
    return <div className={`${containerClasses} bg-[#F9F6F0] animate-pulse`} />;
  }

  // Fallback if no slides exist
  if (slides.length === 0) {
    return (
      <div className={containerClasses}>
        <img
          src={defaultHeroImg}
          alt="Grandma's Ladle Authentic Spread"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4 sm:px-6">
          <div className="flex flex-col items-center max-w-4xl">
            <h1 className="text-xl sm:text-3xl md:text-6xl font-bold font-serif text-white mb-2 md:mb-6 drop-shadow-lg tracking-wide uppercase">
              GRANDMA'S LADLE
            </h1>
            <p className="hidden sm:block text-xs sm:text-base md:text-xl text-white mb-3 md:mb-8 drop-shadow-md font-medium max-w-2xl font-serif leading-relaxed">
              Traditional goodness, from our kitchen to yours.
            </p>
            <div className="flex gap-2 sm:gap-3 scale-90 sm:scale-100">
              <BrandButton variant="primary" size="sm" to="/menu">ORDER NOW</BrandButton>
              <BrandButton variant="outline" size="sm" to="/our-story" className="text-white border-white hover:bg-white hover:text-brand-green">
                OUR STORY
              </BrandButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {slides.map((s, index) => {
        const isClickableBanner = (Boolean(s.isClickable) || Boolean(s.isImageOnly)) && Boolean(s.ctaLink);
        const isContain = s.imageFit === 'contain';
        const isTop = s.imageFit === 'cover-top';
        const isBottom = s.imageFit === 'cover-bottom';

        const fitClass = isContain
          ? 'object-cover md:object-contain object-center'
          : isTop
          ? 'object-cover object-top'
          : isBottom
          ? 'object-cover object-bottom'
          : 'object-cover object-center';

        const handleSlideClick = (e: React.MouseEvent) => {
          // Prevent double navigation if user clicked directly on a CTA button/link
          if ((e.target as HTMLElement).closest('button, a')) {
            return;
          }
          if (isClickableBanner && s.ctaLink) {
            const target = s.ctaLink.trim();
            // Same-page navigation (strictly no _blank)
            if (target.startsWith('http://') || target.startsWith('https://')) {
              window.location.href = target;
            } else {
              const route = target.startsWith('/') ? target : `/${target}`;
              navigate(route);
            }
          }
        };

        return (
          <div
            key={s.id}
            onClick={handleSlideClick}
            role={isClickableBanner ? 'link' : undefined}
            tabIndex={isClickableBanner ? 0 : undefined}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            } ${isClickableBanner ? 'cursor-pointer select-none group' : ''}`}
          >
            {/* If contain mode on desktop, show an elegant blurred backdrop of the same image */}
            {isContain && (
              <div
                className="hidden md:block absolute inset-0 -z-10 bg-cover bg-center blur-2xl opacity-40 scale-110"
                style={{ backgroundImage: `url(${s.imageUrl})` }}
              />
            )}

            <img
              src={s.imageUrl}
              alt={s.title || 'Hero slide'}
              className={`absolute inset-0 w-full h-full ${fitClass}`}
            />
            {/* Only show dark overlay if it's NOT image only */}
            {!s.isImageOnly && <div className="absolute inset-0 bg-black/40"></div>}

            {!s.isImageOnly && (
              <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4 sm:px-6">
                <div className="flex flex-col items-center max-w-4xl">
                  {s.title && (
                    <h1 className="text-xl sm:text-3xl md:text-6xl font-bold font-serif text-white mb-2 md:mb-6 drop-shadow-lg tracking-wide uppercase">
                      {s.title}
                    </h1>
                  )}
                  {s.subtitle && (
                    <p className="hidden sm:block text-xs sm:text-base md:text-xl text-white mb-3 md:mb-8 drop-shadow-md font-medium max-w-2xl font-serif leading-relaxed">
                      {s.subtitle}
                    </p>
                  )}
                  <div className="flex gap-2 sm:gap-3 scale-90 sm:scale-100">
                    {s.ctaText && s.ctaLink && (
                      <BrandButton variant="primary" size="sm" to={s.ctaLink}>
                        {s.ctaText}
                      </BrandButton>
                    )}
                    {s.secondaryCtaText && s.secondaryCtaLink && (
                      <BrandButton variant="outline" size="sm" to={s.secondaryCtaLink} className="text-white border-white hover:bg-white hover:text-brand-green">
                        {s.secondaryCtaText}
                      </BrandButton>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-6 left-0 right-0 flex justify-center items-center gap-1.5 sm:gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 drop-shadow-sm ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
