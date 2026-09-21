import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

/**
 * Validates Bearer JWT and attaches req.userId.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (!decoded.userId) {
      return next(new AppError('Invalid or expired token', 401));
    }
    req.userId = decoded.userId;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};
