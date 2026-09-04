// Simple auth store without requiring Redux/Zustand initially
let accessToken: string | null = localStorage.getItem('admin_access_token');
let user: any | null = null; // Will refine type later

export function setAuth(token: string, userData: any) {
  accessToken = token;
  user = userData;
  localStorage.setItem('admin_access_token', token);
}

export function clearAuth() {
  accessToken = null;
  user = null;
  localStorage.removeItem('admin_access_token');
}

export function getAccessToken() {
  return accessToken;
}

export function isAuthenticated() {
  return !!accessToken;
}

export function getUser() {
  return user;
}
