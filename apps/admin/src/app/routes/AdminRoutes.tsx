import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

import LoginPage from '@/features/auth/pages/LoginPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import ProductsPage from '@/features/products/pages/ProductsPage';
import CategoriesPage from '@/features/categories/pages/CategoriesPage';
import FestivalsPage from '@/features/festivals/pages/FestivalsPage';
import OrdersPage from '@/features/orders/pages/OrdersPage';
import CorporateEnquiriesPage from '@/features/corporateEnquiries/pages/CorporateEnquiriesPage';
import ContactEnquiriesPage from '@/features/contactEnquiries/pages/ContactEnquiriesPage';
import ReviewsPage from '@/features/reviews/pages/ReviewsPage';
import FaqsPage from '@/features/faqs/pages/FaqsPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';
import MarketingPage from '@/features/marketing/pages/MarketingPage';
import HeroSliderPage from '@/features/marketing/pages/HeroSliderPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';

export function AdminRoutes() {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="festivals" element={<FestivalsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="corporate-enquiries" element={<CorporateEnquiriesPage />} />
          <Route path="contact-enquiries" element={<ContactEnquiriesPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="faqs" element={<FaqsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="hero-slider" element={<HeroSliderPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}
