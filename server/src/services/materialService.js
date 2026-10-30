import fs from 'node:fs/promises';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { uploadDirectory } from '../config/uploads.js';
import * as materialModel from '../models/materialModel.js';
import ApiError from '../utils/ApiError.js';

const materialTypes = new Set(['notes', 'videos', 'practice', 'books']);
const maximumListLimit = 100;

// Validate filters once and return the public resource list.
export function getMaterials({ subject = '', type = '', query = '', limit = 50 }) {
  if (type && !materialTypes.has(type)) {
    throw new ApiError(400, 'Unsupported material type.');
  }
  return materialModel.listMaterials({
    subject: subject.trim(),
    type,
    query: query.trim(),
    limit: Math.min(limit, maximumListLimit),
  });
}

// Create a short-lived URL token scoped to one user and one material.
function makeFileToken(userId, materialId, disposition) {
  return jwt.sign(
    { sub: String(userId), materialId: String(materialId), purpose: 'material-file', disposition },
    config.jwtSecret,
    { expiresIn: '5m' },
  );
}

// Log an authenticated download and return a relative, five-minute file URL.
export async function requestDownload(userId, materialId) {
  const material = await materialModel.findMaterialById(materialId);
  if (!material) throw new ApiError(404, 'Study material was not found.');
  if (!material.filename) throw new ApiError(404, 'No file is available for this study material.');

  await materialModel.recordDownload(userId, materialId);
  const token = makeFileToken(userId, materialId, 'attachment');
  return {
    materialId: material.id,
    fileUrl: `/api/materials/${encodeURIComponent(materialId)}/file?token=${encodeURIComponent(token)}`,
    expiresIn: 300,
  };
}

// Allow only video materials through the authenticated playback action.
export async function requestVideoView(userId, materialId) {
  const material = await materialModel.findMaterialById(materialId);
  if (!material) throw new ApiError(404, 'Study material was not found.');
  if (material.type !== 'videos') throw new ApiError(400, 'This material is not a video.');
  if (!material.filename) throw new ApiError(404, 'No video file is available for this material.');

  await materialModel.recordView(userId, materialId);
  const token = makeFileToken(userId, materialId, 'inline');
  return {
    materialId: material.id,
    title: material.title,
    fileUrl: `/api/materials/${encodeURIComponent(materialId)}/file?token=${encodeURIComponent(token)}`,
    expiresIn: 300,
  };
}

// Verify the short-lived token and resolve only the generated filename saved by the server.
export async function getAuthorizedFile(materialId, token) {
  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    throw new ApiError(401, 'File link is invalid or has expired.');
  }

  if (payload.purpose !== 'material-file' || String(payload.materialId) !== String(materialId)) {
    throw new ApiError(401, 'File link is not valid for this material.');
  }

  const material = await materialModel.findMaterialById(materialId);
  if (!material?.filename) throw new ApiError(404, 'Study material file was not found.');

  const storedName = path.basename(material.filename);
  const filePath = path.resolve(uploadDirectory, storedName);
  if (!filePath.startsWith(`${path.resolve(uploadDirectory)}${path.sep}`)) {
    throw new ApiError(400, 'Invalid stored file path.');
  }
  try {
    await fs.access(filePath);
  } catch {
    throw new ApiError(404, 'Study material file was not found on the server.');
  }
  return { filePath, title: material.title, disposition: payload.disposition };
}

// Validate and store a student's resource request.
export async function requestResource(userId, values) {
  const id = await materialModel.createResourceRequest(userId, values);
  return { id, ...values, status: 'pending' };
}

// Return only the resource requests belonging to the authenticated student.
export function getStudentRequests(userId) {
  return materialModel.listResourceRequests(userId);
}

// Save an uploaded file's server-generated relative path and metadata.
export async function createUploadedMaterial(values, file) {
  if (!file) throw new ApiError(400, 'A resource file is required in the "file" field.');
  if (!materialTypes.has(values.type)) {
    await fs.unlink(file.path);
    throw new ApiError(400, 'Unsupported material type.');
  }
  const extension = path.extname(file.originalname).toLowerCase();
  if ((values.type === 'videos') !== (extension === '.mp4')) {
    await fs.unlink(file.path);
    throw new ApiError(400, 'Video materials must use MP4 files; other material types must not use MP4.');
  }

  const fileUrl = file.filename;
  try {
    return await materialModel.createMaterial({
      ...values,
      fileUrl,
      sizeMb: file.size / (1024 * 1024),
    });
  } catch (error) {
    await fs.unlink(file.path).catch((cleanupError) => {
      console.error('Could not remove failed material upload:', cleanupError);
    });
    throw error;
  }
}
