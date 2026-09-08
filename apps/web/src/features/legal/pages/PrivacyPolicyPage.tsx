import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';
import { formatDisplayPhone } from '@/lib/whatsapp';

export default function PrivacyPolicyPage() {
  const { phone, email, address, fssaiNumber } = useBusinessSettingsContext();
  const displayPhone = formatDisplayPhone(phone || '+91 98412 07516');
  const rawPhone = '919841207516';
  const displayEmail = email || 'namaste@grandmasladle.com';
  const displayAddress = address || 'No. 26/2, 4th Cross, Sawmill Road, New Thippasandra, Bengaluru 560075';
  const displayFssai = fssaiNumber || '21226010006642';

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Grandma's Ladle - Traditional Snacks & Sweets</title>
        <meta 
          name="description" 
          content="Privacy Policy for Grandma's Ladle in New Thippasandra, Bengaluru. Plain and transparent details on how we collect very little, protect your personal information, and respect your choices." 
        />
        <link rel="canonical" href="https://grandmasladle.com/privacy-policy" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Privacy Policy | Grandma's Ladle" />
        <meta property="og:description" content="Privacy Policy for Grandma's Ladle. How we keep your information safe and respect your privacy." />
        <meta property="og:url" content="https://grandmasladle.com/privacy-policy" />
        <meta property="og:site_name" content="Grandma's Ladle" />
        <meta property="og:image" content="https://grandmasladle.com/logo.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy | Grandma's Ladle" />
        <meta name="twitter:description" content="Privacy Policy for Grandma's Ladle traditional sweets and snacks." />
        <meta name="twitter:image" content="https://grandmasladle.com/logo.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy - Grandma's Ladle",
            "url": "https://grandmasladle.com/privacy-policy",
            "description": "Privacy Policy and data protection commitments of Grandma's Ladle.",
            "datePublished": "2026-09-14",
            "dateModified": "2026-09-14",
            "publisher": {
              "@type": "Organization",
              "name": "Grandma's Ladle",
              "url": "https://grandmasladle.com/"
            }
          })}
        </script>
      </Helmet>

      <SectionContainer bgColor="cream" className="py-16 md:py-24">
        <SectionHeading 
          title="PRIVACY POLICY" 
          subtitle="Short, plain, and transparent - because we collect very little."
          centered 
        />

        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#B8925A]/20 font-inter text-[#3E2C22] leading-relaxed space-y-8">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-4">Last updated: 14 September 2026</p>
            <p className="text-base sm:text-lg">
              Grandma's Ladle is a family-run kitchen in New Thippasandra, Bengaluru. We keep this short and plain, because we collect very little.
            </p>
          </div>

          {/* Who we are */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">Who we are</h3>
            <p className="mb-4">
              Grandma's Ladle is a sole proprietorship owned by <strong>Rajambal V</strong>.
            </p>
            <div className="bg-[#FAF4E6] p-5 rounded-xl text-sm sm:text-base space-y-2 border border-[#B8925A]/30">
              <p><strong>Grandma's Ladle</strong></p>
              <p><strong>Proprietor:</strong> Rajambal V</p>
              <p><strong>Address:</strong> {displayAddress}</p>
              <p>
                <strong>WhatsApp / Call:</strong>{' '}
                <a 
                  href={`https://wa.me/${rawPhone}?text=${encodeURIComponent("Hello Grandma's Ladle! I have an enquiry.")}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-green font-semibold hover:underline"
                >
                  {displayPhone}
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${displayEmail}`} className="text-brand-green font-semibold hover:underline">
                  {displayEmail}
                </a>
              </p>
              <p><strong>FSSAI Registration No.:</strong> {displayFssai}</p>
            </div>
          </div>

          {/* We don't sell anything on this website */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">We don't sell anything on this website</h3>
            <p>
              This site tells you about us and what we make. There is no online store, no cart and no payment page. We never ask for or store card numbers, UPI PINs or bank details. Orders are placed on WhatsApp or by phone, and paid for at the shop or on delivery.
            </p>
          </div>

          {/* What we collect */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">What we collect</h3>
            <p className="mb-3">
              When you place an order with us, we note your name, your phone number, your delivery address if you'd like delivery, and what you've ordered. If you write to us by email, we keep your message and your email address. If you fill in the enquiry form on this website, we receive the name, phone number and message you enter. Our website also records basic technical information such as which pages were visited and what kind of device was used.
            </p>
          </div>

          {/* Ordering on WhatsApp */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">Ordering on WhatsApp</h3>
            <p>
              WhatsApp is run by Meta and your messages travel through their service under their own privacy terms. We save your number and your order details on our own phone and records so we can prepare and deliver your order, and so we recognise you next time.
            </p>
          </div>

          {/* Why we use it */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">Why we use it</h3>
            <p className="mb-3">
              To take, make and deliver your order. To reach you about that order. To sort out anything that goes wrong. And to keep the sales records we're required to keep under tax and food safety rules.
            </p>
            <p>
              We'll only send you festival menus, new items or offers if you've told us you'd like them. Reply <strong>STOP</strong> on WhatsApp at any time and we'll take you off the list.
            </p>
          </div>

          {/* Who we share it with */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">Who we share it with</h3>
            <p>
              Nobody, apart from what's needed to get your order to you, such as passing your name and address to the person delivering it. We do not sell, rent or share your details for advertising.
            </p>
          </div>

          {/* How long we keep it */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">How long we keep it</h3>
            <p>
              Order and contact details for about two years, so we know your usual order and any preferences. Sales and billing records for as long as tax rules require. Website records for about a year.
            </p>
          </div>

          {/* Keeping it safe */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">Keeping it safe</h3>
            <p>
              Your details sit on password-protected phones and devices used only by the proprietor and our authorised family members and staff. This website is served over a secure (HTTPS) connection.
            </p>
          </div>

          {/* Your choices */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">Your choices</h3>
            <p>
              Ask us at any time what we hold about you, ask us to correct it, or ask us to delete it. Ask us to stop messaging you and we will. Just WhatsApp or email us at{' '}
              <a href={`mailto:${displayEmail}`} className="text-brand-green font-semibold underline">
                {displayEmail}
              </a>{' '}
              and we'll respond within 30 days.
            </p>
          </div>

          {/* Children */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">Children</h3>
            <p>
              We don't knowingly collect personal information from anyone under 18.
            </p>
          </div>

          {/* If you're unhappy */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">If you're unhappy</h3>
            <p>
              Please speak to <strong>Rajambal V</strong> on{' '}
              <a href="tel:+919841207516" className="text-brand-green font-semibold hover:underline">
                {displayPhone}
              </a>{' '}
              or write to{' '}
              <a href={`mailto:${displayEmail}`} className="text-brand-green font-semibold underline">
                {displayEmail}
              </a>{' '}
              and we'll try to put it right.
            </p>
          </div>

          {/* Changes */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">Changes</h3>
            <p>
              If we update this policy, the new version will appear here with a fresh date.
            </p>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}

