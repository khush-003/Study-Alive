import * as updateService from '../services/updateService.js';
import { sendSuccess } from '../utils/responses.js';

// Serve the requested page of updates and pagination metadata.
export async function list(request, response) {
  const result = await updateService.listUpdates({
    category: request.query.category || '',
    page: request.query.page ?? 1,
    limit: request.query.limit ?? 10,
  });
  return sendSuccess(response, result, 'Updates loaded.');
}

// Serve one full update by id.
export async function getById(request, response) {
  const update = await updateService.getUpdate(request.params.id);
  return sendSuccess(response, update, 'Update loaded.');
}
