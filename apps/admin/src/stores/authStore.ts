import { secureStorage } from '@/lib/secureStorage';

// Auth store with AES-encrypted localStorage persistence and JWT expiration verification
let accessToken: string | null = secureStorage.getItem<string>('admin_access_token');
let user: any | null = secureStorage.getItem<any>('admin_user');

/**
 * Checks whether a JWT token has expired.
 * Parses the base64 payload and compares the `exp` timestamp with current time.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    // Current time in ms vs expiration in ms
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function setAuth(token: string, userData: any) {
  accessToken = token;
  user = userData;
  // Encrypt and store both token and user profile into localStorage
  secureStorage.setItem('admin_access_token', token);
  if (userData) {
    secureStorage.setItem('admin_user', userData);
  }
}

export function clearAuth() {
  accessToken = null;
  user = null;
  secureStorage.removeItem('admin_access_token');
  secureStorage.removeItem('admin_user');
}

export function getAccessToken(): string | null {
  if (!accessToken) {
    accessToken = secureStorage.getItem<string>('admin_access_token');
  }
  if (accessToken && isTokenExpired(accessToken)) {
    clearAuth();
    return null;
  }
  return accessToken;
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  return !!token;
}

export function getUser(): any | null {
  if (!user) {
    user = secureStorage.getItem<any>('admin_user');
  }
  return user;
}

export { secureStorage };
