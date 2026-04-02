import { logger } from '../lib/logger.js';

export function errorHandler(error, req, res, _next) {
  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  const payload = {
    error: error?.message || 'Erro interno no servidor.'
  };

  if (error?.details) {
    payload.details = error.details;
  }

  logger.error('Erro na requisicao', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: error?.message
  });

  res.status(statusCode).json(payload);
}
