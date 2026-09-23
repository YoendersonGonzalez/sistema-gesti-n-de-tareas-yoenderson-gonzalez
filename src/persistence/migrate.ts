
import fs from 'fs';
import path from 'path';
import pool from '../config/database';

/**
 * Ejecuta el script schema.sql contra la base de datos configurada.
 * Uso: npm run migrate
 */
async function runMigration() {
  try {
    const schemaPath = path.join(__dirname, 'migrations', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    await pool.query(sql);
    console.log('✅ Migración ejecutada correctamente: tablas creadas/verificadas');
  } catch (error) {
    console.error('❌ Error al ejecutar la migración:', error);
  } finally {
    await pool.end();
  }
}

runMigration();