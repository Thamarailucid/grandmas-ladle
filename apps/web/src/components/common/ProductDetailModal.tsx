import React, { useState } from 'react';
import { createWhatsAppOrderUrl } from '@/lib/whatsapp';
import toast from 'react-hot-toast';

interface ProductDetailModalProps {
  product: any | null;
  onClose: () => void;
  isCartEnabled?: boolean;
  onAddToCart?: (product: any) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  isCartEnabled = true,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isAvailable = product.isAvailable !== false;
  const isSale = product.isOnSale || product.saleStatus === 'LIVE';
  const discountPercent =
    product.originalPrice && product.price && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-all animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-[#faf6ee] w-full max-w-lg rounded-t-[24px] sm:rounded-[20px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#e7e1d2] animate-in slide-in-from-bottom duration-300">
        
        {/* Mobile Drag Handle */}
        <div className="pt-2.5 pb-1 sm:hidden flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Modal Header Bar with Close Button */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors shadow-md backdrop-blur-xs"
            aria-label="Close dialog"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Product Image Banner */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-[#e7e1d2] overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-70' : ''}`}
              />
            ) : (
              <span className="text-sm text-[#6b6259] italic">Grandma's Ladle Homemade Special</span>
            )}

            {/* Badges on Image */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
              {isSale && (
                <span className="bg-[#b23a2e] text-white text-xs font-bold px-2.5 py-0.5 rounded shadow-md uppercase tracking-wider">
                  Sale {discountPercent ? `• ${discountPercent}% OFF` : ''}
                </span>
              )}
              {product.tag && (
                <span className="bg-[#2f4a3c] text-white text-xs font-medium px-2.5 py-0.5 rounded shadow-md tracking-wide">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Out of Stock Centered Banner */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                <span className="bg-[#b23a2e] text-white text-sm font-bold px-4 py-1.5 rounded-md shadow-lg uppercase tracking-wider border border-white/20">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-grow">
          {/* Title & Veg Mark */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#2C4A3B] leading-snug">
              {product.name}
            </h2>
            {/* Veg / Non-Veg Indicator */}
            <div
              className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 border-2 ${
                product.isVegetarian !== false ? 'border-[#16a34a]' : 'border-[#dc2626]'
              } rounded-sm p-[2px] flex items-center justify-center bg-white mt-1`}
              title={product.isVegetarian !== false ? 'Pure Vegetarian' : 'Non-Vegetarian'}
            >
              <div
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                  product.isVegetarian !== false ? 'bg-[#16a34a]' : 'bg-[#dc2626]'
                }`}
              />
            </div>
          </div>

          {/* Pricing & Portion */}
          <div className="flex flex-wrap items-baseline gap-2.5 pb-2 border-b border-[#e7e1d2]">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm sm:text-base">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="text-[#b9925b] font-bold text-xl sm:text-2xl font-serif">
              ₹{product.price}
            </span>
            {product.unit && (
              <span className="text-[#6b6259] text-xs sm:text-sm font-medium bg-[#e7e1d2] px-2 py-0.5 rounded">
                {product.unit}
              </span>
            )}
            {discountPercent && (
              <span className="text-green-700 bg-green-50 border border-green-200 text-xs font-semibold px-2 py-0.5 rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#6b6259] uppercase tracking-wider">
              Product Description
            </h4>
            <p className="text-[#3E2C22] text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {product.description || product.shortDescription || 'Prepared traditionally with authentic recipes and pure ingredients.'}
            </p>
          </div>

          {/* Quantity Selector (if orderable) */}
          {isAvailable && (
            <div className="pt-2 flex items-center justify-between bg-white/70 p-3 rounded-lg border border-[#e7e1d2]">
              <span className="text-xs sm:text-sm font-semibold text-[#2C4A3B]">Select Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-100 text-gray-700"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-[#2C4A3B]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-100 text-gray-700"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons (Fixed Bottom on mobile) */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#e7e1d2] flex gap-2 sm:gap-3">
          {isAvailable ? (
            <>
              <a
                href={createWhatsAppOrderUrl(product.name, quantity)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#b9925b] hover:bg-[#a67f4e] text-white font-semibold py-2.5 sm:py-3 px-3 rounded-[10px] transition-colors text-xs sm:text-sm shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Order on WhatsApp (₹{product.price * quantity})</span>
              </a>

              {isCartEnabled && onAddToCart && (
                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                    toast.success(`${quantity}x ${product.name} added to cart!`);
                    onClose();
                  }}
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#b9925b] text-[#b9925b] hover:bg-[#b9925b] hover:text-white rounded-[10px] transition-colors font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full text-center py-2.5 sm:py-3 rounded-[10px] border border-gray-300 text-gray-400 text-xs sm:text-sm font-semibold cursor-not-allowed">
              CURRENTLY OUT OF STOCK
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
