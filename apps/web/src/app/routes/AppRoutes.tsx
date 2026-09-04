import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const OurStoryPage = lazy(() => import('@/features/story/pages/OurStoryPage'));
const MenuPage = lazy(() => import('@/features/menu/pages/MenuPage'));
const SalePage = lazy(() => import('@/features/menu/pages/SalePage'));
const CorporatePage = lazy(() => import('@/features/corporate/pages/CorporatePage'));
const FestivalsPage = lazy(() => import('@/features/festivals/pages/FestivalsPage'));
const VisitUsPage = lazy(() => import('@/features/visitUs/pages/VisitUsPage'));
const ContactPage = lazy(() => import('@/features/contact/pages/ContactPage'));
const FaqPage = lazy(() => import('@/features/faq/pages/FaqPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-brand-green">Loading...</div>}>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/corporate" element={<CorporatePage />} />
          <Route path="/festivals" element={<FestivalsPage />} />
          <Route path="/visit-us" element={<VisitUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
