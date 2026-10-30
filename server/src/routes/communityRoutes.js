import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as communityController from '../controllers/communityController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const peersRouter = Router();
peersRouter.get(
  '/',
  optionalAuth,
  query('q').optional().isString().trim().isLength({ max: 100 }).withMessage('Search must be 100 characters or fewer.'),
  validateRequest,
  asyncHandler(communityController.peers),
);

const skillOffersRouter = Router();
skillOffersRouter.post(
  '/',
  requireAuth,
  body('teach').isString().trim().isLength({ min: 1, max: 255 }).withMessage('Teach skill is required.'),
  body('learn').isString().trim().isLength({ min: 1, max: 255 }).withMessage('Learning goal is required.'),
  validateRequest,
  asyncHandler(communityController.createOffer),
);

const connectionsRouter = Router();
connectionsRouter.post(
  '/:userId',
  requireAuth,
  param('userId').isInt({ min: 1 }).withMessage('User id must be a positive integer.'),
  validateRequest,
  asyncHandler(communityController.toggleConnection),
);

const sessionsRouter = Router();
sessionsRouter.get('/', optionalAuth, asyncHandler(communityController.sessions));
sessionsRouter.post(
  '/:id/reserve',
  requireAuth,
  param('id').isInt({ min: 1 }).withMessage('Session id must be a positive integer.'),
  validateRequest,
  asyncHandler(communityController.reserveSession),
);
sessionsRouter.delete(
  '/:id/reserve',
  requireAuth,
  param('id').isInt({ min: 1 }).withMessage('Session id must be a positive integer.'),
  validateRequest,
  asyncHandler(communityController.cancelReservation),
);

export { connectionsRouter, peersRouter, sessionsRouter, skillOffersRouter };
