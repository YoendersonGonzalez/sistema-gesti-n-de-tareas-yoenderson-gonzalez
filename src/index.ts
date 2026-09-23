import express from 'express';
import env from './config/env';
import { testConnection } from './config/database';
import taskRoutes from './api/routes/task.routes';
import authRoutes from './api/routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req, res) => {
  res.json({ message: 'API de Gestión de Tareas funcionando 🚀' });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// El manejador de errores va siempre al final, después de las rutas
app.use(errorHandler);

async function startServer() {
  await testConnection();

  app.listen(env.port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
  });
}

startServer();