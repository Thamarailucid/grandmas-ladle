import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppFAB } from '../common/WhatsAppFAB';
import { BusinessSettingsProvider, useBusinessSettingsContext } from '../../contexts/BusinessSettingsContext';

import { FloatingSaleWidget } from './FloatingSaleWidget';

function LayoutContent() {
  const { isAnnouncementActive, announcementText, saleStartDate, saleEndDate } = useBusinessSettingsContext();
  
  let shouldShowAnnouncement = !!(isAnnouncementActive && announcementText);
  if (announcementText && saleStartDate) {
    const now = new Date();
    const end = saleEndDate ? new Date(saleEndDate) : null;
    if (end && now > end) {
      shouldShowAnnouncement = false;
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-warm-cream text-dark-brown relative">
      <Header />
      <main className={`flex-grow transition-all duration-300 ${shouldShowAnnouncement ? 'pt-[116px]' : 'pt-[88px]'}`}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
      <FloatingSaleWidget />
    </div>
  );
}

export function PublicLayout() {
  return (
    <BusinessSettingsProvider>
      <LayoutContent />
    </BusinessSettingsProvider>
  );
}

