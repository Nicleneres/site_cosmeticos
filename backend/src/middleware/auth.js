import { AppError } from '../lib/errors.js';
import { verifyAccessToken } from '../services/token.service.js';
import { findAuthenticatedUser } from '../services/auth.service.js';

export async function requireAuth(req, _res, next) {
  try {
    const header = String(req.headers.authorization || '');
    if (!header.startsWith('Bearer ')) {
      throw new AppError(401, 'Token de autenticacao ausente.');
    }
    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new AppError(401, 'Token de autenticacao invalido.');
    }
    const payload = verifyAccessToken(token);
    const user = await findAuthenticatedUser(payload.sub);
    req.auth = { user };
    return next();
  } catch (error) {
    if (error.statusCode) return next(error);
    return next(new AppError(401, 'Token expirado ou invalido.'));
  }
}
