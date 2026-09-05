import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ApiListResponse } from '@grandmas-ladle/shared';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('grandmas_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch live products on load to sync cart prices without repeated calls
  const { data: liveProducts } = useQuery<Product[]>({
    queryKey: ['public-products'],
    queryFn: async () => {
      const res = await apiClient.get<ApiListResponse<Product>>('/Product/GetPublicProducts');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours cache - only fetch once per day/session
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Auto-sync cart items with live prices and stock availability whenever fresh products are loaded
  useEffect(() => {
    if (!liveProducts || liveProducts.length === 0) return;

    setItems(currentItems => {
      let hasChanges = false;
      const updated = currentItems.map(item => {
        const fresh = liveProducts.find(p => p.id === item.product.id);
        if (fresh) {
          const freshPrice = Number(fresh.price);
          const currentPrice = Number(item.product.price);
          if (
            freshPrice !== currentPrice ||
            fresh.isAvailable !== item.product.isAvailable ||
            fresh.name !== item.product.name ||
            fresh.imageUrl !== item.product.imageUrl ||
            fresh.isOnSale !== item.product.isOnSale
          ) {
            hasChanges = true;
            return {
              ...item,
              product: {
                ...item.product,
                ...fresh,
                price: freshPrice,
              },
            };
          }
        }
        return item;
      });

      return hasChanges ? updated : currentItems;
    });
  }, [liveProducts]);

  useEffect(() => {
    localStorage.setItem('grandmas_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems(current => {
      const existing = current.find(item => item.product.id === product.id);
      if (existing) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, product, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(current => current.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
