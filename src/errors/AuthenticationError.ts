import { AppError } from './AppError';

/**
 * Error para fallos de autenticación: credenciales inválidas o token inválido (401).
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Credenciales inválidas') {
    super(message, 401);
  }
}