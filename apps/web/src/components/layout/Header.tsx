import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer } from 'antd';
import { ShoppingCartOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useBusinessSettingsContext } from '../../contexts/BusinessSettingsContext';
import { useCart } from '../../contexts/CartContext';
import Marquee from 'react-fast-marquee';
import { createWhatsAppBulkOrderUrl } from '../../lib/whatsapp';
import logoImg from '@/assets/logo.jpg';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAnnouncementActive, announcementText, announcementLink, isCartEnabled, saleStartDate, saleEndDate } = useBusinessSettingsContext();
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let displayAnnouncementText = announcementText;
  let shouldShowAnnouncement = !!(isAnnouncementActive && announcementText);

  if (announcementText && saleStartDate) {
    const now = new Date();
    const start = new Date(saleStartDate);
    const end = saleEndDate ? new Date(saleEndDate) : null;
    
    if (now < start) {
      displayAnnouncementText = `COMING SOON - ${announcementText}`;
    } else if (now >= start && (!end || now <= end)) {
      displayAnnouncementText = `LIVE NOW - ${announcementText}`;
    } else if (end && now > end) {
      shouldShowAnnouncement = false;
    }
  }

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'OUR STORY', path: '/our-story' },
    { label: 'MENU', path: '/menu' },
    { label: 'CORPORATE', path: '/corporate' },
    { label: 'FESTIVALS', path: '/festivals' },
    { label: 'VISIT US', path: '/visit-us' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-warm-cream border-b border-antique-brass/20 ${
        isScrolled && !shouldShowAnnouncement ? 'shadow-md' : ''
      }`}
    >
      {shouldShowAnnouncement && (
        <div 
          className="bg-brand-green text-white text-xs sm:text-sm h-8 flex items-center cursor-pointer hover:bg-opacity-90 transition-colors overflow-hidden"
          onClick={() => announcementLink && navigate(announcementLink)}
        >
          <Marquee speed={40} gradient={false}>
            <span className="mx-4 font-medium tracking-wide uppercase">{displayAnnouncementText}</span>
            <span className="mx-4 font-medium tracking-wide uppercase">{displayAnnouncementText}</span>
            <span className="mx-4 font-medium tracking-wide uppercase">{displayAnnouncementText}</span>
          </Marquee>
        </div>
      )}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16 md:h-18' : 'h-[72px] md:h-[80px]'}`}>
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src={logoImg} 
            alt="Grandma's Ladle Logo" 
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm border border-[#B8925A]/40 group-hover:scale-105 transition-transform"
          />
          <span className="text-xl md:text-2xl font-serif text-brand-green tracking-wide">
            GRANDMA'S LADLE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-sm font-medium text-dark-brown hover:text-brand-green transition-colors uppercase tracking-widest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isCartEnabled && (
            <button 
              onClick={() => setCartOpen(true)}
              className="text-dark-brown hover:text-brand-green relative p-2"
            >
              <ShoppingCartOutlined className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}
          <Link
            to="/menu"
            className="bg-antique-brass text-dark-brown px-6 py-2.5 rounded text-sm font-medium uppercase tracking-wider hover:bg-opacity-90 transition-colors"
          >
            ORDER NOW
          </Link>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex items-center space-x-2 md:hidden">
          {isCartEnabled && (
            <button 
              onClick={() => setCartOpen(true)}
              className="text-dark-brown relative p-2"
            >
              <ShoppingCartOutlined className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}
          <button
            className="text-brand-green text-xl p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuOutlined />
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <Drawer
          placement="right"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          closeIcon={<CloseOutlined className="text-brand-green" />}
          width={280}
          styles={{ body: { backgroundColor: '#FAF4E6' }, header: { backgroundColor: '#FAF4E6' } }}
        >
          <div className="flex flex-col space-y-6 mt-4">
            <div className="flex items-center gap-3 pb-4 border-b border-antique-brass/20">
              <img src={logoImg} alt="Grandma's Ladle" className="w-12 h-12 rounded-full object-cover shadow-sm border border-[#B8925A]/40" />
              <div>
                <div className="font-serif font-bold text-brand-green text-lg leading-tight">Grandma's Ladle</div>
                <div className="text-xs text-[#B85C3E] uppercase tracking-wider">Homemade Goodness</div>
              </div>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-lg font-medium text-dark-brown hover:text-brand-green uppercase tracking-widest"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/menu"
              className="mt-6 bg-antique-brass text-dark-brown text-center py-3 rounded font-medium uppercase tracking-wider"
              onClick={() => setMobileMenuOpen(false)}
            >
              ORDER NOW
            </Link>
          </div>
        </Drawer>

        {/* Cart Drawer */}
        <Drawer
          title="Your Cart"
          placement="right"
          onClose={() => setCartOpen(false)}
          open={cartOpen}
          closeIcon={<CloseOutlined className="text-brand-green" />}
          width={320}
        >
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
              {items.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">Your cart is empty.</div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center mb-4 pb-4 border-b gap-3">
                    <div className="w-16 h-16 bg-[#EDE8DC] rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] italic">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold font-fraunces text-[#2C4A3B] truncate">{item.product.name}</div>
                      <div className="text-sm text-[#B8925A] font-medium">₹{item.product.price}</div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 border border-[#B8925A] text-[#B8925A] rounded flex items-center justify-center hover:bg-[#B8925A] hover:text-white transition-colors">-</button>
                      <span className="font-medium text-[#2C4A3B] w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 border border-[#B8925A] text-[#B8925A] rounded flex items-center justify-center hover:bg-[#B8925A] hover:text-white transition-colors">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="pt-4 border-t mt-auto">
                <div className="flex justify-between font-bold mb-4 text-lg">
                  <span>Total:</span>
                  <span>₹{totalPrice}</span>
                </div>
                <a
                  href={createWhatsAppBulkOrderUrl(
                    items.map(i => ({ name: i.product.name, quantity: i.quantity, price: Number(i.product.price) })),
                    totalPrice
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#2C4A3B] text-white text-center py-3 rounded uppercase font-bold tracking-wider hover:bg-opacity-90 transition-colors"
                >
                  Checkout via WhatsApp
                </a>
                <button 
                  onClick={clearCart}
                  className="w-full text-center text-red-500 mt-4 text-sm underline"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </Drawer>
      </div>
    </header>
  );
}
