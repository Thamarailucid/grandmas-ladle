import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { createWhatsAppUrl } from '@/lib/whatsapp';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';

export default function VisitUsPage() {
  const { address, openingHours, phone, email, googleMapsUrl } = useBusinessSettingsContext();

  return (
    <>
      <Helmet>
        <title>Visit Us | Grandma's Ladle, New Thippasandra, Bengaluru</title>
        <meta name="description" content="Come visit Grandma's Kitchen in New Thippasandra, Bengaluru." />
      </Helmet>

      <SectionContainer bgColor="cream">
        <SectionHeading 
          title="COME VISIT GRANDMA'S KITCHEN" 
          centered 
        />
        
        <div className="max-w-5xl mx-auto mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#2C4A3B] mb-4">Location & Hours</h3>
                
                <div className="mb-4">
                  <h4 className="font-bold text-[#B85C3E]">Address:</h4>
                  <p className="text-[#3E2C22] whitespace-pre-line">{address}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-[#B85C3E]">Opening Hours:</h4>
                  <p className="text-[#3E2C22] whitespace-pre-line">{openingHours}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-[#B85C3E]">Contact:</h4>
                  <p className="text-[#3E2C22]">Phone: <a href={`tel:${phone}`} className="text-[#2C4A3B] underline">{phone}</a></p>
                  <p className="text-[#3E2C22]">Email: <a href={`mailto:${email}`} className="text-[#2C4A3B] underline">{email}</a></p>
                </div>

                <div className="mb-6 p-4 bg-[#FAF4E6] border border-[#B8925A] rounded-md">
                  <p className="text-[#3E2C22] italic">
                    Delivery in and around New Thippasandra. For other areas, freight charges apply.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <BrandButton variant="primary" href={googleMapsUrl || "#"} className="text-center">
                  GET DIRECTIONS
                </BrandButton>
                <BrandButton variant="outline" href={`tel:${phone}`} className="text-center">
                  CALL US
                </BrandButton>
                <BrandButton variant="outline" href={createWhatsAppUrl()} className="text-center">
                  WHATSAPP
                </BrandButton>
                <BrandButton variant="primary" to="/menu" className="text-center">
                  ORDER NOW
                </BrandButton>
              </div>
            </div>

            <div className="h-full min-h-[400px] bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 relative overflow-hidden">
              {googleMapsUrl ? (
                googleMapsUrl.includes('<iframe') ? (
                  <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" dangerouslySetInnerHTML={{ __html: googleMapsUrl }} />
                ) : (
                  <iframe 
                    src={googleMapsUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                )
              ) : (
                <div className="text-center p-6">
                  <div className="text-[#2C4A3B] font-bold text-xl mb-2">Map View</div>
                  <div className="text-gray-500 text-sm">Update Google Maps URL in Admin Panel</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
