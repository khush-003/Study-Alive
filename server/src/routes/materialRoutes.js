import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as materialController from '../controllers/materialController.js';
import { requireAuth } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Validate public list filters before searching the catalog.
router.get(
  '/',
  query('subject').optional().isString().trim().isLength({ max: 100 }),
  query('type').optional().isString().trim().isLength({ max: 20 }),
  query('q').optional().isString().trim().isLength({ max: 100 }),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.').toInt(),
  validateRequest,
  asyncHandler(materialController.list),
);

// Serve the file only through a short-lived signed link, not a public static directory.
router.get(
  '/:id/file',
  param('id').isInt({ min: 1 }).withMessage('Material id must be a positive integer.'),
  query('token').isString().notEmpty().withMessage('A temporary file token is required.'),
  validateRequest,
  asyncHandler(materialController.file),
);
router.post('/:id/download', requireAuth, param('id').isInt({ min: 1 }), validateRequest, asyncHandler(materialController.download));
router.post('/:id/view', requireAuth, param('id').isInt({ min: 1 }), validateRequest, asyncHandler(materialController.view));

export default router;
