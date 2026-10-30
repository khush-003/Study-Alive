import { Router } from 'express';
import { param, query } from 'express-validator';
import * as catalogController from '../controllers/catalogController.js';
import validateRequest from '../middleware/validateRequest.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Validate simple search and filter parameters before they reach the models.
const searchRule = query('search')
  .optional()
  .isString().withMessage('Search must be text.')
  .bail()
  .trim()
  .isLength({ max: 100 }).withMessage('Search must be 100 characters or fewer.');

router.get('/careers', searchRule, validateRequest, asyncHandler(catalogController.getCareers));
router.get(
  '/careers/:id',
  param('id').isString().trim().isLength({ min: 1, max: 80 }),
  validateRequest,
  asyncHandler(catalogController.getCareer),
);
router.get(
  '/study-materials',
  query('subject').optional().isString().trim().isLength({ max: 80 }),
  query('type').optional().isString().trim().isLength({ max: 20 }),
  validateRequest,
  asyncHandler(catalogController.getStudyMaterials),
);
router.get('/peers', searchRule, validateRequest, asyncHandler(catalogController.getPeers));
router.get('/sessions', asyncHandler(catalogController.getSessions));
router.get(
  '/updates',
  query('category').optional().isString().trim().isLength({ max: 40 }),
  validateRequest,
  asyncHandler(catalogController.getUpdates),
);

export default router;
