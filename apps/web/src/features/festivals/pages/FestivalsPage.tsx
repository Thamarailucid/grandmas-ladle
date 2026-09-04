import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { createWhatsAppUrl } from '@/lib/whatsapp';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Spin } from 'antd';

export default function FestivalsPage() {
  const { data: festivals, isLoading } = useQuery({
    queryKey: ['Festivals'],
    queryFn: () => apiClient.get('/Festival/GetPublicFestivals').then(res => res.data.data),
  });
  return (
    <>
      <Helmet>
        <title>Festival Specials | Grandma's Ladle</title>
        <meta name="description" content="Traditional food has always been part of the occasions that bring families together. Our festive menu changes with the season." />
      </Helmet>

      <SectionContainer bgColor="cream">
        <SectionHeading 
          title="CELEBRATE THE WAY GRANDMA DID" 
          centered 
        />
        <div className="max-w-3xl mx-auto text-center mb-12 text-lg text-[#3E2C22]">
          Traditional food has always been part of the occasions that bring families together. Our festive menu changes with the season.
        </div>

        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12"><Spin size="large" /></div>
          ) : festivals && festivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {festivals.map((fest: any) => (
                <div key={fest.id} className="bg-white p-6 rounded-lg shadow-sm border border-[#B8925A] flex flex-col">
                  <h3 className="text-xl font-bold text-[#B85C3E] mb-3">{fest.name}</h3>
                  <p className="text-gray-700 mb-6 flex-grow">{fest.description}</p>
                  <BrandButton 
                    variant="outline" 
                    href={createWhatsAppUrl(`Hi, I'm interested in pre-booking for ${fest.name}`)}
                    className="w-full text-center mt-auto"
                  >
                    PRE-BOOK FESTIVE ORDER
                  </BrandButton>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No upcoming festivals at the moment. Please check back later.</div>
          )}
        </div>

        <div className="mt-12 text-center text-gray-500 italic">
          Festival menu changes seasonally. Contact us for current availability.
        </div>
      </SectionContainer>
    </>
  );
}
