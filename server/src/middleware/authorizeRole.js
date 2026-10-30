import ApiError from '../utils/ApiError.js';

// Restrict a route to one or more roles after requireAuth has loaded the current user.
export function requireRole(...roles) {
  return function roleGuard(request, response, next) {
    if (!request.user || !roles.includes(request.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    return next();
  };
}
