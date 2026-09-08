import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';
import { formatDisplayPhone } from '@/lib/whatsapp';

export default function RefundPolicyPage() {
  const { phone, email, address, fssaiNumber } = useBusinessSettingsContext();
  const displayFssai = fssaiNumber || '21226010006642';

  return (
    <>
      <Helmet>
        <title>Cancellation & Refund Policy | Grandma's Ladle - Traditional Snacks & Sweets</title>
        <meta 
          name="description" 
          content="Cancellation and refund policy for freshly made traditional snacks and festival sweets at Grandma's Ladle. Quality guarantee and transparent refund procedures." 
        />
        <link rel="canonical" href="https://grandmasladle.com/refund-policy" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Cancellation & Refund Policy | Grandma's Ladle" />
        <meta property="og:description" content="Cancellation and refund policy for freshly made traditional snacks and festival sweets at Grandma's Ladle." />
        <meta property="og:url" content="https://grandmasladle.com/refund-policy" />
        <meta property="og:site_name" content="Grandma's Ladle" />
        <meta property="og:image" content="https://grandmasladle.com/logo.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Cancellation & Refund Policy | Grandma's Ladle" />
        <meta name="twitter:description" content="Cancellation and refund policy for Grandma's Ladle traditional sweets and snacks." />
        <meta name="twitter:image" content="https://grandmasladle.com/logo.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Cancellation & Refund Policy - Grandma's Ladle",
            "url": "https://grandmasladle.com/refund-policy",
            "description": "Cancellation and refund policy for Grandma's Ladle traditional foods.",
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
          title="CANCELLATION & REFUND POLICY" 
          subtitle="Our commitment to quality, freshness, and customer fairness."
          centered 
        />

        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#B8925A]/20 font-inter text-[#3E2C22] leading-relaxed space-y-8">
          <div>
            <p className="text-sm text-gray-500 mb-6">Last updated: September 2026</p>
            <p>
              At <strong>Grandma's Ladle</strong>, every snack, sweet, and festival delicacy is handcrafted in small batches using traditional recipes and pure ingredients without artificial preservatives. Because we prepare freshly made food items, our cancellation and refund guidelines are outlined below to ensure fairness and quality assurance.
            </p>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">1. Order Cancellation</h3>
            <div className="space-y-3 text-sm sm:text-base">
              <p>
                <strong>Daily / Standard Orders:</strong> Once an order is confirmed, preparation begins shortly thereafter to guarantee freshness. Cancellations can be requested by calling or messaging us on WhatsApp ({formatDisplayPhone(phone)}) prior to the dispatch of preparation.
              </p>
              <p>
                <strong>Bulk, Corporate & Festival Pre-Orders:</strong> For large orders requiring dedicated ingredient sourcing (e.g., Modakam boxes, corporate celebration packs), cancellations must be communicated at least <strong>24 hours</strong> before the scheduled delivery date for a full refund or date rescheduling.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">2. Quality Guarantee & Replacements</h3>
            <p className="mb-3">
              We take utmost care in kitchen hygiene and protective packaging. However, if you experience any of the following upon delivery:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base">
              <li>Package arrived damaged or tampered during transit</li>
              <li>Incorrect items delivered compared to your confirmed order</li>
              <li>A genuine discrepancy in freshness or preparation quality</li>
            </ul>
            <p className="mt-3">
              Please notify us within <strong>6 hours</strong> of delivery with a photograph of the packaging and items via WhatsApp or email. We will gladly arrange an <strong>immediate replacement</strong> in the next dispatch or process a <strong>full refund</strong>.
            </p>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">3. Refund Processing</h3>
            <p>
              Approved refunds will be processed via original payment mode (UPI, bank transfer) within <strong>2 to 4 business days</strong>.
            </p>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">4. Non-Refundable Situations</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base">
              <li>Incorrect or incomplete delivery address provided by the customer leading to failed delivery.</li>
              <li>Unavailability of the recipient at the specified delivery slot after multiple contact attempts.</li>
              <li>Quality issues reported after perishable shelf-life has lapsed or items were improperly stored.</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">5. Need Assistance?</h3>
            <p className="mb-2">
              We are a family-run traditional kitchen and will always do our best to ensure you are delighted with Grandma's Ladle:
            </p>
            <div className="bg-[#FAF4E6] p-4 rounded-xl text-sm space-y-1">
              <p><strong>Grandma's Ladle</strong></p>
              <p>Address: {address}</p>
              <p>WhatsApp / Call: {formatDisplayPhone(phone)}</p>
              <p>Email: <a href={`mailto:${email}`} className="text-brand-green underline">{email}</a></p>
              <p>FSSAI Registration No.: {displayFssai}</p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
