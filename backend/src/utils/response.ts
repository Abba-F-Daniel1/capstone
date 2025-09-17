import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export const sendSuccess = <T>(res: Response, data: T, message?: string): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  
  if (message) {
    (response as any).message = message;
  }
  
  res.json(response);
};

export const sendError = (
  res: Response, 
  statusCode: number, 
  code: string, 
  message: string, 
  details?: any
): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  
  res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: PaginatedResponse<T>['pagination']
): void => {
  const response: PaginatedResponse<T> = {
    data,
    pagination,
  };
  
  res.json(response);
};

export const handleAsync = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
