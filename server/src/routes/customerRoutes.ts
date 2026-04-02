import { Router } from 'express';
import * as customerController from '../controllers/customerController';

const router = Router();

router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.get('/search-by-phone/:phone', customerController.getCustomerByPhone);
router.get('/:id', customerController.getCustomerById);

export default router;
