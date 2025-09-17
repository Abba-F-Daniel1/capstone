import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { sendError } from '../utils/response';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        sendError(res, 409, 'CONFLICT', 'A record with this information already exists');
        return;
      case 'P2025':
        sendError(res, 404, 'NOT_FOUND', 'Record not found');
        return;
      case 'P2003':
        sendError(res, 400, 'BAD_REQUEST', 'Invalid reference to related record');
        return;
      default:
        sendError(res, 500, 'DATABASE_ERROR', 'Database operation failed');
        return;
    }
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    sendError(res, 400, 'VALIDATION_ERROR', 'Invalid input data', details);
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    sendError(res, 401, 'UNAUTHORIZED', 'Invalid token');
    return;
  }

  if (error.name === 'TokenExpiredError') {
    sendError(res, 401, 'UNAUTHORIZED', 'Token has expired');
    return;
  }

  // Default error
  sendError(
    res,
    500,
    'INTERNAL_ERROR',
    process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  );
};
