import crypto from 'crypto';
import { Buffer } from 'node:buffer';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (password, hash) => {
  const [salt, key] = hash.split(':');
  if (!salt || !key) return false;
  const derivedKey = await scrypt(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
};
