import { checkDatabaseConnection } from '../config/database.js';

export const getHealth = async (req, res, next) => {
  try {
    await checkDatabaseConnection();
    res.json({
      status: 'ok',
      message: 'IPL Fantasy API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      message: 'IPL Fantasy API is running but database is unavailable',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
};
