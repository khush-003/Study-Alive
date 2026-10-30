import * as materialService from '../services/materialService.js';
import { sendCreated, sendSuccess } from '../utils/responses.js';

// List study resources filtered by the requested subject, type, and query.
export async function list(request, response) {
  const materials = await materialService.getMaterials({
    subject: request.query.subject || '',
    type: request.query.type || '',
    query: request.query.q || '',
    limit: request.query.limit ?? 50,
  });
  return sendSuccess(response, materials, 'Study materials loaded.');
}

// Record an authenticated download and return its short-lived file URL.
export async function download(request, response) {
  const result = await materialService.requestDownload(request.user.id, request.params.id);
  return sendSuccess(response, result, 'Temporary download link created.');
}

// Return a short-lived authorized file link for an authenticated video view.
export async function view(request, response) {
  const result = await materialService.requestVideoView(request.user.id, request.params.id);
  return sendSuccess(response, result, 'Video link created.');
}

// Stream the requested file after its short-lived token has been verified.
export async function file(request, response, next) {
  const { filePath, title, disposition } = await materialService.getAuthorizedFile(
    request.params.id,
    request.query.token,
  );
  if (disposition === 'inline') {
    return response.sendFile(filePath, (error) => {
      if (error) next(error);
    });
  }
  return response.download(filePath, title, (error) => {
    if (error) next(error);
  });
}

// Create a resource request for the signed-in student.
export async function createRequest(request, response) {
  const result = await materialService.requestResource(request.user.id, request.body);
  return sendCreated(response, result, 'Resource request submitted.');
}

// Return this student's previously submitted resource requests.
export async function listRequests(request, response) {
  const requests = await materialService.getStudentRequests(request.user.id);
  return sendSuccess(response, requests, 'Resource requests loaded.');
}

// Persist an uploaded study resource and return its catalog object.
export async function upload(request, response) {
  const material = await materialService.createUploadedMaterial(request.body, request.file);
  return sendCreated(response, material, 'Study material uploaded.');
}
