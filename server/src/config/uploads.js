import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Keep uploaded resources in one server-owned directory outside the public web root.
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
export const uploadDirectory = path.resolve(currentDirectory, '../../uploads');

// Ensure Multer's private storage directory exists before the first upload arrives.
mkdirSync(uploadDirectory, { recursive: true });
