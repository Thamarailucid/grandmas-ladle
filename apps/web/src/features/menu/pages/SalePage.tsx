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
import toast from 'react-hot-toast';
import { MinimalLoader } from '@/components/common/MinimalLoader';

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
  const saleProducts = products.filter((p: any) => p.isListed !== false && (p.isOnSale || p.saleStatus === 'LIVE' || p.saleStatus === 'COMING_SOON' || saleProductIds.includes(p.id)));
  const isGlobalSaleVisible = (isGlobalSaleActive && (!saleEndDate || now.isBefore(dayjs(saleEndDate).add(offerPostVisibilityDays, 'day')))) || saleProducts.length > 0;
  const isGlobalSaleFuture = isGlobalSaleActive && saleStartDate && now.isBefore(dayjs(saleStartDate));

  return (
    <>
      <Helmet>
        <title>Special Sale | Grandma's Ladle</title>
        <meta name="description" content="Shop our limited-time special sale items made the authentic traditional way." />
      </Helmet>
      
      <SectionContainer bgColor="cream">
        <SectionHeading 
          title="SPECIAL SALE" 
          subtitle="Grab our traditional foods at special prices while they last!" 
          centered 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-20 min-h-[50vh]">
          {isLoadingProducts ? (
            <MinimalLoader text="Loading Sale Items..." />
          ) : !isGlobalSaleVisible || saleProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#faf6ee] rounded-[14px] border border-[rgba(35,31,26,0.08)] shadow-[0px_2px_10px_0px_rgba(138,75,38,0.06)] max-w-lg mx-auto">
              <span className="text-4xl mb-3 block">🪔</span>
              <h3 className="text-xl font-serif text-[#2C4A3B] mb-2">No active sales right now</h3>
              <p className="text-[#6b6259] text-sm mb-6 px-6 leading-relaxed">Our special festive discounts and seasonal deals will be back soon. Explore our fresh daily menu in the meantime.</p>
              <div>
                <BrandButton variant="primary" to="/menu">Browse Menu</BrandButton>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-[#2C4A3B]/20 pb-2">
                <h3 className="text-xl sm:text-2xl font-serif text-[#2C4A3B]">
                  🌟 {isGlobalSaleFuture ? 'Upcoming Sale Items' : 'Featured Sale Items'}
                </h3>
                <span className="text-xs sm:text-sm text-[#6b6259] font-medium bg-[#e7e1d2] px-2.5 py-1 rounded-full">
                  {saleProducts.length} {saleProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {saleProducts.map((item: any) => {
                  const hasOfferDates = item.offerStartDate || item.offerEndDate;
                  const isItemFuture = (item.saleStatus === 'COMING_SOON') || (item.offerStartDate && now.isBefore(dayjs(item.offerStartDate)));
                  const isItemPast = (item.saleStatus === 'ENDED') || (item.offerEndDate && now.isAfter(dayjs(item.offerEndDate)));
                  const isOrderable = !isItemFuture && !isItemPast && item.isAvailable !== false;

                  return (
                    <div key={`sale-${item.id}`} className="bg-[#faf6ee] border border-[rgba(35,31,26,0.08)] rounded-[14px] shadow-[0px_2px_10px_0px_rgba(138,75,38,0.08),0px_1px_2px_0px_rgba(138,75,38,0.06)] flex flex-col h-full overflow-hidden hover:shadow-[0px_4px_14px_0px_rgba(138,75,38,0.12)] transition-shadow">
                      {/* Image Container */}
                      <div className="p-2 sm:p-2.5">
                        <div className="bg-[#e7e1d2] rounded-[10px] overflow-hidden relative aspect-square flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover ${!isOrderable ? 'grayscale opacity-70' : ''}`} />
                          ) : (
                            <span className="text-[11px] sm:text-xs text-[#6b6259] italic text-center px-2">Image of {item.name}</span>
                          )}
                          {/* Sale Ribbon */}
                          {(item.isOnSale || item.saleStatus === 'LIVE') && (
                            <div className="absolute -left-[29px] -top-[25px] w-[113px] h-[113px] flex items-center justify-center pointer-events-none">
                              <div className="-rotate-45">
                                <div className="bg-[#b23a2e] drop-shadow-[0px_2px_2.5px_rgba(0,0,0,0.18)] flex flex-col items-center py-1 w-[100px] sm:w-[120px]">
                                  <span className="text-white text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase">Sale</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {(item.saleStatus === 'COMING_SOON' || (isItemFuture && !item.isOnSale)) && (
                            <div className="absolute -left-[29px] -top-[25px] w-[113px] h-[113px] flex items-center justify-center pointer-events-none">
                              <div className="-rotate-45">
                                <div className="bg-[#2f4a3c] drop-shadow-[0px_2px_2.5px_rgba(0,0,0,0.18)] flex flex-col items-center py-1 w-[100px] sm:w-[120px]">
                                  <span className="text-white text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase">Soon</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Out of Stock Badge */}
                          {item.isAvailable === false && (
                            <div className="absolute top-1.5 left-1.5 z-10 bg-red-600/90 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow uppercase tracking-wider">
                              Out of Stock
                            </div>
                          )}
                          {/* Tag Badge */}
                          {item.tag && (
                            <div className="absolute top-1.5 right-1.5 bg-[#2f4a3c] px-1.5 sm:px-2 py-0.5 rounded-md">
                              <span className="text-white text-[9px] sm:text-[10px] font-semibold tracking-wide">{item.tag}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="px-2.5 sm:px-3.5 pb-3 sm:pb-3.5 pt-1 sm:pt-1.5 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          <h3 className="text-xs sm:text-sm lg:text-base font-semibold font-serif text-[#2f4a3c] leading-snug line-clamp-1 flex-grow" title={item.name}>{item.name}</h3>
                          {/* FSSAI Veg / Non-Veg Mark */}
                          <div 
                            className={`flex-shrink-0 w-3.5 h-3.5 border-[1.5px] ${item.isVegetarian !== false ? 'border-[#16a34a]' : 'border-[#dc2626]'} rounded-sm p-[1.5px] flex items-center justify-center bg-white mt-0.5`}
                            title={item.isVegetarian !== false ? 'Pure Vegetarian' : 'Non-Vegetarian'}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVegetarian !== false ? 'bg-[#16a34a]' : 'bg-[#dc2626]'}`} />
                          </div>
                        </div>
                        <p className="text-[#6b6259] text-[10px] sm:text-xs leading-snug flex-grow mb-2 line-clamp-2 min-h-[26px] sm:min-h-[30px]">{item.shortDescription || item.description}</p>
                        <div className="mt-auto">
                          <div className="mb-2 flex flex-wrap items-baseline gap-1 sm:gap-1.5">
                            {item.originalPrice ? (
                              <>
                                <span className="text-[#6b6259] line-through text-[10px] sm:text-xs">₹{item.originalPrice}</span>
                                <span className="text-[#b9925b] font-bold text-xs sm:text-sm lg:text-base">₹{item.price}</span>
                              </>
                            ) : (
                              <span className="text-[#b9925b] font-bold text-xs sm:text-sm lg:text-base">₹{item.price}</span>
                            )}
                            {(item.portionSize || item.unit) && <span className="text-[#b9925b]/50 text-[9px] sm:text-xs font-semibold">( {[item.portionSize, item.unit].filter(Boolean).join(' ')} )</span>}
                          </div>
                          {isOrderable ? (
                            <div className="flex gap-1.5 sm:gap-2">
                              <a
                                href={createWhatsAppOrderUrl(item.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${isCartEnabled ? 'flex-1' : 'w-full'} inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-[#b9925b] hover:bg-[#a67f4e] text-white font-semibold py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-[8px] transition-colors text-[10px] sm:text-xs`}
                              >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                <span className="hidden xl:inline">Order on WhatsApp</span>
                                <span className="xl:hidden">WhatsApp</span>
                              </a>
                              {isCartEnabled && (
                                <button
                                  onClick={() => { addToCart(item); toast.success(`${item.name} added to cart!`); }}
                                  className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center border border-[#b9925b] text-[#b9925b] hover:bg-[#b9925b] hover:text-white rounded-[8px] transition-colors flex-shrink-0"
                                  aria-label="Add to cart"
                                >
                                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="w-full text-center py-1.5 sm:py-2 px-2 rounded-[8px] border border-gray-300 text-gray-400 text-[10px] sm:text-xs font-medium cursor-not-allowed">
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
          )}
        </div>
      </SectionContainer>
    </>
  );
}
