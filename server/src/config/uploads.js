import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export const uploadDirectory = process.env.VERCEL
  ? '/tmp/skill2career-uploads'
  : path.resolve(currentDirectory, '../../uploads');

mkdirSync(uploadDirectory, { recursive: true });
