import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export const createProductSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  shortDescription: z.string().trim().max(255).optional(),
  description: z.string().trim().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  portionSize: z.string().trim().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export const updateProductSchema = createProductSchema.partial();

export const createProductCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().optional()
});

export const createFestivalSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().optional(),
  bannerImageUrl: z.string().url().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerPhone: z.string().trim().min(1, "Customer phone is required"),
  customerEmail: z.string().trim().email().optional(),
  deliveryAddress: z.string().trim().optional(),
  orderType: z.enum(['pickup', 'delivery']),
  notes: z.string().trim().optional(),
  items: z.array(z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().min(1, "Quantity must be at least 1")
  })).min(1, "Order must contain at least one item")
});

export const createCorporateEnquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  company: z.string().trim().min(1, "Company is required"),
  designation: z.string().trim().optional(),
  phone: z.string().trim().min(1, "Phone is required"),
  email: z.string().trim().email("Invalid email"),
  numberOfPeople: z.number().int().min(1, "Number of people must be at least 1"),
  dateRequired: z.string().datetime(),
  preferredDeliveryPickupTime: z.string().trim().optional(),
  itemsInterestedIn: z.string().trim().optional(),
  budgetPerPerson: z.number().min(0).optional(),
  specialRequirements: z.string().trim().optional()
});

export const createContactEnquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(1, "Message is required")
});

export const createReviewSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerLocation: z.string().trim().optional(),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(1, "Content is required"),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export const createFaqSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export const updateBusinessSettingsSchema = z.object({
  businessName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  address: z.string().trim().optional(),
  openingHours: z.string().trim().optional(),
  googleMapsUrl: z.string().url().optional().nullable(),
  instagramUrl: z.string().url().optional().nullable(),
  facebookUrl: z.string().url().optional().nullable(),
  swiggyUrl: z.string().url().optional().nullable(),
  zomatoUrl: z.string().url().optional().nullable(),
  deliveryInformation: z.string().trim().optional().nullable(),
  fssaiNumber: z.string().trim().optional().nullable(),
  udyamRegistered: z.boolean().optional(),
  openingSoonEnabled: z.boolean().optional(),
  openingDate: z.string().datetime().optional().nullable()
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional()
});
