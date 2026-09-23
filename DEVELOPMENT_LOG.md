# Bitácora de Desarrollo — Sistema de Gestión de Tareas

## Retos y Soluciones

1. **Error 404 "Cannot POST /auth/register"**: al probar el registro, Express no encontraba la ruta. Se verificó que las rutas estuvieran correctamente montadas en `index.ts` y se reinició el servidor, lo cual resolvió el problema.

2. **`TypeError: app.use() requires a middleware function`**: al arrancar el servidor, uno de los middlewares llegaba como `undefined`. Se revisó la cadena completa de imports/exports (rutas, controllers, services, persistence, config) y finalmente se resolvió con un reinicio limpio del proceso de desarrollo.

3. **`Error: data and salt arguments required` en bcrypt**: al registrar un usuario, `password` llegaba `undefined` al controller. La causa fue que el body de la petición en Thunder Client no estaba configurado correctamente (se había quedado en la pestaña "Auth" en vez de "Body"). Se corrigió configurando el JSON en la pestaña Body correspondiente.

4. **`401 Token inválido o expirado` en rutas protegidas**: el header `Authorization` se armó con un espacio doble entre "Bearer" y el token, lo que rompía el `split(' ')[1]` usado para extraer el token. Se solucionó haciendo el middleware más tolerante con una expresión regular (`authHeader.replace(/^Bearer\s+/, '').trim()`).

## Uso de Asistentes de IA

Se usó Claude (Anthropic) como apoyo durante el desarrollo, principalmente para depurar errores paso a paso y generar código base que luego fue probado manualmente antes de aceptarlo.

### Middleware de autenticación (JWT)
- **Prompt utilizado**: solicitud de ayuda para crear el middleware que protege las rutas verificando el JWT del header Authorization.
- **Qué se aceptó y por qué**: la estructura general (extraer el token, verificarlo con `jwt.verify`, adjuntar el usuario decodificado a `req`), porque cumple lo pedido en el documento y sigue el patrón de errores ya usado en el proyecto.
- **Qué se rechazó o modificó**: la primera versión usaba `split(' ')[1]` para extraer el token, lo cual falló en pruebas reales por un espacio duplicado en el header armado manualmente en Thunder Client. Se modificó a una expresión regular más tolerante a espacios.
- **Verificación realizada**: se probó en Thunder Client sin token (401), con token inválido (401) y con token válido (acceso permitido), confirmando cada caso con las respuestas reales del servidor.

### Validación de entradas con AJV
- **Prompt utilizado**: solicitud de ayuda para armar la validación de entradas con AJV para register, login y las tareas.
- **Qué se aceptó y por qué**: el uso de un middleware factory reutilizable (`validate(schema)`) con AJV + ajv-formats, porque evita repetir lógica de validación en cada endpoint y es la librería sugerida en el documento.
- **Qué se rechazó o modificó**: se ajustaron los schemas para que coincidieran exactamente con los campos reales de las tablas `users` y `tasks` en PostgreSQL.
- **Verificación realizada**: se probaron los endpoints con datos inválidos (email sin formato, `titulo` faltante) confirmando que la API responde 400 con el mensaje de error correcto antes de llegar al controller.

## Decisiones tomadas sin asistencia de IA

1. Mantener los nombres de campos y funciones en español (`nombre`, `titulo`, `crearTask`, `obtenerTaskDeUsuario`) en vez de traducir todo a inglés, para que coincidieran con los nombres reales de las columnas en PostgreSQL y el código fuera más fácil de seguir.

2. Organizar y comentar el código de forma más ligera y clara donde se consideró necesario, para que fuera más fácil de entender al releerlo.