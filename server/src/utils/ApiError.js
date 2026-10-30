// This error type carries a safe HTTP status and message to the central handler.
export default class ApiError extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}
