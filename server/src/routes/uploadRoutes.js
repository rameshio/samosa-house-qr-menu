import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadImage } from '../services/storageService.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Process with sharp
    const webpBuffer = await sharp(req.file.buffer)
      .rotate() // auto-orient based on EXIF
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const hash = crypto.randomBytes(16).toString('hex');
    const filename = `${hash}.webp`;

    const url = await uploadImage(webpBuffer, filename);

    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

export default router;