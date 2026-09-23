import { AppError } from './AppError';

/**
 * Error para conflictos, como un email ya registrado (409).
 */
export class ConflictError extends AppError {
  constructor(message: string = 'El recurso ya existe') {
    super(message, 409);
  }
}