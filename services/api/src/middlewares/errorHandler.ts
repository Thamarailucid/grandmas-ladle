import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { env } from '../config/env.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  // Handle Zod Errors (if they leak here)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.issues
      }
    });
  }

  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || 500;
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message
    }
  });
}
