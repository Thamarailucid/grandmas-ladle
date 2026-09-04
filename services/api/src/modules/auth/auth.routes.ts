import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.post('/Login', authController.login);
router.post('/RefreshToken', authController.refreshToken);
router.post('/Logout', authenticate, authController.logout);
router.get('/GetCurrentUser', authenticate, authController.getCurrentUser);
router.post('/ChangePassword', authenticate, authController.changePassword);
router.post('/UpdateProfile', authenticate, authController.updateProfile);

export default router;
