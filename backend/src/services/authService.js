import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { toPublicUser } from '../utils/user.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const BCRYPT_ROUNDS = 12;

const validateRegistrationInput = (input) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new AppError('Invalid request payload', 400);
  }

  const { name, email, password } = input;

  if (typeof name !== 'string') {
    throw new AppError('Name is required', 400);
  }
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new AppError('Name is required', 400);
  }
  if (trimmedName.length > MAX_NAME_LENGTH) {
    throw new AppError(`Name cannot exceed ${MAX_NAME_LENGTH} characters`, 400);
  }

  if (typeof email !== 'string') {
    throw new AppError('Email is required', 400);
  }
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    throw new AppError('Email is required', 400);
  }
  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    throw new AppError(`Email cannot exceed ${MAX_EMAIL_LENGTH} characters`, 400);
  }
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    throw new AppError('Invalid email address', 400);
  }

  if (typeof password !== 'string' || !password) {
    throw new AppError('Password is required', 400);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new AppError(`Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`, 400);
  }

  return { name: trimmedName, email: trimmedEmail, password };
};

const validateLoginInput = (input) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new AppError('Invalid request payload', 400);
  }

  const { email, password } = input;

  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (trimmedEmail.length > MAX_EMAIL_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    throw new AppError('Invalid email or password', 401);
  }

  return { email: trimmedEmail, password };
};

const signToken = (userId) =>
  jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const registerUser = async (input) => {
  const validated = validateRegistrationInput(input);
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

export const loginUser = async (input) => {
  const validated = validateLoginInput(input);

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
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new AppError('User ID is required', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return toPublicUser(user);
};
