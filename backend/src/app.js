import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
