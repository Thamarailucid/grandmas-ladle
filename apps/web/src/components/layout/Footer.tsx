import { Link } from 'react-router-dom';
import { useBusinessSettingsContext } from '../../contexts/BusinessSettingsContext';
import { InstagramOutlined, FacebookOutlined, WhatsAppOutlined, PhoneOutlined } from '@ant-design/icons';

export function Footer() {
  const { 
    phone, 
    whatsapp, 
    email, 
    address, 
    fssaiNumber, 
    instagramUrl, 
    facebookUrl,
    tagline
  } = useBusinessSettingsContext();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green text-warm-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif tracking-wide mb-3">GRANDMA'S LADLE</h2>
            <p className="text-sm italic mb-2 text-warm-cream/80">{tagline}</p>
            <p className="text-xs uppercase tracking-widest text-antique-brass">Homemade • Pure • Wholesome</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-4 text-antique-brass">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/our-story" className="hover:text-antique-brass transition-colors">Our Story</Link></li>
              <li><Link to="/menu" className="hover:text-antique-brass transition-colors">Menu</Link></li>
              <li><Link to="/corporate" className="hover:text-antique-brass transition-colors">Corporate</Link></li>
              <li><Link to="/festivals" className="hover:text-antique-brass transition-colors">Festivals</Link></li>
              <li><Link to="/visit-us" className="hover:text-antique-brass transition-colors">Visit Us</Link></li>
              <li><Link to="/contact" className="hover:text-antique-brass transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Order & Contact */}
          <div>
            <h3 className="text-lg font-serif mb-4 text-antique-brass">Order & Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-antique-brass transition-colors">
                  <WhatsAppOutlined className="mr-2 text-lg" /> Order on WhatsApp
                </a>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex items-center hover:text-antique-brass transition-colors">
                  <PhoneOutlined className="mr-2" /> {phone}
                </a>
              </li>
              <li className="pt-2">
                <a href={`mailto:${email}`} className="hover:text-antique-brass transition-colors">{email}</a>
              </li>
              <li className="pt-2 text-warm-cream/80 whitespace-pre-line">
                {address}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-serif mb-4 text-antique-brass">Follow Us</h3>
            <div className="flex space-x-4">
              <a href={instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-antique-brass transition-colors">
                <InstagramOutlined />
              </a>
              <a href={facebookUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-antique-brass transition-colors">
                <FacebookOutlined />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-warm-cream/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-warm-cream/60 space-y-2 md:space-y-0">
          <p>© {currentYear} Grandma's Ladle. All rights reserved.</p>
          <p>
            Designed & Developed by{' '}
            <a href="https://novacodex.in" target="_blank" rel="noopener noreferrer" className="hover:text-antique-brass transition-colors font-medium">
              NovaCodex
            </a>
          </p>
          <p>FSSAI Reg. No. {fssaiNumber} · Udyam (MSME) Registered</p>
        </div>
      </div>
    </footer>
  );
}
