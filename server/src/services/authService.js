import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { config } from '../config/env.js';
import { createUser, findUserByEmail, findUserById, updateUser } from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';

const HASH_ROUNDS = 10;
const demoAccounts = {
  aanya: {
    name: 'Aanya Sharma',
    email: 'aanya.demo@example.invalid',
    stream: 'Class 12 • Science',
  },
  aarav: {
    name: 'Aarav Mehta',
    email: 'aarav.demo@example.invalid',
    stream: 'Class 12 • PCM + CS',
  },
};

// Create a signed token and return the safe account object with it.
function createSession(user) {
  const token = jwt.sign(
    { sub: String(user.id), email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );
  return { token, user };
}

// Register a student with a one-way password hash and a unique email address.
export async function registerStudent({ name, email, password, stream }) {
  if (Buffer.byteLength(password, 'utf8') > 72) {
    throw new ApiError(400, 'Password must be no more than 72 bytes.');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new ApiError(409, 'An account with this email already exists.');

  const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);
  const user = await createUser({
    name,
    email,
    passwordHash,
    stream: stream || 'Registered Student',
  });
  return createSession(user);
}

// Verify credentials without revealing whether an email address is registered.
export async function loginStudent({ email, password }) {
  if (Buffer.byteLength(password, 'utf8') > 72) {
    throw new ApiError(401, 'Email or password is incorrect.');
  }

  const user = await findUserByEmail(email);
  const validPassword = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!validPassword) throw new ApiError(401, 'Email or password is incorrect.');
  return createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    stream: user.stream,
    role: user.role,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
  });
}

// Create or reuse one of the two fixed demo profiles without allowing arbitrary demo accounts.
export async function loginDemoStudent(demoId) {
  const demo = demoAccounts[demoId];
  if (!demo) throw new ApiError(400, 'Choose either the Aanya or Aarav demo profile.');

  let user = await findUserByEmail(demo.email);
  if (!user) {
    const throwawayPassword = await bcrypt.hash(
      `${demoId}-${randomUUID()}`,
      HASH_ROUNDS,
    );
    try {
      user = await createUser({
        ...demo,
        passwordHash: throwawayPassword,
      });
    } catch (error) {
      // Another simultaneous demo request may have created the same unique email first.
      if (error.code !== 'ER_DUP_ENTRY') throw error;
      user = await findUserByEmail(demo.email);
    }
  }

  if (!user) throw new ApiError(500, 'Could not load the demo profile.');
  return createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    stream: user.stream,
    role: user.role,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
  });
}

// Load the current profile from the database, rather than trusting client values.
export async function getStudentProfile(id) {
  const user = await findUserById(id);
  if (!user) throw new ApiError(404, 'Student account was not found.');
  return user;
}

// Save profile changes after the route has validated the submitted values.
export async function updateStudentProfile(id, values) {
  return updateUser(id, values);
}
