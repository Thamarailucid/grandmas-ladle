import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { apiClient } from '@/lib/apiClient';
import { ApiListResponse, Product } from '@grandmas-ladle/shared';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';
import { useCart } from '@/contexts/CartContext';
import { createWhatsAppOrderUrl } from '@/lib/whatsapp';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiListResponse<Product>>('/Product/GetPublicProducts');
  return response.data.data;
};

export default function SalePage() {
  const { offerPreVisibilityDays = 1, offerPostVisibilityDays = 0, isCartEnabled = true, saleProductIds = [], saleStartDate, saleEndDate, isGlobalSaleActive } = useBusinessSettingsContext();
  const { addToCart } = useCart();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['public-products'],
    queryFn: fetchProducts,
  });

  const now = dayjs();
  const isGlobalSaleVisible = isGlobalSaleActive && (!saleEndDate || now.isBefore(dayjs(saleEndDate).add(offerPostVisibilityDays, 'day')));
  const isGlobalSaleFuture = isGlobalSaleActive && saleStartDate && now.isBefore(dayjs(saleStartDate));
  
  const saleProducts = products.filter((p: any) => saleProductIds.includes(p.id));

  return (
    <>
      <Helmet>
        <title>Special Sale | Grandma's Ladle</title>
        <meta name="description" content="Shop our limited-time special sale items." />
      </Helmet>
      
      <SectionContainer bgColor="cream">
        <SectionHeading 
          title="SPECIAL SALE" 
          subtitle="Grab our traditional foods at special prices while they last!" 
          centered 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20 min-h-[50vh]">
          {isLoadingProducts ? (
            <div className="text-center py-20 text-[#2C4A3B]">Loading sale items...</div>
          ) : !isGlobalSaleVisible || saleProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-md border border-[#E8DCC4]">
              <h3 className="text-xl font-serif text-[#2C4A3B] mb-2">No active sales right now</h3>
              <p className="text-gray-600">Please check back later or explore our regular menu.</p>
              <div className="mt-6">
                <BrandButton variant="primary" to="/menu">Browse Menu</BrandButton>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-serif text-[#2C4A3B] mb-6 border-b pb-2">
                🌟 {isGlobalSaleFuture ? 'Upcoming Sale Items' : 'Featured Sale Items'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {saleProducts.map((item: any) => {
                  const hasOfferDates = item.offerStartDate || item.offerEndDate;
                  const isItemFuture = item.offerStartDate && now.isBefore(dayjs(item.offerStartDate));
                  const isItemPast = item.offerEndDate && now.isAfter(dayjs(item.offerEndDate));
                  
                  let badge = <div className="absolute top-4 right-4 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">SPECIAL OFFER</div>;
                  if (isItemFuture) badge = <div className="absolute top-4 right-4 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">STARTS SOON</div>;
                  else if (hasOfferDates && !isItemPast) badge = <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md animate-pulse">LIMITED TIME</div>;
                  else if (item.tag && !isItemPast) badge = <div className="absolute top-4 right-4 bg-antique-brass text-dark-brown text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">{item.tag.toUpperCase()}</div>;

                  let saleBadge = null;
                  
                  if (item.isOnSale) {
                    saleBadge = <div className="absolute top-4 left-0 bg-[#B85C3E] text-white text-xs font-bold px-3 py-1 rounded-r-full z-10 shadow-md">SALE</div>;
                  } else if (isGlobalSaleFuture) {
                    saleBadge = <div className="absolute top-4 left-0 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-r-full z-10 shadow-md">SALE COMING SOON</div>;
                  }

                  const isOrderable = !isItemFuture && !isItemPast && item.isAvailable !== false;

                  return (
                    <div key={`sale-${item.id}`} className="bg-white rounded-lg p-6 shadow-md flex flex-col h-full border-2 border-[#B8925A] relative">
                      {saleBadge}
                      {badge}
                      <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400 overflow-hidden relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover ${!isOrderable ? 'grayscale opacity-70' : ''}`} />
                        ) : (
                          <span>Image Placeholder</span>
                        )}
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold font-fraunces text-[#2C4A3B]">{item.name}</h3>
                            <div className="text-right">
                              {item.originalPrice ? (
                                <>
                                  <span className="text-gray-400 line-through mr-2">₹{item.originalPrice}</span>
                                  <span className="text-[#B8925A] font-bold text-lg">₹{item.price}</span>
                                </>
                              ) : (
                                <span className="text-[#B8925A] font-bold text-lg">₹{item.price}</span>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                        </div>
                        
                        <div>
                          {(item.portionSize || item.unit) && (
                            <p className="text-xs text-gray-500 mb-4 bg-gray-50 inline-block px-2 py-1 rounded">
                              Portion: {[item.portionSize, item.unit].filter(Boolean).join(' ')}
                            </p>
                          )}
                          
                          {isOrderable ? (
                            <div className="flex gap-2">
                              {isCartEnabled && (
                                <BrandButton variant="primary" className="w-full text-center" onClick={() => addToCart(item)}>
                                  ADD TO CART
                                </BrandButton>
                              )}
                              <BrandButton variant={isCartEnabled ? "outline" : "primary"} href={createWhatsAppOrderUrl(item.name)} className="w-full text-center">
                                {isCartEnabled ? "QUICK ORDER" : "ORDER VIA WHATSAPP"}
                              </BrandButton>
                            </div>
                          ) : (
                            <BrandButton variant="outline" href="#" className="w-full text-center opacity-50 cursor-not-allowed" onClick={() => {}}>
                              {item.isAvailable === false ? 'OUT OF STOCK' : isItemFuture ? 'COMING SOON' : 'OFFER ENDED'}
                            </BrandButton>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SectionContainer>
    </>
  );
}
