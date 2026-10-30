import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiters.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Validate registration fields before they reach password hashing or SQL.
const registrationRules = [
  body('name').isString().withMessage('Name must be text.').bail().trim().isLength({ min: 1, max: 120 }).withMessage('Name is required and must be 120 characters or fewer.'),
  body('email').isString().withMessage('Email must be text.').bail().trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isString().isLength({ min: 6, max: 72 }).withMessage('Password must be between 6 and 72 characters.'),
  body('stream').optional().isString().withMessage('Stream must be text.').bail().trim().isLength({ max: 120 }).withMessage('Stream must be 120 characters or fewer.'),
];

// Validate sign-in and profile-update payloads independently.
const loginRules = [
  body('email').isString().withMessage('Email must be text.').bail().trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isString().isLength({ min: 6, max: 72 }).withMessage('Password must be at least 6 characters.'),
];
const profileRules = [
  body('name').isString().withMessage('Name must be text.').bail().trim().isLength({ min: 1, max: 120 }).withMessage('Name is required and must be 120 characters or fewer.'),
  body('stream').isString().withMessage('Stream must be text.').bail().trim().isLength({ min: 1, max: 120 }).withMessage('Stream is required and must be 120 characters or fewer.'),
];

// Restrict demo login to the two sample students from the frontend.
const demoLoginRules = [
  body('profile').isIn(['aanya', 'aarav']).withMessage('Choose either aanya or aarav.'),
];

router.post('/register', authRateLimiter, registrationRules, validateRequest, asyncHandler(authController.register));
router.post('/login', authRateLimiter, loginRules, validateRequest, asyncHandler(authController.login));
router.post('/demo-login', authRateLimiter, demoLoginRules, validateRequest, asyncHandler(authController.demoLogin));
router.get('/me', requireAuth, asyncHandler(authController.getMe));
router.put('/me', requireAuth, profileRules, validateRequest, asyncHandler(authController.updateMe));

export default router;
