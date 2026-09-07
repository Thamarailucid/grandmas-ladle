import { config } from '@/config/env';

export function formatWhatsAppNumber(phone?: string): string {
  if (!phone) return '+919841207516';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (digits.length > 0) {
    return digits.startsWith('+') ? digits : `+${digits}`;
  }
  return '+919841207516';
}

export function formatPhoneTel(phone?: string): string {
  if (!phone) return '+919841207516';
  const clean = phone.replace(/[^0-9+]/g, '');
  if (clean.startsWith('+')) return clean;
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  return `+${digits}`;
}

export function formatDisplayPhone(phone?: string): string {
  if (!phone) return '+91 9841207516';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`;
  }
  if (digits.length > 0) {
    return `+91 ${digits}`;
  }
  return '+91 9841207516';
}

export function createWhatsAppUrl(message?: string, customPhone?: string): string {
  const num = formatWhatsAppNumber(customPhone || config.whatsappNumber);
  const base = `https://wa.me/${num}`;
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
