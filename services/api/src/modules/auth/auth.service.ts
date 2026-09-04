import * as authRepository from './auth.repository.js';
import { AppError } from '../../errors/AppError.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

const JWT_EXPIRES_IN = env.JWT_ACCESS_EXPIRES_IN || '7d';
const REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN || '7d';

export const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    env.JWT_ACCESS_SECRET!,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    env.JWT_REFRESH_SECRET!,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
  );
  return { accessToken, refreshToken };
};

export const login = async (email: string, password: string) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isValid = await argon2.verify(user.password_hash, password);
  if (!isValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const { accessToken, refreshToken } = generateTokens(user);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  await authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

  const { password_hash, ...userProfile } = user;
  
  return { user: userProfile, accessToken, refreshToken };
};

export const refreshToken = async (token: string) => {
  const existingToken = await authRepository.findRefreshToken(token);
  if (!existingToken) {
    throw AppError.unauthorized('Invalid refresh token');
  }

  if (new Date(existingToken.expires_at) < new Date()) {
    await authRepository.deleteRefreshToken(token);
    throw AppError.unauthorized('Refresh token expired');
  }

  try {
    const decoded: any = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const user = await authRepository.findUserById(decoded.id);
    
    if (!user) {
      throw AppError.unauthorized('User not found');
    }

    const tokens = generateTokens(user);
    
    // Replace old token
    await authRepository.deleteRefreshToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.saveRefreshToken(user.id, tokens.refreshToken, expiresAt);

    return tokens;
  } catch (err) {
    throw AppError.unauthorized('Invalid refresh token');
  }
};

export const logout = async (userId: string) => {
  await authRepository.deleteAllUserRefreshTokens(userId);
  return { success: true };
};

export const getCurrentUser = async (userId: string) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }
  return user;
};

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }
  
  const fullUser = await authRepository.findUserByEmail(user.email);

  const isValid = await argon2.verify(fullUser.password_hash, oldPassword);
  if (!isValid) {
    throw AppError.unauthorized('Invalid old password');
  }

  const passwordHash = await argon2.hash(newPassword);
  await authRepository.updatePassword(userId, passwordHash);
  
  return { success: true };
};

export const updateProfile = async (userId: string, email: string) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Check if new email is already taken by another user
  if (email !== user.email) {
    const existing = await authRepository.findUserByEmail(email);
    if (existing && existing.id !== userId) {
      throw AppError.badRequest('Email already in use');
    }
  }

  await authRepository.updateEmail(userId, email);
  return { success: true };
};
