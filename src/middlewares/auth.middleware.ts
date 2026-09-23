import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../errors/AuthenticationError';
import env from '../config/env';

export interface AuthRequest extends Request {
  usuario?: { id: number; email: string };
}

/**
 * Middleware que protege rutas verificando el JWT en el header Authorization.
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.jwtSecret) as { id: number; email: string };
    req.usuario = decoded;

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    next(new AuthenticationError('Token inválido o expirado'));
  }
}