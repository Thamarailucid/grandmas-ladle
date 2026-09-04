import { Request, Response, NextFunction } from 'express';
import * as productService from './product.service.js';
import * as salesCampaignRepo from '../salesCampaigns/salesCampaign.repository.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

export const getPublicProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getProducts(req.query);
    
    // Fetch active sales campaign
    const activeCampaign = await salesCampaignRepo.getActiveCampaign();
    
    const now = new Date();
    
    let saleProductIds: string[] = [];
    let isGlobalCampaignActive = false;
    
    if (activeCampaign && activeCampaign.isGlobalSaleActive) {
      const start = activeCampaign.startDate ? new Date(activeCampaign.startDate) : null;
      const end = activeCampaign.endDate ? new Date(activeCampaign.endDate) : null;
      
      isGlobalCampaignActive = (!start || now >= start) && (!end || now <= end);
      saleProductIds = activeCampaign.productIds || [];
    }

    const publicData = result.data.map((d: any) => {
      // Determine if product is actively on sale
      const isInCampaignSale = isGlobalCampaignActive && saleProductIds.includes(d.id);
      
      const isItemSaleActive = d.offerStartDate && d.offerEndDate &&
        now >= new Date(d.offerStartDate) && now <= new Date(d.offerEndDate);
      
      const isSaleActive = isInCampaignSale || isItemSaleActive;
      
      // Calculate effective prices
      let currentPrice = d.price;
      let displayOriginalPrice = d.originalPrice; // Always show MRP if set
      
      if (isSaleActive && d.offerPrice) {
        currentPrice = d.offerPrice; // Drop the current price to the offer price during sale
        // If no originalPrice (MRP) is set, show the regular price as strikethrough
        if (!displayOriginalPrice) {
          displayOriginalPrice = d.price;
        }
      }
      
      return {
        id: d.id,
        categoryId: d.categoryId,
        categoryName: d.categoryName,
        name: d.name,
        slug: d.slug,
        description: d.description,
        shortDescription: d.shortDescription,
        price: currentPrice,
        originalPrice: displayOriginalPrice,
        imageUrl: d.imageUrl,
        portionSize: d.portionSize,
        unit: d.unit,
        tag: d.tag,
        offerStartDate: d.offerStartDate,
        offerEndDate: d.offerEndDate,
        isOnSale: isSaleActive && d.offerPrice != null,
      };
    });
    res.status(200).json({ success: true, data: publicData, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request<{ productId: string }>, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request<{ productId: string }>, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(req.params.productId, req.body);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProductAvailability = async (req: Request<{ productId: string }>, res: Response, next: NextFunction) => {
  try {
    const { isAvailable } = req.body;
    const product = await productService.updateProductAvailability(req.params.productId, isAvailable);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request<{ productId: string }>, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.productId);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
