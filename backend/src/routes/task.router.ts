import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';

const router = Router();
router
  .route('/:taskId')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(taskController.getTaskDetail))
  .patch(withAsync(taskController.updateTask))
  .delete(withAsync(taskController.deleteTask));
export default router;
