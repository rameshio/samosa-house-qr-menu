import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data/menu.json');

export const getMenuData = async () => {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};