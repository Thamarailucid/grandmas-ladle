import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const data = await authService.refreshToken(token);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    await authService.logout(userId);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const data = await authService.getCurrentUser(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(userId, oldPassword, newPassword);
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { email } = req.body;
    await authService.updateProfile(userId, email);
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};
