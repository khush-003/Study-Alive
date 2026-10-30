import { Router } from 'express';
import { checkDatabaseConnection } from '../config/db.js';

const router = Router();

// Report API readiness only when a lightweight database check succeeds.
router.get('/', async (request, response, next) => {
  try {
    await checkDatabaseConnection();
    return response.status(200).json({
      success: true,
      data: { status: 'ok', database: 'connected' },
      message: 'API and database are ready.',
    });
  } catch (error) {
    error.statusCode = 503;
    error.publicMessage = 'Database connection is unavailable.';
    return next(error);
  }
});

export default router;
