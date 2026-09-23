import * as taskPersistence from '../persistence/task.persistence';
import { Task, NuevaTaskInput } from '../persistence/task.persistence';
import { NotFoundError } from '../errors/NotFoundError';
import { AuthenticationError } from '../errors/AuthenticationError';

export async function crearTask(datos: NuevaTaskInput): Promise<Task> {
  return taskPersistence.insertarTask(datos);
}

export async function listarTasksDeUsuario(user_id: number): Promise<Task[]> {
  return taskPersistence.obtenerTasksPorUsuario(user_id);
}

/**
 * Obtiene una tarea verificando que pertenezca al usuario autenticado.
 */
export async function obtenerTaskDeUsuario(id: number, user_id: number): Promise<Task> {
  const task = await taskPersistence.obtenerTaskPorId(id);
  if (!task) {
    throw new NotFoundError('Tarea no encontrada');
  }
  if (task.user_id !== user_id) {
    throw new AuthenticationError('No tienes permiso para acceder a esta tarea');
  }
  return task;
}

export async function actualizarTaskDeUsuario(
  id: number,
  user_id: number,
  datos: Partial<NuevaTaskInput>
): Promise<Task> {
  await obtenerTaskDeUsuario(id, user_id); // valida existencia y dueño
  const actualizada = await taskPersistence.actualizarTask(id, datos);
  return actualizada as Task;
}

export async function eliminarTaskDeUsuario(id: number, user_id: number): Promise<void> {
  await obtenerTaskDeUsuario(id, user_id); // valida existencia y dueño
  await taskPersistence.eliminarTask(id);
}