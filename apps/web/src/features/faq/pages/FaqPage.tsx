import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Collapse } from 'antd';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';
import { createWhatsAppUrl, formatPhoneTel } from '@/lib/whatsapp';

const faqs = [
  {
    key: '1',
    label: 'How do I order?',
    children: 'WhatsApp or call us on +91 98412 07516. We\'ll confirm your items, price and pickup or delivery time.'
  },
  {
    key: '2',
    label: 'Can I change or cancel my order?',
    children: 'Of course, just let us know before we start cooking, usually within a couple of hours of confirming. Everything is made fresh to order, so we can\'t cancel once preparation has begun.'
  },
  {
    key: '3',
    label: 'What if something isn\'t right?',
    children: 'Tell us within a few hours and we\'ll replace it on our next run or refund you. We\'re a family kitchen and we\'d rather fix it than argue about it.'
  },
  {
    key: '4',
    label: 'Festival and bulk orders - how far in advance should I order?',
    children: 'Please give us 2-3 days\' notice. For large orders we ask for an advance to cover ingredients.'
  },
  {
    key: '5',
    label: 'Do you deliver, or is it pickup only?',
    children: 'Delivery is available in and around New Thippasandra. For other areas across Bengaluru, freight services and courier costs are borne by the customer.'
  },
  {
    key: '6',
    label: 'Do you cater for corporate or bulk orders?',
    children: 'Yes - see our Corporate & Bulk Orders page, or WhatsApp us with your requirements.'
  },
  {
    key: '7',
    label: 'Can I customise a festival box?',
    children: 'Yes, festival gift boxes can be customised on demand.'
  },
  {
    key: '8',
    label: 'What payment methods do you accept?',
    children: 'UPI or cash on delivery/pickup.'
  },
  {
    key: '9',
    label: 'Do your products contain nuts, dairy or gluten?',
    children: 'Not all products contain allergens. Kindly speak to us or message us for specific dietary preferences.'
  },
  {
    key: '10',
    label: 'How should I store what I\'ve ordered, and how long does it stay fresh?',
    children: 'Ladoos stay fresh for 10 days at room temperature and 15 days refrigerated. Traditional snacks are best before 20 days. Daily freshly made items should be consumed on the same day.'
  }
];


export default function FaqPage() {
  const { phone } = useBusinessSettingsContext();

  return (
    <>
      <Helmet>
        <title>FAQ | Grandma's Ladle - Frequently Asked Questions</title>
        <meta name="description" content="Frequently asked questions about Grandma's Ladle orders, delivery, ingredients, and shelf life in Bengaluru." />
        <link rel="canonical" href="https://grandmasladle.com/faq" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FAQ | Grandma's Ladle" />
        <meta property="og:description" content="Frequently asked questions about orders, deliveries, and traditional recipes." />
        <meta property="og:url" content="https://grandmasladle.com/faq" />
        <meta property="og:image" content="https://grandmasladle.com/logo.jpg" />

        {/* FAQPage Structured Data for Google AI Overviews & Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.label,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.children
              }
            }))
          })}
        </script>
      </Helmet>

      <SectionContainer bgColor="white">
        <SectionHeading
          title="FREQUENTLY ASKED QUESTIONS"
          centered
        />

        <div className="max-w-3xl mx-auto mt-12">
          <Collapse 
            items={faqs} 
            defaultActiveKey={['1']} 
            className="bg-transparent border-[#E5DCC5]"
            size="large"
            accordion
          />

          <div className="mt-16 text-center bg-[#FAF4E6] p-8 rounded-lg border border-[#E5DCC5]">
            <h3 className="text-2xl font-bold text-[#2C4A3B] mb-4">Have another question?</h3>
            <p className="text-[#3E2C22] mb-6 text-lg">Get in touch via WhatsApp or give us a call.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <BrandButton
                variant="primary"
                href={createWhatsAppUrl('Hi, I have a question about...')}
              >
                WhatsApp Us
              </BrandButton>
              <BrandButton
                variant="outline"
                href={`tel:${formatPhoneTel(phone)}`}
              >
                Call Us
              </BrandButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
