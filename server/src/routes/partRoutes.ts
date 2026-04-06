import { Router } from 'express';
import * as partController from '../controllers/partController';

const router = Router();

router.get('/', partController.getParts);
router.post('/', partController.addPart);
router.patch('/:id', partController.updatePart);
router.delete('/:id', partController.removePart);

export default router;
