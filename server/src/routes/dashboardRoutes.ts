import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();

router.get('/stats', dashboardController.getStats);
router.get('/recent-activity', dashboardController.getRecentActivity);

export default router;
