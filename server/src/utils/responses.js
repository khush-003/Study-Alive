// Keep successful endpoint responses in the same documented JSON shape.
export function sendSuccess(response, data, message = 'Request completed successfully.') {
  return response.status(200).json({ success: true, data, message });
}

// Send newly-created resources with the standard response envelope.
export function sendCreated(response, data, message = 'Resource created successfully.') {
  return response.status(201).json({ success: true, data, message });
}
