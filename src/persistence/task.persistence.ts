import pool from '../config/database';

export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_vencimiento: Date;
  estado: 'pendiente' | 'en curso' | 'completada';
  user_id: number;
  created_at: Date;
}

export interface NuevaTaskInput {
  titulo: string;
  descripcion: string;
  fecha_vencimiento: string;
  estado: string;
  user_id: number;
}

export async function insertarTask(datos: NuevaTaskInput): Promise<Task> {
  const query = `
    INSERT INTO tasks (titulo, descripcion, fecha_vencimiento, estado, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [datos.titulo, datos.descripcion, datos.fecha_vencimiento, datos.estado, datos.user_id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function obtenerTasksPorUsuario(user_id: number): Promise<Task[]> {
  const query = `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`;
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

export async function obtenerTaskPorId(id: number): Promise<Task | null> {
  const query = `SELECT * FROM tasks WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function actualizarTask(id: number, datos: Partial<NuevaTaskInput>): Promise<Task | null> {
  const query = `
    UPDATE tasks
    SET titulo = COALESCE($1, titulo),
        descripcion = COALESCE($2, descripcion),
        fecha_vencimiento = COALESCE($3, fecha_vencimiento),
        estado = COALESCE($4, estado)
    WHERE id = $5
    RETURNING *
  `;
  const values = [datos.titulo, datos.descripcion, datos.fecha_vencimiento, datos.estado, id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function eliminarTask(id: number): Promise<boolean> {
  const query = `DELETE FROM tasks WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
}