import express from 'express';
import env from './config/env';
import { testConnection } from './config/database';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API de Gestión de Tareas funcionando 🚀' });
});

async function startServer() {
  await testConnection();

  app.listen(env.port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
  });
}

startServer();