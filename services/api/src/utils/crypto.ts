import crypto from 'crypto';
import { env } from '../config/env.js';

// Derive a 32-byte key from the JWT_ACCESS_SECRET
const ALGORITHM = 'aes-256-gcm';
const MASTER_KEY = crypto.scryptSync(env.JWT_ACCESS_SECRET, 'grandmas-salt', 32);

export const encrypt = (text: string): string => {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encryptedText
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decrypt = (text: string): string => {
  if (!text) return text;
  try {
    const parts = text.split(':');
    if (parts.length !== 3) return text; // Probably unencrypted

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, MASTER_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return ''; // Do not return raw if it failed decrypting
  }
};
