import { AppError } from './AppError';

/**
 * Error para cuando un recurso solicitado no existe (404).
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
  }
}