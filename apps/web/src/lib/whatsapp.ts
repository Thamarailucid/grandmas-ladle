import { config } from '@/config/env';

export function createWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${config.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function createWhatsAppOrderUrl(productName: string, quantity?: number): string {
  const msg = quantity
    ? `Hi, I'd like to order ${quantity}x ${productName} from Grandma's Ladle.`
    : `Hi, I'd like to order ${productName} from Grandma's Ladle.`;
  return createWhatsAppUrl(msg);
}

export function createWhatsAppBulkOrderUrl(items: { name: string, quantity: number, price: number }[], total: number): string {
  let msg = `Hi Grandma's Ladle! I'd like to place an order:\n\n`;
  items.forEach(item => {
    msg += `• ${item.quantity}x ${item.name} (₹${item.price * item.quantity})\n`;
  });
  msg += `\n*Total: ₹${total}*\n\nPlease let me know how to proceed with the payment.`;
  return createWhatsAppUrl(msg);
}
