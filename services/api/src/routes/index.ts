import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import categoryRoutes from '../modules/categories/category.routes.js';
import businessSettingRoutes from '../modules/businessSettings/businessSetting.routes.js';
import marketingSettingRoutes from '../modules/marketingSettings/marketingSettings.routes.js';
import faqRoutes from '../modules/faqs/faq.routes.js';
import reviewRoutes from '../modules/reviews/review.routes.js';
import uploadRoutes from '../modules/upload/upload.routes.js';
import heroSlideRoutes from '../modules/heroSlides/heroSlide.routes.js';

import cartRoutes from '../modules/cart/cart.routes.js';
import contactEnquiryRoutes from '../modules/contactEnquiries/contactEnquiry.routes.js';
import corporateEnquiryRoutes from '../modules/corporateEnquiries/corporateEnquiry.routes.js';
import festivalRoutes from '../modules/festivals/festival.routes.js';
import orderRoutes from '../modules/orders/order.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import salesCampaignRoutes from '../modules/salesCampaigns/salesCampaign.routes.js';

const router = Router();

router.use('/Auth', authRoutes);
router.use('/Product', productRoutes);
router.use('/ProductCategory', categoryRoutes);
router.use('/BusinessSetting', businessSettingRoutes);
router.use('/MarketingSetting', marketingSettingRoutes);
router.use('/SalesCampaign', salesCampaignRoutes);
router.use('/Faq', faqRoutes);
router.use('/Review', reviewRoutes);
router.use('/Upload', uploadRoutes);
router.use('/HeroSlide', heroSlideRoutes);

// Stubs for remaining modules
router.use('/Cart', cartRoutes);
router.use('/ContactEnquiry', contactEnquiryRoutes);
router.use('/CorporateEnquiry', corporateEnquiryRoutes);
router.use('/Festival', festivalRoutes);
router.use('/Order', orderRoutes);
router.use('/User', userRoutes);

export default router;
