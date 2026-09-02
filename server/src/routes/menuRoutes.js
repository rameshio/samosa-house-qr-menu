import { Router } from 'express';
import { getMenu } from '../controllers/menuController.js';

const router = Router();

router.get('/menu', getMenu);

export default router;