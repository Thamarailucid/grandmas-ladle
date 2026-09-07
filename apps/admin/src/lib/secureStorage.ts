import CryptoJS from 'crypto-js';

// Secret key used for client-side AES encryption of sensitive localStorage items
const ENCRYPTION_KEY = 'grandmas_ladle_secure_vault_key_2026_aes';
const ENCRYPTED_PREFIX = 'enc::';

/**
 * Encrypts a plain text string using AES.
 */
export function encryptData(text: string): string {
  try {
    const ciphertext = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    return `${ENCRYPTED_PREFIX}${ciphertext}`;
  } catch (err) {
    console.error('Encryption error:', err);
    return text;
  }
}

/**
 * Decrypts an AES encrypted string.
 * Gracefully falls back to plain text if string is not encrypted.
 */
export function decryptData(cipherOrPlain: string): string {
  if (!cipherOrPlain) return '';
  try {
    let ciphertext = cipherOrPlain;
    if (cipherOrPlain.startsWith(ENCRYPTED_PREFIX)) {
      ciphertext = cipherOrPlain.slice(ENCRYPTED_PREFIX.length);
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // If decryption yielded a valid UTF-8 string, return it
    if (decrypted) {
      return decrypted;
    }
    // Fallback: value might have been stored unencrypted previously
    return cipherOrPlain;
  } catch {
    // Return original string if decryption fails (backwards compatibility)
    return cipherOrPlain;
  }
}

/**
 * Secure wrapper around window.localStorage with automatic AES encryption on write
 * and AES decryption on read.
 */
export const secureStorage = {
  /**
   * Encrypts and stores any value (string, object, number, boolean) into localStorage.
   */
  setItem(key: string, value: any): void {
    try {
      const rawString = typeof value === 'string' ? value : JSON.stringify(value);
      const encryptedValue = encryptData(rawString);
      localStorage.setItem(key, encryptedValue);
    } catch (err) {
      console.error(`Error saving encrypted key "${key}" to localStorage:`, err);
    }
  },

  /**
   * Retrieves and decrypts a value from localStorage.
   * If parsing as JSON is possible, returns the parsed object; otherwise returns raw decrypted string.
   */
  getItem<T = any>(key: string): T | null {
    try {
      const storedVal = localStorage.getItem(key);
      if (storedVal === null || storedVal === undefined) {
        return null;
      }

      const decrypted = decryptData(storedVal);
      if (!decrypted) {
        return null;
      }

      // Try parsing as JSON (for stored objects/arrays/numbers)
      try {
        return JSON.parse(decrypted) as T;
      } catch {
        return decrypted as unknown as T;
      }
    } catch (err) {
      console.error(`Error reading/decrypting key "${key}" from localStorage:`, err);
      return null;
    }
  },

  /**
   * Removes a key from localStorage.
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Clears all localStorage data.
   */
  clear(): void {
    localStorage.clear();
  },

  /**
   * Checks if a key exists in localStorage.
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },
};

export default secureStorage;
