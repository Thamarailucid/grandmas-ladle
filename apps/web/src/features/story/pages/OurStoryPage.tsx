import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';

export default function OurStoryPage() {
  return (
    <>
      <Helmet>
        <title>Our Story | Grandma's Ladle — Two Grandmothers, One Legacy</title>
        <meta name="description" content="The story behind Grandma's Ladle — two grandmothers, a silver glass, and a family recipe for traditional Indian snacks and sweets." />
      </Helmet>

      {/* Page Header */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#FAF4E6] text-center px-4">
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-[#3E2C22] font-bold mb-6">
          THE STORY BEHIND GRANDMA'S LADLE
        </h1>
        <p className="font-playfair text-xl md:text-2xl text-[#B85C3E] italic max-w-3xl mx-auto">
          A story of two grandmothers, a thousand little efforts, and one silver glass.
        </p>
      </section>

      {/* Section 1: Introduction */}
      <SectionContainer bgColor="cream" className="py-16 md:py-24 text-lg md:text-xl font-inter text-[#3E2C22] leading-relaxed space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <p>
            Behind Grandma's Ladle is not just a business story. It is a family story.
          </p>
          <p>
            It began with two grandmothers who may not have had the opportunity for a formal education, but who taught us some of life's most valuable lessons — hard work, dignity, self-reliance, creativity and the joy of feeding others.
          </p>
          <p>
            Throughout their lives, they found ways to earn and contribute, often from their own homes and with whatever skills they had in their hands.
          </p>
          <p>
            They made and sold papad, jasmine flowers, crochet work, stitched clothes, soft toys, murukku, ladoos, sweets and many other homemade creations.
          </p>
          
          <div className="flex flex-col gap-3 mt-10 text-xl md:text-2xl font-medium text-[#B85C3E] italic font-playfair">
            <p>There was no big shop.</p>
            <p>No big investment.</p>
            <p>No fancy equipment.</p>
            <p>Just two hands, a willing heart and the determination to make life a little better.</p>
            <p>Every small earning mattered.</p>
          </div>
        </div>
      </SectionContainer>

      {/* Section 2: The Silver Glass */}
      <SectionContainer bgColor="green" className="py-16 md:py-24 text-lg md:text-xl font-inter text-[#FAF4E6] leading-relaxed space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SectionHeading title="The Silver Glass" light centered />
          
          <p className="mt-10">
            There is one memory that stayed with me more than all the others.
          </p>
          <p>
            Even when my grandmother was around 85 years old, she would still make jasmine flower garlands and give them to a local vendor to sell.
          </p>
          <p>
            One day, with the money she had earned from those flowers, she bought me a silver glass.
          </p>
          
          <blockquote className="my-14 text-center text-2xl md:text-3xl lg:text-4xl font-playfair italic font-medium text-[#B8925A] px-4 py-8 border-y border-[#B8925A]/30">
            "I earned this by myself. Keep it safely."
          </blockquote>
          
          <p>
            For her, it may have been a simple silver glass. For me, it became something much more.
          </p>
          <p>
            It became a reminder that there is dignity in every honest earning, no matter how small.
          </p>
          <p>
            Every day, when I see that glass, I think about her. I think about the jasmine flowers she patiently made. I think about all the little things she created and sold. And I think about how she never believed that any honest work was too small.
          </p>
          
          <p className="font-playfair font-semibold text-2xl md:text-3xl text-[#B8925A] mt-10 pt-6">
            That silver glass became the inspiration for Grandma's Ladle.
          </p>
        </div>
      </SectionContainer>

      {/* Section 3: From Their Hands to Our Kitchen */}
      <SectionContainer bgColor="cream" className="py-16 md:py-24 text-lg md:text-xl font-inter text-[#3E2C22] leading-relaxed space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SectionHeading title="From Their Hands to Our Kitchen" centered />
          
          <p className="mt-10">
            Grandma's Ladle is our way of carrying that spirit forward.
          </p>
          <p>
            The food we make is inspired by the kind of food that belongs in a grandmother's kitchen — simple, nourishing, traditional and made with care.
          </p>
          <p>
            Our menu brings together the foods and flavours we grew up loving: sundal, traditional snacks, ladoos, murukku, modakam, ragi-based drinks and other wholesome homemade favourites.
          </p>
          <p>
            We do not want food to be just something you buy and eat. We want it to bring back a feeling.
          </p>
          <p className="font-medium text-[#B85C3E]">
            The feeling of coming home. The smell of something cooking in the kitchen. The sound of a ladle stirring a hot pot. A grandmother asking, "Have you eaten?" And the quiet love that goes into making something for someone else.
          </p>
        </div>
      </SectionContainer>

      {/* Section 4: Why "Grandma's Ladle"? */}
      <SectionContainer bgColor="white" className="py-16 md:py-24 text-lg md:text-xl font-inter text-[#3E2C22] leading-relaxed space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SectionHeading title='Why "Grandma&#39;s Ladle"?' centered />
          
          <p className="mt-10">
            A ladle is a simple thing. But in a grandmother's kitchen, it can mean so much.
          </p>
          
          <div className="flex flex-col gap-3 my-10 pl-6 border-l-4 border-[#B8925A] font-playfair italic text-[#B85C3E] text-xl md:text-2xl">
            <p>It stirs the soup.</p>
            <p>It serves the sundal.</p>
            <p>It mixes the ladoos.</p>
            <p>It carries food from the pot to the plate.</p>
            <p>It is part of the everyday work of feeding a family.</p>
          </div>
          
          <p>
            Our ladle represents those countless moments of love, care and nourishment that happen in kitchens every day.
          </p>
          <p>
            And "Grandma" represents not just our grandmothers, but the countless women who have kept traditions alive through their hands, their recipes and their hard work.
          </p>
        </div>
      </SectionContainer>

      {/* Section 5: More Than Food */}
      <SectionContainer bgColor="green" className="py-16 md:py-24 text-lg md:text-xl font-inter text-[#FAF4E6] leading-relaxed space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SectionHeading title="More Than Food" light centered />
          
          <p className="mt-10">
            Grandma's Ladle is our small tribute to women who built something with whatever they had.
          </p>
          
          <div className="flex flex-col gap-3 my-10 font-medium text-lg md:text-xl">
            <p className="flex items-center gap-3"><span className="w-8 h-[1px] bg-[#B8925A] inline-block"></span> Women who stitched.</p>
            <p className="flex items-center gap-3"><span className="w-8 h-[1px] bg-[#B8925A] inline-block"></span> Women who cooked.</p>
            <p className="flex items-center gap-3"><span className="w-8 h-[1px] bg-[#B8925A] inline-block"></span> Women who made flowers.</p>
            <p className="flex items-center gap-3"><span className="w-8 h-[1px] bg-[#B8925A] inline-block"></span> Women who made snacks.</p>
            <p className="flex items-center gap-3"><span className="w-8 h-[1px] bg-[#B8925A] inline-block"></span> Women who sold things from their homes.</p>
            <p className="flex items-center gap-3"><span className="w-8 h-[1px] bg-[#B8925A] inline-block"></span> Women who worked quietly to support their families.</p>
          </div>
          
          <p>
            Their stories may never have appeared in books. But they built families, preserved traditions and passed down skills that are worth remembering.
          </p>
          <p>
            Our grandmothers taught us that you do not need a big beginning to build something meaningful.
          </p>
          <p className="font-playfair font-semibold text-2xl md:text-3xl text-[#B8925A] mt-8 pt-4">
            You simply need to begin.
          </p>
        </div>
      </SectionContainer>

      {/* Section 6: Final Closure */}
      <SectionContainer bgColor="cream" className="py-16 md:py-24 text-lg md:text-xl font-inter text-[#3E2C22] leading-relaxed space-y-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="From Our Grandmothers' Hands to Your Table" centered />
          
          <div className="space-y-6 mt-10">
            <p>
              Today, every ladle we serve carries a little piece of their story.
            </p>
            <p>
              Every ladoo reminds us of their hands. Every traditional recipe reminds us of where we came from.
            </p>
            <p>
              And that silver glass still sits safely with us — a small object carrying a very big lesson.
            </p>
            
            <p className="font-playfair text-2xl md:text-3xl font-semibold text-[#B85C3E] my-10 py-6 border-y border-[#B8925A]/20 text-center">
              Grandma's Ladle is our way of saying thank you.
            </p>
            
            <p>
              Thank you to our grandmothers. Thank you for showing us the value of honest work. Thank you for teaching us that homemade food is more than ingredients.
            </p>
            <p>
              And thank you for showing us that love, when put into your hands, can become something that feeds others.
            </p>
          </div>
          
          {/* Footer tagline */}
          <div className="mt-20 pt-16 border-t border-[#3E2C22]/10 flex flex-col items-center text-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-widest text-[#2C4A3B] mb-4">
              GRANDMA'S LADLE
            </h2>
            <p className="font-playfair italic text-xl md:text-2xl text-[#B85C3E] mb-10">
              Traditional goodness, from our kitchen to yours.
            </p>
            <BrandButton variant="primary" to="/menu">
              EXPLORE OUR MENU
            </BrandButton>
          </div>
        </div>
      </SectionContainer>
    </>
  );
};
