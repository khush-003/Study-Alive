import { Router } from 'express';
import * as careerController from '../controllers/careerController.js';
import * as materialController from '../controllers/materialController.js';
import * as communityController from '../controllers/communityController.js';
import * as profileStatsController from '../controllers/profileStatsController.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Stats are computed from the authenticated student's saved and activity records.
router.get('/stats', requireAuth, asyncHandler(profileStatsController.getStats));
// The saved-career collection is private to the authenticated student.
router.get('/saved-careers', requireAuth, asyncHandler(careerController.saved));
router.get('/resource-requests', requireAuth, asyncHandler(materialController.listRequests));
router.get('/connections', requireAuth, asyncHandler(communityController.connections));
router.get('/skill-offers', requireAuth, asyncHandler(communityController.myOffers));

export default router;
