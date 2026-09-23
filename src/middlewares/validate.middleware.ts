import { Request, Response, NextFunction } from 'express';
import Ajv, { Schema } from 'ajv';
import addFormats from 'ajv-formats';
import { ValidationError } from '../errors/ValidationError';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/**
 * Middleware factory: recibe un JSON Schema y devuelve un middleware
 * que valida req.body contra ese schema antes de llegar al controller.
 */
export function validate(schema: Schema) {
  const validateFn = ajv.compile(schema);

  return (req: Request, _res: Response, next: NextFunction) => {
    const valido = validateFn(req.body);

    if (!valido) {
      const mensajes = validateFn.errors
        ?.map((err) => `${err.instancePath || err.params.missingProperty || ''} ${err.message}`.trim())
        .join(', ');

      return next(new ValidationError(mensajes || 'Datos de entrada inválidos'));
    }

    next();
  };
}