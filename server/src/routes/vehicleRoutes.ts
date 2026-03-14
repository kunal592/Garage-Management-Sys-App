import { Router } from 'express';
import * as vehicleController from '../controllers/vehicleController';

const router = Router();

router.post('/customers/:id/vehicles', vehicleController.addVehicle);
router.patch('/vehicles/:id', vehicleController.updateMeta);

export default router;
