import { Router } from 'express';
import taskRoutes from './taskRoutes.js';

const router = Router();

router.get('/check', (req, res) => res.json({ status: 'All systems operational' }));
router.use('/todos', taskRoutes);

export default router;
