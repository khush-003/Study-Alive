import { Router } from 'express';
import { param, query } from 'express-validator';
import * as careerController from '../controllers/careerController.js';
import { requireAuth } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Validate list search and cap the result count before reaching the database.
const searchRules = [
  query('q').optional().isString().withMessage('Search must be text.')
    .bail().trim().isLength({ max: 100 }).withMessage('Search must be 100 characters or fewer.'),
  query('limit').optional().isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100.').toInt(),
];

// Keep fixed routes before /:slug so names like "trending" are never treated as slugs.
router.get('/compare', [
  query('a').isString().matches(slugPattern).withMessage('Career a must be a valid slug.'),
  query('b').isString().matches(slugPattern).withMessage('Career b must be a valid slug.'),
], validateRequest, asyncHandler(careerController.compare));
router.get('/trending', asyncHandler(careerController.trending));
router.get('/', searchRules, validateRequest, asyncHandler(careerController.list));
router.get(
  '/:slug',
  param('slug').isString().matches(slugPattern).withMessage('Career slug is invalid.'),
  validateRequest,
  asyncHandler(careerController.getBySlug),
);
router.post(
  '/:id/save',
  requireAuth,
  param('id').isString().matches(slugPattern).withMessage('Career id is invalid.'),
  validateRequest,
  asyncHandler(careerController.save),
);
router.delete(
  '/:id/save',
  requireAuth,
  param('id').isString().matches(slugPattern).withMessage('Career id is invalid.'),
  validateRequest,
  asyncHandler(careerController.unsave),
);

export default router;
