import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../errors/AppError.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Setup AWS S3 Client
// If the environment variables are not set, it won't break unless you try to upload to S3
const s3Client = process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID ? new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
}) : null;

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

    // 2. Upload Strategy: AWS S3 (Production) vs Local Disk (Development)
    if (s3Client && process.env.AWS_BUCKET_NAME) {
      // PRODUCTION: Upload to AWS S3
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${filename}`,
        Body: processedImageBuffer,
        ContentType: 'image/webp',
        // Optional: ACL: 'public-read' - usually handled by Bucket Policies now
      });

      await s3Client.send(command);
      // Construct the public S3 URL or CloudFront URL
      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${filename}`;
    } else {
      // DEVELOPMENT: Save to local disk
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filepath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filepath, processedImageBuffer);

      const host = req.get('host');
      const protocol = req.protocol;
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
