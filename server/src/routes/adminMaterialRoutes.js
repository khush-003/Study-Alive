import { Router } from 'express';
import { body } from 'express-validator';
import * as materialController from '../controllers/materialController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorizeRole.js';
import { uploadMaterialFile } from '../middleware/materialUpload.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Only administrators may upload resources; Multer validates file size and type.
router.post(
  '/materials',
  requireAuth,
  requireRole('admin'),
  uploadMaterialFile,
  body('subject').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Subject is required.'),
  body('type').isIn(['notes', 'videos', 'practice', 'books']).withMessage('Choose a valid material type.'),
  body('title').isString().trim().isLength({ min: 1, max: 200 }).withMessage('Title is required.'),
  body('description').isString().trim().isLength({ min: 1, max: 10000 }).withMessage('Description is required.'),
  body('duration').optional().isString().trim().isLength({ max: 40 }).withMessage('Duration must be 40 characters or fewer.'),
  validateRequest,
  asyncHandler(materialController.upload),
);

export default router;
