import { Router } from 'express';
import { ReminderController } from '../controllers/reminder.controller';

import multer from 'multer';

const router = Router();
const controller = new ReminderController();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/import', upload.single('file'), controller.import);
router.post('/batch-delete', controller.deleteBatch);
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
