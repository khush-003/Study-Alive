import crypto from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import { uploadDirectory } from '../config/uploads.js';

const allowedTypes = new Map([
  ['.pdf', new Set(['application/pdf'])],
  ['.mp4', new Set(['video/mp4'])],
  ['.zip', new Set(['application/zip', 'application/x-zip-compressed'])],
  ['.docx', new Set(['application/vnd.openxmlformats-officedocument.wordprocessingml.document'])],
]);
const maximumSizeBytes = 50 * 1024 * 1024;

// Store files with generated names so user-provided filenames cannot escape uploads.
const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, uploadDirectory);
  },
  filename(request, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

// Accept only a known extension and its matching MIME type.
function fileFilter(request, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();
  const validMimes = allowedTypes.get(extension);
  if (!validMimes || !validMimes.has(file.mimetype)) {
    return callback(new ApiError(400, 'Upload a PDF, MP4, ZIP, or DOCX file.'));
  }
  return callback(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maximumSizeBytes, files: 1 },
});

// Convert Multer-specific failures into readable API errors.
export function uploadMaterialFile(request, response, next) {
  upload.single('file')(request, response, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(413, 'Uploaded file must be 50 MB or smaller.'));
    }
    if (error instanceof multer.MulterError) {
      return next(new ApiError(400, 'Upload one file using the "file" field.'));
    }
    return next(error);
  });
}
