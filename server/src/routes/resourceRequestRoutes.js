import { Router } from 'express';
import { body } from 'express-validator';
import * as materialController from '../controllers/materialController.js';
import { requireAuth } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Resource requests are private student actions with bounded text fields.
router.post(
  '/',
  requireAuth,
  body('subject').isString().trim().isLength({ min: 1, max: 160 }).withMessage('Subject is required.'),
  body('format').isString().trim().isLength({ min: 1, max: 80 }).withMessage('Format is required.'),
  validateRequest,
  asyncHandler(materialController.createRequest),
);

export default router;
