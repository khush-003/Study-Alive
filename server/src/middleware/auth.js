import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { findUserById } from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Verify the bearer token and attach its current database user to the request.
export const requireAuth = asyncHandler(async (request, response, next) => {
  const authorization = request.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Please sign in to continue.');
  }

  let payload;
  try {
    payload = jwt.verify(authorization.slice(7), config.jwtSecret);
  } catch {
    throw new ApiError(401, 'Your session is invalid or has expired. Please sign in again.');
  }

  const user = await findUserById(payload.sub);
  if (!user) throw new ApiError(401, 'The account for this session no longer exists.');

  request.user = user;
  return next();
});

// Continue as a guest when no token is sent, but verify any supplied token.
export const optionalAuth = asyncHandler(async (request, response, next) => {
  const authorization = request.get('authorization');
  if (!authorization) return next();
  if (!authorization.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization must use a Bearer token.');
  }

  let payload;
  try {
    payload = jwt.verify(authorization.slice(7), config.jwtSecret);
  } catch {
    throw new ApiError(401, 'Your session is invalid or has expired. Please sign in again.');
  }

  const user = await findUserById(payload.sub);
  if (!user) throw new ApiError(401, 'The account for this session no longer exists.');

  request.user = user;
  return next();
});

export default requireAuth;
