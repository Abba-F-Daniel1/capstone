import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';
import { prisma } from '../utils/database';
import { sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    const payload = verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      sendError(res, 401, 'UNAUTHORIZED', 'User not found');
      return;
    }
    
    req.user = user as any;
    next();
  } catch (error) {
    sendError(res, 401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }
    
    const token = extractTokenFromHeader(authHeader);
    const payload = verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (user) {
      req.user = user as any;
    }
    
    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
};
