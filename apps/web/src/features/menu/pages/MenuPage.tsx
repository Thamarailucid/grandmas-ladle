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
import { ProductDetailModal } from '@/components/common/ProductDetailModal';

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
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
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

  const publicProducts = products.filter(item => item.isListed !== false);
  const displayedItems = publicProducts.filter(item => item.categoryId === activeCategoryId);
  const activeCategoryObj = categories.find(c => c.id === activeCategoryId);

  const now = dayjs();
  const saleProducts = publicProducts.filter(p => p.isOnSale || p.saleStatus === 'LIVE' || p.saleStatus === 'COMING_SOON' || saleProductIds.includes(p.id));
  const isGlobalSaleVisible = (isGlobalSaleActive && (!saleEndDate || now.isBefore(dayjs(saleEndDate).add(offerPostVisibilityDays, 'day')))) || saleProducts.length > 0;
  const isGlobalSaleFuture = isGlobalSaleActive && saleStartDate && now.isBefore(dayjs(saleStartDate));

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setTimeout(() => {
      const section = document.getElementById('category-products-section');
      if (section) {
        const yOffset = -130;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleSaleTagClick = () => {
    setTimeout(() => {
      const section = document.getElementById('featured-sale-section');
      if (section) {
        const yOffset = -130;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <>
      <Helmet>
        <title>Menu | Traditional Snacks, Ladoos & Sundal — Grandma's Ladle</title>
        <meta name="description" content="Explore our menu of traditional snacks, ladoos, sundal and festival specials made the way grandma did." />
      </Helmet>
      
      <SectionContainer bgColor="cream" className="py-16 md:py-15">
        <SectionHeading 
          title="OUR MENU" 
          subtitle="Traditional foods made the way grandma did." 
          centered 
          className="mb-5"
        />

        {isLoadingCategories ? (
          <MinimalLoader text="Loading Menu..." />
        ) : (
          <>
            <div className="flex overflow-x-auto hide-scrollbar gap-2.5 sm:gap-3.5 py-3 mb-4 sticky top-[64px] sm:top-[74px] z-20 bg-[#faf6ee]/95 backdrop-blur-sm -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-[#e7e1d2] shadow-sm">
              {isGlobalSaleVisible && saleProducts.length > 0 && (
                <button
                  onClick={handleSaleTagClick}
                  className="whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#b23a2e] text-[#b23a2e] hover:bg-[#b23a2e] hover:text-white transition-colors text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm flex-shrink-0"
                >
                  <span>🌟</span>
                  <span>Special Offers</span>
                  <span className="bg-[#b23a2e] text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full">
                    {saleProducts.length}
                  </span>
                </button>
              )}
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-colors text-xs sm:text-sm font-medium flex-shrink-0 ${activeCategoryId === cat.id ? 'bg-[#2C4A3B] text-white border-[#2C4A3B] shadow-sm' : 'bg-white/80 border-[#2C4A3B]/30 text-[#2C4A3B] hover:bg-[#2C4A3B] hover:text-white'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {isGlobalSaleVisible && saleProducts.length > 0 && (
              <div id="featured-sale-section" className="mb-14 scroll-mt-32">
                <div className="flex items-center justify-between mb-6 border-b border-[#2C4A3B]/20">
                  <h3 className="text-xl sm:text-2xl font-serif text-[#2C4A3B]">
                    🌟 {isGlobalSaleFuture ? 'Upcoming Sale Items' : 'Featured Sale Items'}
                  </h3>
                  <span className="text-xs sm:text-sm text-[#6b6259] font-medium bg-[#e7e1d2] px-2.5 py-1 rounded-full">
                    {saleProducts.length} {saleProducts.length === 1 ? 'offer' : 'offers'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {saleProducts.map((item: any) => {
                  const hasOfferDates = item.offerStartDate || item.offerEndDate;
                  const isItemFuture = item.offerStartDate && now.isBefore(dayjs(item.offerStartDate));
                  const isItemPast = item.offerEndDate && now.isAfter(dayjs(item.offerEndDate));
                  const isOrderable = !isItemFuture && !isItemPast && item.isAvailable !== false;

                  return (
                    <div key={`sale-${item.id}`} className="bg-[#faf6ee] border border-[rgba(35,31,26,0.08)] rounded-[14px] shadow-[0px_2px_10px_0px_rgba(138,75,38,0.08),0px_1px_2px_0px_rgba(138,75,38,0.06)] flex flex-col h-full overflow-hidden hover:shadow-[0px_4px_14px_0px_rgba(138,75,38,0.12)] transition-shadow">
                      {/* Image Container */}
                      <div className="p-2 sm:p-2.5">
                        <div 
                          className="bg-[#e7e1d2] rounded-[10px] overflow-hidden relative aspect-square flex items-center justify-center cursor-pointer group"
                          onClick={() => setSelectedProduct(item)}
                        >
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!isOrderable ? 'grayscale opacity-70' : ''}`} />
                          ) : (
                            <span className="text-[11px] sm:text-xs text-[#6b6259] italic text-center px-2">Image of {item.name}</span>
                          )}
                          {/* Top Badges (Sale & Tag) */}
                          <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1.5 z-10 pointer-events-none">
                            <div>
                              {(item.isOnSale || item.saleStatus === 'LIVE') && (
                                <span className="inline-block bg-[#b23a2e] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                                  Sale
                                </span>
                              )}
                              {(item.saleStatus === 'COMING_SOON' || (isItemFuture && !item.isOnSale)) && (
                                <span className="inline-block bg-[#2f4a3c] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                                  Soon
                                </span>
                              )}
                            </div>
                            {item.tag && (
                              <span className="inline-block bg-[#2f4a3c] text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm tracking-wide truncate max-w-[95px] sm:max-w-[120px]" title={item.tag}>
                                {item.tag}
                              </span>
                            )}
                          </div>

                          {/* Out of Stock Centered Overlay */}
                          {item.isAvailable === false && (
                            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[0.5px] flex items-center justify-center p-2 pointer-events-none">
                              <span className="bg-[#b23a2e] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider border border-white/20">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="px-2.5 sm:px-3.5 pb-3 sm:pb-3.5 pt-1 sm:pt-1.5 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          <h3 
                            onClick={() => setSelectedProduct(item)}
                            className="text-xs sm:text-sm lg:text-base font-semibold font-serif text-[#2f4a3c] hover:text-[#b9925b] leading-snug line-clamp-2 min-h-[28px] sm:min-h-[36px] flex-grow cursor-pointer transition-colors" 
                            title={item.name}
                          >
                            {item.name}
                          </h3>
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

          <div id="category-products-section" className="scroll-mt-32">
            <div className="flex items-center justify-between mb-6 border-b border-[#2C4A3B]/20">
              <h3 className="text-xl sm:text-2xl font-serif text-[#2C4A3B]">
                {activeCategoryObj?.name || 'Menu Items'}
              </h3>
              <span className="text-xs sm:text-sm text-[#6b6259] font-medium bg-[#e7e1d2] px-2.5 py-1 rounded-full">
                {displayedItems.length} {displayedItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {activeCategoryObj?.name.includes('Festival') || activeCategoryObj?.slug.includes('festival') ? (
              <div className="text-center py-12 bg-[#faf6ee] rounded-[14px] border border-[rgba(35,31,26,0.08)] shadow-sm">
                <h3 className="text-xl text-[#3E2C22] mb-4">See our festival specials</h3>
                <BrandButton variant="primary" to="/festivals">View Festival Specials</BrandButton>
              </div>
            ) : isLoadingProducts ? (
              <MinimalLoader text="Loading Products..." />
            ) : displayedItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-[#faf6ee] rounded-[14px] border border-[rgba(35,31,26,0.08)] shadow-sm">
                No items available in this category right now.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
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
              <div key={item.id} className="bg-[#faf6ee] border border-[rgba(35,31,26,0.08)] rounded-[14px] shadow-[0px_2px_10px_0px_rgba(138,75,38,0.08),0px_1px_2px_0px_rgba(138,75,38,0.06)] flex flex-col h-full overflow-hidden hover:shadow-[0px_4px_14px_0px_rgba(138,75,38,0.12)] transition-shadow">
                {/* Image Container */}
                <div className="p-2 sm:p-2.5">
                  <div 
                    className="bg-[#e7e1d2] rounded-[10px] overflow-hidden relative aspect-square flex items-center justify-center cursor-pointer group"
                    onClick={() => setSelectedProduct(item)}
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!isOrderable ? 'grayscale opacity-70' : ''}`} />
                    ) : (
                      <span className="text-[11px] sm:text-xs text-[#6b6259] italic text-center px-2">Image of {item.name}</span>
                    )}
                    {/* Top Badges (Sale & Tag) */}
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1.5 z-10 pointer-events-none">
                      <div>
                        {(item.isOnSale || item.saleStatus === 'LIVE') && (
                          <span className="inline-block bg-[#b23a2e] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                            Sale
                          </span>
                        )}
                        {(item.saleStatus === 'COMING_SOON' || (isFuture && !item.isOnSale)) && (
                          <span className="inline-block bg-[#2f4a3c] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                            Soon
                          </span>
                        )}
                      </div>
                      {item.tag && (
                        <span className="inline-block bg-[#2f4a3c] text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm tracking-wide truncate max-w-[95px] sm:max-w-[120px]" title={item.tag}>
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Out of Stock Centered Overlay */}
                    {item.isAvailable === false && (
                      <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[0.5px] flex items-center justify-center p-2 pointer-events-none">
                        <span className="bg-[#b23a2e] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider border border-white/20">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Content */}
                <div className="px-2.5 sm:px-3.5 pb-3 sm:pb-3.5 pt-1 sm:pt-1.5 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-1.5 mb-1">
                    <h3 
                      onClick={() => setSelectedProduct(item)}
                      className="text-xs sm:text-sm lg:text-base font-semibold font-serif text-[#2f4a3c] hover:text-[#b9925b] leading-snug line-clamp-2 min-h-[28px] sm:min-h-[36px] flex-grow cursor-pointer transition-colors" 
                      title={item.name}
                    >
                      {item.name}
                    </h3>
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
          </div>
          </>
        )}

        <div className="mt-12 text-center text-gray-500 italic text-sm">
          Menu items and availability may change. Contact us for the latest offerings.
        </div>

        {/* Product Details Bottom Sheet / Modal */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isCartEnabled={isCartEnabled}
          onAddToCart={addToCart}
        />
      </SectionContainer>
    </>
  );
}
