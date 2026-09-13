import { Router } from 'express';
import { listStaff, createStaff, toggleStaffStatus } from '../controllers/staffController.js';
import { requireAuth, requireOwner } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireOwner);

router.get('/', listStaff);
router.post('/', createStaff);
router.put('/:id/status', toggleStaffStatus);

export default router;