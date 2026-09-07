import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { createWhatsAppUrl, formatPhoneTel } from '@/lib/whatsapp';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';

const DEFAULT_MAPS_EMBED = 'https://maps.google.com/maps?q=12.9750239,77.6540696&hl=en&z=17&output=embed';
const DEFAULT_DIRECTIONS_URL = "https://www.google.com/maps/place/12%C2%B058'30.1%22N+77%C2%B039'14.7%22E/@12.9750239,77.6540696,17z";

function getMapEmbedUrl(url?: string): string {
  if (!url) return DEFAULT_MAPS_EMBED;
  if (url.includes('output=embed') || url.includes('/embed')) return url;
  const match = url.match(/@([0-9.]+),([0-9.]+)/);
  if (match) {
    return `https://maps.google.com/maps?q=${match[1]},${match[2]}&hl=en&z=17&output=embed`;
  }
  return DEFAULT_MAPS_EMBED;
}

export default function VisitUsPage() {
  const { address, openingHours, phone, email, googleMapsUrl, fssaiNumber } = useBusinessSettingsContext();
  const telUrl = `tel:${formatPhoneTel(phone)}`;
  const displayFssai = fssaiNumber || '21226010006642';
  
  const isIframeCode = googleMapsUrl && googleMapsUrl.includes('<iframe');
  const embedUrl = getMapEmbedUrl(googleMapsUrl);
  const directionsUrl = (googleMapsUrl && !isIframeCode && !googleMapsUrl.includes('output=embed'))
    ? googleMapsUrl
    : DEFAULT_DIRECTIONS_URL;

  return (
    <>
      <Helmet>
        <title>Visit Us | Grandma's Ladle, New Thippasandra, Bengaluru</title>
        <meta name="description" content="Come visit Grandma's Kitchen in New Thippasandra, Bengaluru. Authentic traditional homemade snacks, sweets, and festival savouries made fresh." />
        <link rel="canonical" href="https://grandma.novacodex.in/visit-us" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Visit Us | Grandma's Ladle, New Thippasandra, Bengaluru" />
        <meta property="og:description" content="Come visit Grandma's Kitchen in New Thippasandra, Bengaluru. Authentic South Indian sweets and snacks." />
        <meta property="og:url" content="https://grandma.novacodex.in/visit-us" />
        <meta property="og:image" content="https://grandma.novacodex.in/logo.jpg" />
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
                  <p className="text-[#3E2C22]">Phone: <a href={telUrl} className="text-[#2C4A3B] font-semibold underline">{phone || '9841207516'}</a></p>
                  <p className="text-[#3E2C22]">Email: <a href={`mailto:${email}`} className="text-[#2C4A3B] underline">{email}</a></p>
                </div>

                <div className="mb-4 p-3 bg-brand-green/5 border border-brand-green/20 rounded-lg flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#2C4A3B] tracking-wide">FSSAI Registered Food Business</span>
                    <span className="text-xs font-mono text-gray-700">Reg. No. {displayFssai}</span>
                  </div>
                  <span className="text-[11px] bg-white px-2 py-1 rounded text-[#2C4A3B] font-semibold border border-brand-green/20 shadow-xs">
                    Verified
                  </span>
                </div>

                <div className="mb-6 p-4 bg-[#FAF4E6] border border-[#B8925A] rounded-md">
                  <p className="text-[#3E2C22] italic text-sm">
                    Delivery in and around New Thippasandra. For other areas in Bengaluru, courier/freight charges apply.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <BrandButton variant="primary" href={directionsUrl} className="text-center">
                  GET DIRECTIONS
                </BrandButton>
                <BrandButton variant="outline" href={telUrl} className="text-center">
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

            <div className="h-full min-h-[420px] bg-gray-100 rounded-xl flex items-center justify-center border border-gray-300 relative overflow-hidden shadow-inner">
              {isIframeCode ? (
                <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" dangerouslySetInnerHTML={{ __html: googleMapsUrl! }} />
              ) : (
                <iframe 
                  src={embedUrl} 
                  title="Grandma's Ladle Location"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '420px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
