import { Router } from 'express';
import { getAdminMenu, updateMenuItem, createMenuItem, publishMenu } from '../controllers/adminMenuController.js';
import { requireAuth, requireOwner } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getAdminMenu);
router.post('/items', createMenuItem);
router.put('/items/:id', updateMenuItem);
router.post('/publish', requireOwner, publishMenu);

export default router;