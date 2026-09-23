import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { crearUsuario, buscarUsuarioPorEmail } from '../services/user.service';
import { ConflictError } from '../errors/ConflictError';
import { AuthenticationError } from '../errors/AuthenticationError';
import env from '../config/env';

/**
 * POST /auth/register
 * Registra un nuevo usuario con contraseña hasheada (bcrypt).
 *
 * @param req - Request con `nombre`, `email` y `password` en el body.
 * @param res - Responde 201 con los datos del usuario creado (sin password).
 * @throws {ConflictError} Si ya existe un usuario con ese email.
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
      throw new ConflictError('Ya existe un usuario registrado con ese email');
    }

    const nuevoUsuario = await crearUsuario({ nombre, email, password });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /auth/login
 * Verifica las credenciales del usuario y, si son correctas, devuelve un JWT.
 *
 * @param req - Request con `email` y `password` en el body.
 * @param res - Responde 200 con el token JWT y los datos básicos del usuario.
 * @throws {AuthenticationError} Si el email no existe o la contraseña no coincide.
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      throw new AuthenticationError('Email o contraseña incorrectos');
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      throw new AuthenticationError('Email o contraseña incorrectos');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    next(error);
  }
}