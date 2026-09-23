import bcrypt from 'bcrypt';
import pool from '../config/database';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface NuevoUsuarioInput {
  nombre: string;
  email: string;
  password: string;
}

const SALT_ROUNDS = 10;

/**
 * Registra un nuevo usuario en la base de datos.
 * La contraseña se guarda como hash, nunca en texto plano.
 */
export async function crearUsuario(datos: NuevoUsuarioInput): Promise<Omit<Usuario, 'password'>> {
  const { nombre, email, password } = datos;

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const query = `
    INSERT INTO users (nombre, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, nombre, email, created_at
  `;

  const result = await pool.query(query, [nombre, email, passwordHash]);
  return result.rows[0];
}

/**
 * Busca un usuario por su email. Retorna null si no existe.
 */
export async function buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}