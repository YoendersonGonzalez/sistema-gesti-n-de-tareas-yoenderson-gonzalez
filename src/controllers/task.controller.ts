import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as taskService from '../services/task.service';

/**
 * POST /tasks
 * Crea una nueva tarea asociada al usuario autenticado.
 *
 * @param req - Request autenticado; requiere `titulo` y `fecha_vencimiento` en el body.
 * @param res - Responde 201 con la tarea creada.
 * @param next - Delega al errorHandler si algo falla.
 */
export async function crearTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { titulo, descripcion, fecha_vencimiento, estado } = req.body;
    const user_id = req.usuario!.id;

    const task = await taskService.crearTask({
      titulo,
      descripcion,
      fecha_vencimiento,
      estado,
      user_id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /tasks
 * Lista únicamente las tareas que pertenecen al usuario autenticado.
 *
 * @param req - Request autenticado.
 * @param res - Responde 200 con el array de tareas.
 * @param next - Delega al errorHandler si algo falla.
 */
export async function listarTasks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user_id = req.usuario!.id;
    const tasks = await taskService.listarTasksDeUsuario(user_id);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /tasks/:id
 * Obtiene una tarea específica, validando que pertenezca al usuario autenticado.
 *
 * @param req - Request autenticado; `req.params.id` es el id de la tarea.
 * @param res - Responde 200 con la tarea encontrada.
 * @throws {NotFoundError} Si la tarea no existe.
 * @throws {AuthenticationError} Si la tarea pertenece a otro usuario.
 */
export async function obtenerTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user_id = req.usuario!.id;
    const task = await taskService.obtenerTaskDeUsuario(id, user_id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /tasks/:id
 * Actualiza una tarea propia del usuario autenticado (actualización parcial).
 *
 * @param req - Request autenticado; body con los campos a actualizar.
 * @param res - Responde 200 con la tarea actualizada.
 * @throws {NotFoundError} Si la tarea no existe.
 * @throws {AuthenticationError} Si la tarea pertenece a otro usuario.
 */
export async function actualizarTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user_id = req.usuario!.id;
    const { titulo, descripcion, fecha_vencimiento, estado } = req.body;

    const task = await taskService.actualizarTaskDeUsuario(id, user_id, {
      titulo,
      descripcion,
      fecha_vencimiento,
      estado,
    });

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /tasks/:id
 * Elimina una tarea propia del usuario autenticado.
 *
 * @param req - Request autenticado; `req.params.id` es el id de la tarea.
 * @param res - Responde 204 sin contenido.
 * @throws {NotFoundError} Si la tarea no existe.
 * @throws {AuthenticationError} Si la tarea pertenece a otro usuario.
 */
export async function eliminarTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user_id = req.usuario!.id;
    await taskService.eliminarTaskDeUsuario(id, user_id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}