import { Router } from 'express';
import { param, query } from 'express-validator';
import * as updateController from '../controllers/updateController.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Validate filters and bounded pagination before any database query runs.
router.get(
  '/',
  query('category').optional().isString().withMessage('Category must be text.')
    .bail().trim().isLength({ max: 40 }),
  query('page').optional().isInt({ min: 1, max: 100000 }).withMessage('Page must be a positive integer.').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.').toInt(),
  validateRequest,
  asyncHandler(updateController.list),
);
router.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('Update id must be a positive integer.'),
  validateRequest,
  asyncHandler(updateController.getById),
);

export default router;
