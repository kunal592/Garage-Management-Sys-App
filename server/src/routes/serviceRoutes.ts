import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';

const router = Router();

router.get('/', serviceController.getServices);
router.post('/', serviceController.createService);
router.get('/upcoming', serviceController.getUpcoming);
router.get('/:id', serviceController.getServiceById);
router.patch('/:id/status', serviceController.updateStatus);

export default router;
