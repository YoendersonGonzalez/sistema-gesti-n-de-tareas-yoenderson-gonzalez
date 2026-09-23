import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Middleware centralizado de manejo de errores.
 * Captura cualquier error pasado con next(error) y responde en formato JSON consistente.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  console.error('Error no controlado:', err);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Ocurrió un error inesperado en el servidor',
  });
}