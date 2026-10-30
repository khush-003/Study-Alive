// Wrap async Express handlers so rejected promises reach the error middleware.
export default function asyncHandler(handler) {
  return function wrappedHandler(request, response, next) {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}
