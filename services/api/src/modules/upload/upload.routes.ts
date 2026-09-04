import { Router } from 'express';
import * as uploadController from './upload.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

// Endpoint: POST /api/v1/Upload/Image
router.post(
  '/Image',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  uploadController.upload.single('image'),
  uploadController.uploadImage
);

export default router;
