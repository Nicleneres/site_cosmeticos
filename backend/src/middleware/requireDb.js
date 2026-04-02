import { AppError } from '../lib/errors.js';

export function requireDb(req, _res, next) {
  if (!req.app.locals.dbReady) {
    return next(
      new AppError(
        503,
        'PostgreSQL indisponivel. Inicie o banco em localhost:5432 para usar auth/favorites.'
      )
    );
  }
  return next();
}
