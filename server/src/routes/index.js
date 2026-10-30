import { Router } from 'express';
import authRoutes from './authRoutes.js';
import catalogRoutes from './catalogRoutes.js';

const router = Router();

// Group versioned endpoint families beneath one API prefix.
router.use('/auth', authRoutes);
router.use('/', catalogRoutes);

export default router;
