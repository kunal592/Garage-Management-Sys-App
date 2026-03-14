import { Router } from 'express';
import * as partController from '../controllers/partController';

const router = Router();

router.get('/', partController.getParts);

export default router;
