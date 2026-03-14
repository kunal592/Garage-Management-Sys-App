import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();

router.get('/stats', dashboardController.getStats);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/analytics', dashboardController.getAnalytics);

export default router;
