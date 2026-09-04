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

  // Header height at initial load (unscrolled):
  // without announcement: 72px mobile, 80px desktop -> 'pt-[72px] md:pt-[80px]'
  // with announcement (32px): 104px mobile, 112px desktop -> 'pt-[104px] md:pt-[112px]'
  const paddingTopClass = shouldShowAnnouncement 
    ? 'pt-[104px] md:pt-[112px]' 
    : 'pt-[72px] md:pt-[80px]';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-warm-cream text-dark-brown relative">
      <Header />
      <main className={`flex-grow ${paddingTopClass}`}>
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

