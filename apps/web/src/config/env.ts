export const config = {
  appName: import.meta.env.VITE_APP_NAME || "Grandma's Ladle",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919841207516',
} as const;
