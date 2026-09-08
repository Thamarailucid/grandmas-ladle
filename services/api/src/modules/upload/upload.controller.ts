import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../errors/AppError.js';
import { env } from '../../config/env.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to check if an AWS key is a template placeholder or empty
const isPlaceholderKey = (key?: string) => {
  if (!key) return true;
  const lower = key.toLowerCase().trim();
  return (
    lower.length === 0 ||
    lower.includes('your-access-key') ||
    lower.includes('your-secret-key') ||
    lower.includes('change-this') ||
    lower === 'undefined' ||
    lower === 'null'
  );
};

// S3 is only active if running in production with real, non-placeholder credentials
const isS3Configured = Boolean(
  env.NODE_ENV === 'production' &&
  env.AWS_REGION &&
  env.AWS_BUCKET_NAME &&
  env.AWS_ACCESS_KEY_ID &&
  env.AWS_SECRET_ACCESS_KEY &&
  !isPlaceholderKey(env.AWS_ACCESS_KEY_ID) &&
  !isPlaceholderKey(env.AWS_SECRET_ACCESS_KEY)
);

// Setup AWS S3 Client only when valid credentials exist
const s3Client = isS3Configured
  ? new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  : null;

// Configure multer to store in memory first so we can process with sharp
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max limit for the raw upload
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw AppError.badRequest('No image file provided');
    }

    const file = req.file;
    const filename = `${uuidv4()}.webp`; // Convert everything to webp
    const fileSizeInMB = file.size / (1024 * 1024);
    const quality = fileSizeInMB > 5 ? 60 : 80;

    // 1. Process image with sharp in memory
    const processedImageBuffer = await sharp(file.buffer)
      .resize({ width: 1200, withoutEnlargement: true }) // Max width 1200px
      .webp({ quality }) // Convert to modern webp format
      .toBuffer();

    let imageUrl = '';
    let uploadedToS3 = false;

    // 2. Upload Strategy: AWS S3 (Production with valid credentials)
    if (isS3Configured && s3Client && env.AWS_BUCKET_NAME) {
      try {
        const command = new PutObjectCommand({
          Bucket: env.AWS_BUCKET_NAME,
          Key: `uploads/${filename}`,
          Body: processedImageBuffer,
          ContentType: 'image/webp',
        });

        await s3Client.send(command);
        imageUrl = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/uploads/${filename}`;
        uploadedToS3 = true;
      } catch (s3Error) {
        console.warn('⚠️ AWS S3 upload failed, falling back to local disk storage:', s3Error);
      }
    }

    // 3. Fallback: Save to Local Disk (Development mode or when S3 is unavailable)
    if (!uploadedToS3) {
      const uploadDir = path.resolve(__dirname, '../../../public/uploads');
      const filepath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filepath, processedImageBuffer);

      const protocol = req.get('x-forwarded-proto') || req.protocol;
      const host = req.get('host') || `localhost:${env.PORT}`;
      imageUrl = `${protocol}://${host}/uploads/${filename}`;
    }

    res.status(200).json({ 
      success: true, 
      data: { url: imageUrl }
    });

  } catch (error) {
    next(error);
  }
};
