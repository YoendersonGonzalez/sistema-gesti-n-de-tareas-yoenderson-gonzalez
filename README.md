# Sistema de Gestión de Tareas — API REST

API RESTful desarrollada con Node.js, Express y TypeScript para registro de usuarios, autenticación con JWT y gestión de tareas personales.

## Arquitectura

El proyecto sigue una arquitectura en capas:

- `src/api` — Rutas y middlewares de Express.
- `src/controllers` — Reciben las peticiones HTTP y llaman a los servicios.
- `src/services` — Lógica de negocio.
- `src/persistence` — Comunicación directa con PostgreSQL.
- `src/middlewares` — Autenticación (JWT), validación (AJV) y manejo de errores.
- `src/errors` — Clases de error personalizadas (`AppError`, `NotFoundError`, `ValidationError`, etc.).
- `src/schemas` — Esquemas JSON Schema para validar entradas con AJV.
- `src/config` — Configuración centralizada (variables de entorno, conexión a base de datos, Swagger).

## Tecnologías

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT (jsonwebtoken) para autenticación
- bcrypt para hash de contraseñas
- AJV para validación de esquemas
- Swagger (swagger-jsdoc + swagger-ui-express) para documentación

## Instalación local

1. Clonar el repositorio:
```bash
   git clone <https://github.com/YoendersonGonzalez/sistema-gesti-n-de-tareas-yoenderson-gonzalez>
   cd sistema-gestion-de-tareas
```

2. Instalar dependencias:
```bash
   npm install
```

3. Configurar variables de entorno (ver sección siguiente).

4. Ejecutar el proyecto en modo desarrollo:
```bash
   npm run dev
```

## Configuración del archivo `.env`

Copiar `.env.example` a `.env` y completar los valores:

```bash
cp .env.example .env
```

Variables requeridas:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde corre el servidor |
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL |
| `JWT_SECRET` | Clave secreta para firmar los JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej. `1d`) |

## Documentación de la API

Con el servidor corriendo, la documentación Swagger está disponible en: http://localhost:3000/api-docs


## Endpoints principales

### Auth
- `POST /auth/register` — Registra un nuevo usuario.
- `POST /auth/login` — Inicia sesión y devuelve un JWT.

### Tasks (requieren header `Authorization: Bearer <token>`)
- `POST /tasks` — Crea una tarea.
- `GET /tasks` — Lista las tareas del usuario autenticado.
- `GET /tasks/:id` — Obtiene una tarea específica (solo el dueño).
- `PUT /tasks/:id` — Actualiza una tarea propia.
- `DELETE /tasks/:id` — Elimina una tarea propia.