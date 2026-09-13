import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (fileBuffer, filename) => {
  if (process.env.UPLOAD_STORAGE_DRIVER === 's3') {
    return `${process.env.S3_PUBLIC_BASE_URL}/${filename}`;
  }

  // Local storage: robustly resolve the path relative to this file's directory
  const defaultDir = path.join(__dirname, '../../../client/public/uploads');
  const uploadDir = path.resolve(process.env.LOCAL_UPLOAD_DIRECTORY || defaultDir);
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, fileBuffer);
  return `/uploads/${filename}`;
};
