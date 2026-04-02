import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { AppError } from '../lib/errors.js';
import { findUserByEmail, findUserById, insertUser } from '../repositories/users.repository.js';
import { signAccessToken } from './token.service.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function validateEmail(email) {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

export function validateRegisterInput({ name, email, password }) {
  if (!name || String(name).trim().length < 2) {
    throw new AppError(400, 'Nome deve ter pelo menos 2 caracteres.');
  }
  if (!validateEmail(email)) {
    throw new AppError(400, 'Email invalido.');
  }
  if (!password || String(password).length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, `Password deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
}

export function validateLoginInput({ email, password }) {
  if (!validateEmail(email)) {
    throw new AppError(400, 'Email invalido.');
  }
  if (!password || String(password).length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, 'Credenciais invalidas.');
  }
}

export async function registerUser({ name, email, password }) {
  validateRegisterInput({ name, email, password });
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new AppError(409, 'Email ja registado.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await insertUser({
      id: crypto.randomUUID(),
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash
    });
  } catch (error) {
    if (error?.code === '23505') {
      throw new AppError(409, 'Email ja registado.');
    }
    throw error;
  }
  const token = signAccessToken(user);
  return { user, token };
}

export async function loginUser({ email, password }) {
  validateLoginInput({ email, password });
  const normalizedEmail = normalizeEmail(email);
  const userRecord = await findUserByEmail(normalizedEmail);
  if (!userRecord) {
    throw new AppError(401, 'Credenciais invalidas.');
  }

  const validPassword = await bcrypt.compare(password, userRecord.passwordHash);
  if (!validPassword) {
    throw new AppError(401, 'Credenciais invalidas.');
  }

  const user = {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    createdAt: userRecord.createdAt
  };
  const token = signAccessToken(user);
  return { user, token };
}

export async function findAuthenticatedUser(userId) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(401, 'Utilizador nao encontrado.');
  return user;
}
