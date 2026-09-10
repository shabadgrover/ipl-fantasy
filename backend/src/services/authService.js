import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { toPublicUser } from '../utils/user.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const BCRYPT_ROUNDS = 12;

const validateRegistrationInput = ({ name, email, password }) => {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();

  if (!trimmedName) {
    throw new AppError('Name is required', 400);
  }
  if (!trimmedEmail) {
    throw new AppError('Email is required', 400);
  }
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    throw new AppError('Invalid email address', 400);
  }
  if (!password || typeof password !== 'string') {
    throw new AppError('Password is required', 400);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
  }

  return { name: trimmedName, email: trimmedEmail, password };
};

const validateLoginInput = ({ email, password }) => {
  const trimmedEmail = email?.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    throw new AppError('Email and password are required', 400);
  }

  return { email: trimmedEmail, password };
};

const signToken = (userId) =>
  jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const registerUser = async ({ name, email, password }) => {
  const validated = validateRegistrationInput({ name, email, password });
  const passwordHash = await bcrypt.hash(validated.password, BCRYPT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
      },
    });

    const token = signToken(user.id);
    return { user: toPublicUser(user), token };
  } catch (error) {
    if (error.code === 'P2002') {
      throw new AppError('An account with this email already exists', 409);
    }
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const validated = validateLoginInput({ email, password });

  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordValid = await bcrypt.compare(validated.password, user.passwordHash);
  if (!passwordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user.id);
  return { user: toPublicUser(user), token };
};

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return toPublicUser(user);
};
