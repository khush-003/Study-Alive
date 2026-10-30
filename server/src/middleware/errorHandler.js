// Handle route misses before the central error handler formats all failures.
export function notFoundHandler(request, response, next) {
  const error = new Error(`Route not found: ${request.method} ${request.path}`);
  error.statusCode = 404;
  next(error);
}

// Convert known and unexpected errors into a predictable response without leaking internals.
export function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);

  const isInvalidJson = error instanceof SyntaxError && error.status === 400 && 'body' in error;
  const isDuplicateValue = error.code === 'ER_DUP_ENTRY';
  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : isInvalidJson ? 400 : isDuplicateValue ? 409 : 500;
  const message = statusCode >= 500
    ? error.publicMessage || 'An unexpected server error occurred.'
    : isInvalidJson
      ? 'Request body must contain valid JSON.'
      : isDuplicateValue
        ? 'A record with one of these unique values already exists.'
        : error.message;

  if (statusCode >= 500) {
    console.error(error);
  }

  return response.status(statusCode).json({ success: false, message });
}
