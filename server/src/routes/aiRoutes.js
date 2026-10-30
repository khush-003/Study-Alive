import { Router } from 'express';
import { body } from 'express-validator';
import * as aiController from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// All model requests require authentication and use bounded user-controlled inputs.
router.post(
  '/ask',
  requireAuth,
  body('prompt').isString().trim().isLength({ min: 1, max: 8000 }).withMessage('Prompt must contain between 1 and 8000 characters.'),
  body('useSearch').optional().isBoolean().withMessage('useSearch must be true or false.').toBoolean(),
  validateRequest,
  asyncHandler(aiController.ask),
);
router.post(
  '/compare',
  requireAuth,
  body('careerA').isString().trim().isLength({ min: 1, max: 120 }).withMessage('Career A must contain between 1 and 120 characters.'),
  body('careerB').isString().trim().isLength({ min: 1, max: 120 }).withMessage('Career B must contain between 1 and 120 characters.'),
  validateRequest,
  asyncHandler(aiController.compare),
);
router.post(
  '/study-kit',
  requireAuth,
  body('topic').isString().trim().isLength({ min: 1, max: 500 }).withMessage('Topic must contain between 1 and 500 characters.'),
  body('type').isIn(['summary', 'cheatsheet', 'quiz']).withMessage('Choose summary, cheatsheet, or quiz.'),
  validateRequest,
  asyncHandler(aiController.studyKit),
);

export default router;
