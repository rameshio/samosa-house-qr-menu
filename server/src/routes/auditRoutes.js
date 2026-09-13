import { Router } from 'express';
import { listAuditLogs } from '../controllers/auditController.js';
import { requireAuth, requireOwner } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireOwner);

router.get('/', listAuditLogs);

export default router;