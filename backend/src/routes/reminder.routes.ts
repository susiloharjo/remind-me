import { Router } from 'express';
import { ReminderController } from '../controllers/reminder.controller';

const router = Router();
const controller = new ReminderController();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
