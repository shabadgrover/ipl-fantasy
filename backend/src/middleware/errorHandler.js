export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err instanceof AppError ? err.message : 'Internal server error';

  if (process.env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : message,
    message,
  });
};
