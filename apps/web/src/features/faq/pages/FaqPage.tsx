import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Collapse } from 'antd';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';
import { createWhatsAppUrl } from '@/lib/whatsapp';

const faqs = [
  {
    key: '1',
    label: 'How do I place an order?',
    children: 'You can order directly through WhatsApp, by phone, or using the Order Now button on this website.'
  },
  {
    key: '2',
    label: 'Do you deliver, or is it pickup only?',
    children: 'Delivery in and around New Thippasandra, for other areas the freight services should be borne by the customers.'
  },
  {
    key: '3',
    label: 'How far in advance should I order?',
    children: 'For everyday snacks – depends on requirement – one to ten days. For festival and bulk/corporate orders, we recommend booking at least 15 days in advance and pay ¾th of the amount.'
  },
  {
    key: '4',
    label: 'Do you cater for corporate or bulk orders?',
    children: 'Yes — see our Corporate & Bulk Orders page, or WhatsApp us with your requirements.'
  },
  {
    key: '5',
    label: 'Can I customise a festival box?',
    children: 'Yes on demand'
  },
  {
    key: '6',
    label: 'What payment methods do you accept?',
    children: 'UPI or cash'
  },
  {
    key: '7',
    label: 'Do your products contain nuts, dairy or gluten?',
    children: 'Not all products, kindly speak to us for any specifications'
  },
  {
    key: '8',
    label: 'How should I store what I\'ve ordered, and how long does it stay fresh?',
    children: '10 days out refrigerator and 15 days if kept inside fridge for ladoos. Snacks are best before 20 days. Other day in and day out products has to be consumed on the same day'
  }
];

export default function FaqPage() {
  const { phone } = useBusinessSettingsContext();

  return (
    <>
      <Helmet>
        <title>FAQ | Grandma's Ladle</title>
        <meta name="description" content="Frequently asked questions about Grandma's Ladle orders, delivery, ingredients, and more." />
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
                href={`tel:${phone}`}
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
