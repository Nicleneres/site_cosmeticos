import { AppError } from '../lib/errors.js';

export function notFoundHandler(_req, _res, next) {
  next(new AppError(404, 'Rota nao encontrada.'));
}
