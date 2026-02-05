import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';

const router = Router();
router
  .route('/:subtaskId')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(taskController.getSubTaskDetail))
  .patch(withAsync(taskController.updateSubTask))
  .delete(withAsync(taskController.deleteSubTask));

export default router;
