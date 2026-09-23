import { AppError } from './AppError';

/**
 * Error para datos de entrada inválidos (400).
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Datos de entrada inválidos') {
    super(message, 400);
  }
}