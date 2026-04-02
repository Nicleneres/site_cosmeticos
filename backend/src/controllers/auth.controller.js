import { loginUser, registerUser } from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body || {});
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body || {});
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ user: req.auth.user });
}
