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

    const publicData = result.data
      .filter((d: any) => d.isListed !== false)
      .map((d: any) => {
      // Determine if product is in an active global campaign
      const isInCampaignSale = isGlobalCampaignActive && saleProductIds.includes(d.id);
      
      const start = d.offerStartDate ? new Date(d.offerStartDate) : null;
      const end = d.offerEndDate ? new Date(d.offerEndDate) : null;
      
      let saleStatus: 'LIVE' | 'COMING_SOON' | 'ENDED' | null = null;
      
      if (d.isOnSale || isInCampaignSale) {
        saleStatus = 'LIVE';
      } else if (start && end) {
        if (now >= start && now <= end) {
          saleStatus = 'LIVE';
        } else if (now < start) {
          saleStatus = 'COMING_SOON';
        } else if (now > end) {
          saleStatus = 'ENDED';
        }
      } else if (start && !end) {
        if (now >= start) {
          saleStatus = 'LIVE';
        } else {
          saleStatus = 'COMING_SOON';
        }
      } else if (!start && end) {
        if (now <= end) {
          saleStatus = 'LIVE';
        } else {
          saleStatus = 'ENDED';
        }
      }

      const isLive = saleStatus === 'LIVE';
      const isComingSoon = saleStatus === 'COMING_SOON';

      // Calculate effective prices
      let currentPrice = d.price;
      let displayOriginalPrice = d.originalPrice; // Always show MRP if set
      let effectiveOfferPrice = null;

      if (isLive && d.offerPrice) {
        currentPrice = d.offerPrice; // Drop the current price to the offer price during live sale
        if (!displayOriginalPrice) {
          displayOriginalPrice = d.price;
        }
        effectiveOfferPrice = d.offerPrice;
      } else if (isComingSoon && d.offerPrice) {
        effectiveOfferPrice = d.offerPrice;
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
        offerPrice: effectiveOfferPrice,
        imageUrl: d.imageUrl,
        isAvailable: d.isAvailable !== false,
        isVegetarian: d.isVegetarian !== false,
        isOnSale: isLive,
        saleStatus,
        spiceLevel: d.spiceLevel ?? 0,
        preparationTimeMinutes: d.preparationTimeMinutes ?? 0,
        portionSize: d.portionSize,
        unit: d.unit,
        tag: d.tag,
        offerStartDate: (isLive || isComingSoon) ? d.offerStartDate : null,
        offerEndDate: (isLive || isComingSoon) ? d.offerEndDate : null,
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
