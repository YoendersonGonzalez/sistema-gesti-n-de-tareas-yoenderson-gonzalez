export const crearTaskSchema = {
  type: 'object',
  properties: {
    titulo: { type: 'string', minLength: 1 },
    descripcion: { type: 'string' },
    fecha_vencimiento: { type: 'string', format: 'date' },
    estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
  },
  required: ['titulo', 'fecha_vencimiento'],
  additionalProperties: false,
};

export const actualizarTaskSchema = {
  type: 'object',
  properties: {
    titulo: { type: 'string', minLength: 1 },
    descripcion: { type: 'string' },
    fecha_vencimiento: { type: 'string', format: 'date' },
    estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
  },
  additionalProperties: false,
};