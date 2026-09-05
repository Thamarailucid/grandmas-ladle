import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { createWhatsAppOrderUrl } from '@/lib/whatsapp';
import { apiClient } from '@/lib/apiClient';
import { Product, ProductCategory, ApiListResponse } from '@grandmas-ladle/shared';
import dayjs from 'dayjs';
import { useBusinessSettingsContext } from '../../../contexts/BusinessSettingsContext';
import { useCart } from '../../../contexts/CartContext';
import toast from 'react-hot-toast';
import { MinimalLoader } from '@/components/common/MinimalLoader';

const fetchCategories = async (): Promise<ProductCategory[]> => {
  const response = await apiClient.get<ApiListResponse<ProductCategory>>('/ProductCategory/GetPublicProductCategories');
  return response.data.data;
};

const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiListResponse<Product>>('/Product/GetPublicProducts');
  return response.data.data;
};

export default function MenuPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const { offerPreVisibilityDays = 1, offerPostVisibilityDays = 0, isCartEnabled = true, saleProductIds = [], saleStartDate, saleEndDate, isAnnouncementActive, isGlobalSaleActive } = useBusinessSettingsContext();
  const { addToCart } = useCart();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<ProductCategory[]>({
    queryKey: ['public-categories'],
    queryFn: fetchCategories,
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['public-products'],
    queryFn: fetchProducts,
  });

  // Set default active category once loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const displayedItems = products.filter(item => item.categoryId === activeCategoryId);
  const activeCategoryObj = categories.find(c => c.id === activeCategoryId);

  return (
    <>
      <Helmet>
        <title>Menu | Traditional Snacks, Ladoos & Sundal — Grandma's Ladle</title>
        <meta name="description" content="Explore our menu of traditional snacks, ladoos, sundal and festival specials made the way grandma did." />
      </Helmet>
      
      <SectionContainer bgColor="cream">
        <SectionHeading 
          title="OUR MENU" 
          subtitle="Traditional foods made the way grandma did." 
          centered 
        />

        {isLoadingCategories ? (
          <MinimalLoader text="Loading Menu..." />
        ) : (
          <>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 py-4 mb-8">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full border transition-colors ${activeCategoryId === cat.id ? 'bg-[#2C4A3B] text-white border-[#2C4A3B]' : 'bg-transparent border-[#2C4A3B] text-[#2C4A3B] hover:bg-[#2C4A3B] hover:text-white'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {(() => {
              const now = dayjs();
              // Show featured section if announcement is active and sale hasn't fully ended yet
              const isGlobalSaleVisible = isGlobalSaleActive && (!saleEndDate || now.isBefore(dayjs(saleEndDate).add(offerPostVisibilityDays, 'day')));
              const isGlobalSaleFuture = isGlobalSaleActive && saleStartDate && now.isBefore(dayjs(saleStartDate));
              const isGlobalSaleActiveNow = isGlobalSaleActive && (!saleStartDate || now.isAfter(dayjs(saleStartDate))) && (!saleEndDate || now.isBefore(dayjs(saleEndDate)));
              
              const saleProducts = products.filter(p => saleProductIds.includes(p.id));
              
              if (isGlobalSaleVisible && saleProducts.length > 0) {
                return (
                  <div className="mb-12">
                    <h3 className="text-2xl font-serif text-[#2C4A3B] mb-6 border-b pb-2">
                      🌟 {isGlobalSaleFuture ? 'Upcoming Sale Items' : 'Featured Sale Items'}
                    </h3>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {saleProducts.map((item: any) => {
                  const hasOfferDates = item.offerStartDate || item.offerEndDate;
                  const isItemFuture = item.offerStartDate && now.isBefore(dayjs(item.offerStartDate));
                  const isItemPast = item.offerEndDate && now.isAfter(dayjs(item.offerEndDate));
                  const isOrderable = !isItemFuture && !isItemPast && item.isAvailable !== false;

                  return (
                    <div key={`sale-${item.id}`} className="bg-[#faf6ee] border border-[rgba(35,31,26,0.08)] rounded-[14px] shadow-[0px_2px_10px_0px_rgba(138,75,38,0.1),0px_1px_2px_0px_rgba(138,75,38,0.08)] flex flex-col h-full overflow-hidden">
                      {/* Image Container */}
                      <div className="p-2 sm:p-3">
                        <div className="bg-[#e7e1d2] rounded-[10px] overflow-hidden relative aspect-square flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover ${!isOrderable ? 'grayscale opacity-70' : ''}`} />
                          ) : (
                            <span className="text-xs sm:text-sm text-[#6b6259] italic">Image of {item.name}</span>
                          )}
                          {/* Sale Ribbon */}
                          {item.isOnSale && (
                            <div className="absolute -left-[29px] -top-[25px] w-[113px] h-[113px] flex items-center justify-center">
                              <div className="-rotate-45">
                                <div className="bg-[#b23a2e] drop-shadow-[0px_2px_2.5px_rgba(0,0,0,0.18)] flex flex-col items-center py-1.5 w-[100px] sm:w-[130px]">
                                  <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Sale</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {isItemFuture && !item.isOnSale && (
                            <div className="absolute -left-[29px] -top-[25px] w-[113px] h-[113px] flex items-center justify-center">
                              <div className="-rotate-45">
                                <div className="bg-[#2f4a3c] drop-shadow-[0px_2px_2.5px_rgba(0,0,0,0.18)] flex flex-col items-center py-1.5 w-[100px] sm:w-[130px]">
                                  <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Soon</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Out of Stock Badge */}
                          {item.isAvailable === false && (
                            <div className="absolute top-2 left-2 z-10 bg-red-600/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded shadow uppercase tracking-wider">
                              Out of Stock
                            </div>
                          )}
                          {/* Tag Badge */}
                          {item.tag && (
                            <div className="absolute top-2 right-2 bg-[#2f4a3c] px-2 sm:px-3 py-1 rounded-md">
                              <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wide">{item.tag}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="px-3 sm:px-[18px] pb-3 sm:pb-[18px] pt-1 sm:pt-2 flex flex-col flex-grow">
                        <h3 className="text-sm sm:text-xl font-semibold font-serif text-[#2f4a3c] mb-1 sm:mb-1.5 leading-tight line-clamp-1">{item.name}</h3>
                        <p className="text-[#6b6259] text-[11px] sm:text-sm leading-snug flex-grow mb-2 sm:mb-3 line-clamp-2">{item.shortDescription || item.description}</p>
                        <div className="mt-auto">
                          <div className="mb-2 sm:mb-3 flex flex-wrap items-baseline gap-1 sm:gap-2">
                            {item.originalPrice ? (
                              <>
                                <span className="text-[#6b6259] line-through text-[11px] sm:text-sm">₹{item.originalPrice}</span>
                                <span className="text-[#b9925b] font-bold text-sm sm:text-xl">₹{item.price}</span>
                              </>
                            ) : (
                              <span className="text-[#b9925b] font-bold text-sm sm:text-xl">₹{item.price}</span>
                            )}
                            {(item.portionSize || item.unit) && <span className="text-[#b9925b]/50 text-[10px] sm:text-base font-semibold">( {[item.portionSize, item.unit].filter(Boolean).join(' ')} )</span>}
                          </div>
                          {isOrderable ? (
                            <div className="flex gap-1.5 sm:gap-2">
                              <a
                                href={createWhatsAppOrderUrl(item.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${isCartEnabled ? 'flex-1' : 'w-full'} inline-flex items-center justify-center gap-1 sm:gap-2 bg-[#b9925b] hover:bg-[#a67f4e] text-white font-semibold py-2 sm:py-3 px-2 sm:px-4 rounded-[9px] transition-colors text-[10px] sm:text-sm`}
                              >
                                <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                <span className="hidden sm:inline">Order on WhatsApp</span>
                                <span className="sm:hidden">WhatsApp</span>
                              </a>
                              {isCartEnabled && (
                                <button
                                  onClick={() => { addToCart(item); toast.success(`${item.name} added to cart!`); }}
                                  className="w-10 sm:w-[62px] h-10 sm:h-[44px] flex items-center justify-center border border-[#b9925b] text-[#b9925b] hover:bg-[#b9925b] hover:text-white rounded-[9px] transition-colors flex-shrink-0"
                                  aria-label="Add to cart"
                                >
                                  <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="w-full text-center py-2 sm:py-3 px-2 sm:px-4 rounded-[9px] border border-gray-300 text-gray-400 text-[10px] sm:text-sm font-medium cursor-not-allowed">
                              {item.isAvailable === false ? 'OUT OF STOCK' : isItemFuture ? 'COMING SOON' : 'OFFER ENDED'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;
      })()}

      {activeCategoryObj?.name.includes('Festival') || activeCategoryObj?.slug.includes('festival') ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-[#3E2C22] mb-4">See our festival specials</h3>
          <BrandButton variant="primary" to="/festivals">View Festival Specials</BrandButton>
        </div>
      ) : isLoadingProducts ? (
        <MinimalLoader text="Loading Products..." />
      ) : displayedItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No items available in this category right now.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {displayedItems.filter((item: any) => {
            const now = dayjs();
            if (item.offerStartDate && now.isBefore(dayjs(item.offerStartDate).subtract(offerPreVisibilityDays, 'day'))) return false;
            if (item.offerEndDate && now.isAfter(dayjs(item.offerEndDate).add(offerPostVisibilityDays, 'day'))) return false;
            return true;
          }).sort((a: any, b: any) => {
            const hasOfferA = a.offerStartDate || a.offerEndDate ? 1 : 0;
            const hasOfferB = b.offerStartDate || b.offerEndDate ? 1 : 0;
            return hasOfferB - hasOfferA;
          }).map((item: any) => {
            const now = dayjs();
            const hasOfferDates = item.offerStartDate || item.offerEndDate;
            const isFuture = item.offerStartDate && now.isBefore(dayjs(item.offerStartDate));
            const isPast = item.offerEndDate && now.isAfter(dayjs(item.offerEndDate));
            const isOrderable = !isFuture && !isPast && item.isAvailable !== false;

            return (
              <div key={item.id} className="bg-[#faf6ee] border border-[rgba(35,31,26,0.08)] rounded-[14px] shadow-[0px_2px_10px_0px_rgba(138,75,38,0.1),0px_1px_2px_0px_rgba(138,75,38,0.08)] flex flex-col h-full overflow-hidden">
                {/* Image Container */}
                <div className="p-2 sm:p-3">
                  <div className="bg-[#e7e1d2] rounded-[10px] overflow-hidden relative aspect-square flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover ${!isOrderable ? 'grayscale opacity-70' : ''}`} />
                    ) : (
                      <span className="text-xs sm:text-sm text-[#6b6259] italic">Image of {item.name}</span>
                    )}
                    {/* Sale Ribbon */}
                    {item.isOnSale && (
                      <div className="absolute -left-[29px] -top-[25px] w-[113px] h-[113px] flex items-center justify-center">
                        <div className="-rotate-45">
                          <div className="bg-[#b23a2e] drop-shadow-[0px_2px_2.5px_rgba(0,0,0,0.18)] flex flex-col items-center py-1.5 w-[100px] sm:w-[130px]">
                            <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Sale</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {isFuture && !item.isOnSale && (
                      <div className="absolute -left-[29px] -top-[25px] w-[113px] h-[113px] flex items-center justify-center">
                        <div className="-rotate-45">
                          <div className="bg-[#2f4a3c] drop-shadow-[0px_2px_2.5px_rgba(0,0,0,0.18)] flex flex-col items-center py-1.5 w-[100px] sm:w-[130px]">
                            <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Soon</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Out of Stock Badge */}
                    {item.isAvailable === false && (
                      <div className="absolute top-2 left-2 z-10 bg-red-600/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded shadow uppercase tracking-wider">
                        Out of Stock
                      </div>
                    )}
                    {/* Tag Badge */}
                    {item.tag && (
                      <div className="absolute top-2 right-2 bg-[#2f4a3c] px-2 sm:px-3 py-1 rounded-md">
                        <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wide">{item.tag}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Content */}
                <div className="px-3 sm:px-[18px] pb-3 sm:pb-[18px] pt-1 sm:pt-2 flex flex-col flex-grow">
                  <h3 className="text-sm sm:text-xl font-semibold font-serif text-[#2f4a3c] mb-1 sm:mb-1.5 leading-tight line-clamp-1">{item.name}</h3>
                  <p className="text-[#6b6259] text-[11px] sm:text-sm leading-snug flex-grow mb-2 sm:mb-3 line-clamp-2">{item.shortDescription || item.description}</p>
                  <div className="mt-auto">
                    <div className="mb-2 sm:mb-3 flex flex-wrap items-baseline gap-1 sm:gap-2">
                      {item.originalPrice ? (
                        <>
                          <span className="text-[#6b6259] line-through text-[11px] sm:text-sm">₹{item.originalPrice}</span>
                          <span className="text-[#b9925b] font-bold text-sm sm:text-xl">₹{item.price}</span>
                        </>
                      ) : (
                        <span className="text-[#b9925b] font-bold text-sm sm:text-xl">₹{item.price}</span>
                      )}
                      {(item.portionSize || item.unit) && <span className="text-[#b9925b]/50 text-[10px] sm:text-base font-semibold">( {[item.portionSize, item.unit].filter(Boolean).join(' ')} )</span>}
                    </div>
                    {isOrderable ? (
                      <div className="flex gap-1.5 sm:gap-2">
                        <a
                          href={createWhatsAppOrderUrl(item.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${isCartEnabled ? 'flex-1' : 'w-full'} inline-flex items-center justify-center gap-1 sm:gap-2 bg-[#b9925b] hover:bg-[#a67f4e] text-white font-semibold py-2 sm:py-3 px-2 sm:px-4 rounded-[9px] transition-colors text-[10px] sm:text-sm`}
                        >
                          <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <span className="hidden sm:inline">Order on WhatsApp</span>
                          <span className="sm:hidden">WhatsApp</span>
                        </a>
                        {isCartEnabled && (
                          <button
                            onClick={() => { addToCart(item); toast.success(`${item.name} added to cart!`); }}
                            className="w-10 sm:w-[62px] h-10 sm:h-[44px] flex items-center justify-center border border-[#b9925b] text-[#b9925b] hover:bg-[#b9925b] hover:text-white rounded-[9px] transition-colors flex-shrink-0"
                            aria-label="Add to cart"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-full text-center py-2 sm:py-3 px-2 sm:px-4 rounded-[9px] border border-gray-300 text-gray-400 text-[10px] sm:text-sm font-medium cursor-not-allowed">
                        {item.isAvailable === false ? 'OUT OF STOCK' : isFuture ? 'COMING SOON' : 'OFFER ENDED'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
          </>
        )}

        <div className="mt-12 text-center text-gray-500 italic text-sm">
          Menu items and availability may change. Contact us for the latest offerings.
        </div>
      </SectionContainer>
    </>
  );
}
