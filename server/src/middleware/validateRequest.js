import fs from 'node:fs/promises';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

// Convert validator failures into one consistent client-facing error response.
export default async function validateRequest(request, response, next) {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    const errors = result.array().map(({ path, msg }) => ({ field: path, message: msg }));
    if (request.file?.path) {
      await fs.unlink(request.file.path).catch((error) => {
        console.error('Could not remove an invalid uploaded file:', error);
      });
    }
    return next(new ApiError(400, 'Please check the submitted information.', errors));
  }
  return next();
}
