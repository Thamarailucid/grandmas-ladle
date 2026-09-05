import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { CategoryCard } from '@/components/common/CategoryCard';
import { CustomerReviewsSection } from '@/components/common/CustomerReviewsSection';
import { createWhatsAppUrl } from '@/lib/whatsapp';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';
import { HeroSlider } from '@/components/common/HeroSlider';

import traditionalSnacksImg from '@/assets/traditional_snacks.jpg';
import ladoosImg from '@/assets/ladoos.jpg';
import sundalImg from '@/assets/sundal.jpg';
import modakamImg from '@/assets/modakam.jpg';
import milletFoodsImg from '@/assets/millet_foods.jpg';
import festivalOrdersImg from '@/assets/festival_orders.jpg';
import silverGlassImg from '@/assets/silver_glass.jpg';

export default function HomePage() {
  const { whatsapp } = useBusinessSettingsContext();
  const whatsappUrl = createWhatsAppUrl('Hello! I would like to place an order from Grandma\'s Ladle.');

  return (
    <>
      <Helmet>
        <title>Grandma's Ladle | Traditional Homemade Snacks & Sweets, Bengaluru</title>
        <meta 
          name="description" 
          content="Traditional South Indian snacks, ladoos, sundal & festive sweets made the way grandma did. Order online or visit our New Thippasandra kitchen." 
        />
      </Helmet>

      <HeroSlider />

      {/* 2. Intro — Two Grandmothers Section */}
      <SectionContainer bgColor="cream">
        <SectionHeading 
          title="TWO GRANDMOTHERS. ONE LEGACY."
          centered 
        />
        <div className="max-w-3xl mx-auto text-center font-inter space-y-6 text-brand-dark-brown/90 text-lg leading-relaxed mb-10">
          <p>
            Grandma's Ladle was inspired by two women who built their lives with their hands — making, cooking, stitching, creating and selling whatever they could to make life a little better.
          </p>
          <p>
            Their recipes, their resilience and their love for feeding people live on in what we make today.
          </p>
        </div>
        <div className="flex justify-center">
          <BrandButton variant="secondary" to="/our-story">DISCOVER OUR STORY</BrandButton>
        </div>
      </SectionContainer>

      {/* 3. Silver Glass Section */}
      <SectionContainer bgColor="green">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex justify-center">
            <img 
              src={silverGlassImg} 
              alt="Vintage silver glass" 
              className="w-full max-w-sm aspect-[4/5] object-cover rounded-lg shadow-xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-brand-cream">
              IT STARTED WITH A SILVER GLASS.
            </h2>
            <p className="font-playfair text-2xl italic text-brand-antique-brass">
              A small glass. A lifetime of hard work. And a dream that travelled from one generation to another.
            </p>
            <p className="font-inter text-brand-cream/90 text-lg leading-relaxed">
              My grandmother once earned a silver glass with money she made herself by making and selling jasmine flowers. Every time I see that glass, I remember her determination, dignity and belief in honest work.
            </p>
            <div>
              <BrandButton variant="outline" to="/our-story" className="text-brand-cream border-brand-cream hover:bg-brand-cream hover:text-brand-green">
                READ THE FULL STORY
              </BrandButton>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* 4. Food Categories Section */}
      <SectionContainer bgColor="white">
        <SectionHeading 
          title="FROM GRANDMA'S KITCHEN"
          centered 
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          <CategoryCard 
            title="Traditional Snacks"
            imageUrl={traditionalSnacksImg}
            linkTo="/menu?category=traditional-snacks"
          />
          <CategoryCard 
            title="Ladoos & Sweet Bites"
            imageUrl={ladoosImg}
            linkTo="/menu?category=ladoos-sweet-bites"
          />
          <CategoryCard 
            title="Sundal"
            imageUrl={sundalImg}
            linkTo="/menu?category=traditional-wholesome"
          />
          <CategoryCard 
            title="Modakam & Seasonal Specials"
            imageUrl={modakamImg}
            linkTo="/menu?category=festival-seasonal"
          />
          <CategoryCard 
            title="Ragi & Millet Foods"
            imageUrl={milletFoodsImg}
            linkTo="/menu?category=traditional-wholesome"
          />
          <CategoryCard 
            title="Festival & Bulk Orders"
            imageUrl={festivalOrdersImg}
            linkTo="/festivals"
          />
        </div>
      </SectionContainer>

      {/* 5. Why Grandma's Ladle Section */}
      <SectionContainer bgColor="cream">
        <SectionHeading 
          title="NOT JUST FOOD. A PIECE OF HOME."
          centered 
        />
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto mt-12">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Traditional</h3>
            <p className="font-inter text-brand-dark-brown/70">Inspired by recipes and food traditions passed down through generations.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Homemade</h3>
            <p className="font-inter text-brand-dark-brown/70">Prepared with the care and attention associated with a grandmother's kitchen.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M12 2v20"/><path d="m15 13-3 3"/><path d="m9 13 3 3"/><path d="m15 9-3 3"/><path d="m9 9 3 3"/><path d="m15 5-3 3"/><path d="m9 5 3 3"/></svg>
              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Wholesome</h3>
            <p className="font-inter text-brand-dark-brown/70">Simple, familiar ingredients and thoughtfully prepared food.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.1-1.9-2.2-3.5a1 1 0 0 1 1-1h3.7z"/><path d="M14.1 7.4c-.9 1.1-1.3 2.6-1.8 4.1 2.2.1 4 .1 5.4-.7 1.2-.8 2.1-2.1 2.2-3.7a1 1 0 0 0-1-1h-4.8z"/></svg>
              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Fresh</h3>
            <p className="font-inter text-brand-dark-brown/70">Made in batches with freshness in mind.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-brand-cream/50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2C4A3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-brand-green"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <h3 className="font-playfair text-xl font-bold text-brand-dark-brown mb-3">Made with love</h3>
            <p className="font-inter text-brand-dark-brown/70">Because feeding someone has always been one of the simplest ways to show care.</p>
          </div>
        </div>
      </SectionContainer>

      {/* 6. Corporate Section */}
      <SectionContainer bgColor="white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <SectionHeading 
            title="TRADITIONAL SNACKS FOR YOUR TEAM"
            centered 
          />
          <p className="font-inter text-brand-dark-brown/90 text-lg leading-relaxed">
            Looking for something wholesome and different for your workplace, meeting, celebration or festive occasion? Grandma's Ladle offers traditional snacks and sweets for corporate and bulk orders.
          </p>
          <div className="pt-4">
            <BrandButton variant="primary" to="/corporate">CORPORATE ENQUIRY</BrandButton>
          </div>
        </div>
      </SectionContainer>

      {/* 7. Seasonal/Festival Section */}
      <SectionContainer bgColor="cream">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-brand-terracotta/5 p-8 md:p-16 rounded-3xl border border-brand-terracotta/10">
          <SectionHeading 
            title="CELEBRATE THE WAY GRANDMA DID"
            centered 
          />
          <p className="font-inter text-brand-dark-brown/90 text-lg leading-relaxed">
            From modakam and murukku to ladoos and sundal, our festive specials bring traditional flavours to celebrations at home and at work.
          </p>
          <div className="pt-4">
            <BrandButton variant="secondary" to="/festivals">VIEW FESTIVE SPECIALS</BrandButton>
          </div>
        </div>
      </SectionContainer>

      {/* 8. Customer Reviews & Testimonials Section */}
      <CustomerReviewsSection />

      {/* 9. Final CTA Section */}
      <SectionContainer bgColor="green">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <SectionHeading 
            title="COME HOME TO SOMETHING TRADITIONAL."
            centered 
            light
          />
          <p className="font-inter text-brand-cream/90 text-lg leading-relaxed">
            Whether you are looking for a familiar snack, a festive treat or something wholesome for your team, there is always a place at Grandma's Ladle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-6">
            <BrandButton variant="primary" href={whatsappUrl}>ORDER NOW</BrandButton>
            <BrandButton variant="secondary" to="/visit-us">VISIT US</BrandButton>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
