import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';

export default function PrivacyPolicyPage() {
  const { phone, email, address, fssaiNumber } = useBusinessSettingsContext();
  const displayFssai = fssaiNumber || '21226010006642';

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Grandma's Ladle</title>
        <meta name="description" content="Privacy Policy for Grandma's Ladle. How we handle and protect customer and corporate inquiry data." />
      </Helmet>

      <SectionContainer bgColor="cream" className="py-16 md:py-24">
        <SectionHeading 
          title="PRIVACY POLICY" 
          subtitle="How we respect and protect your personal information."
          centered 
        />

        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#B8925A]/20 font-inter text-[#3E2C22] leading-relaxed space-y-8">
          <div>
            <p className="text-sm text-gray-500 mb-6">Last updated: September 2026</p>
            <p>
              At <strong>Grandma's Ladle</strong> ("we", "our", or "us"), we value the trust you place in us when sharing your personal details. This Privacy Policy describes how we collect, use, and protect information submitted via our website (<a href="https://grandmasladle.com" className="text-brand-green underline">grandmasladle.com</a>), including our Corporate Enquiry and Contact forms.
            </p>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">1. Information We Collect</h3>
            <p className="mb-3">
              When you interact with our website or request catering quotes, we may collect the following details provided directly by you:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base">
              <li><strong>Contact Information:</strong> Name, phone number, and email address.</li>
              <li><strong>Corporate Details:</strong> Company name, designation, and office location.</li>
              <li><strong>Order Requirements:</strong> Headcount, preferred delivery date/time, budget preferences, and dietary specifications.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">2. How We Use Your Information</h3>
            <p className="mb-3">
              We collect information strictly for legitimate business and customer service purposes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base">
              <li>To prepare and communicate catering quotes and bulk festival orders.</li>
              <li>To coordinate food preparation, packaging, and timely local delivery or pickup.</li>
              <li>To respond to customer questions and feedback.</li>
              <li>To comply with regulatory food safety records under FSSAI regulations.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">3. We Do Not Sell or Rent Your Data</h3>
            <p>
              We maintain a strict zero-spam, zero-reselling policy. Your personal and corporate information is never sold, traded, or shared with third-party advertisers or data brokers.
            </p>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">4. Data Security & Storage</h3>
            <p>
              We implement industry-standard administrative and technical security measures to protect your data against unauthorized access, loss, or misuse. Access to inquiry submissions is restricted strictly to authorized team members who manage order fulfilment.
            </p>
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">5. Third-Party Services</h3>
            <p>
              When you click on our WhatsApp ordering links, you communicate through WhatsApp (Meta Platforms, Inc.), which is governed by WhatsApp's independent privacy policy and terms.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-playfair text-xl font-bold text-[#2C4A3B] mb-3">6. Contact Us</h3>
            <p className="mb-2">
              If you have any questions or concerns regarding our privacy practices or wish to update your details, please reach out to us:
            </p>
            <div className="bg-[#FAF4E6] p-4 rounded-xl text-sm space-y-1">
              <p><strong>Grandma's Ladle</strong></p>
              <p>Address: {address}</p>
              <p>Email: <a href={`mailto:${email}`} className="text-brand-green underline">{email}</a></p>
              <p>Phone: +91 {phone || '9841207516'}</p>
              <p>FSSAI Registration No.: {displayFssai}</p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
