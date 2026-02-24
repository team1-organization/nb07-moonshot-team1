import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import * as commentController from '../controllers/comment.controller';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';

const router = Router();
router
  .route('/:taskId/comments')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .post(withAsync(commentController.createComment))
  .get(withAsync(commentController.getComments));
router
  .route('/:taskId/subtasks')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .post(withAsync(taskController.createSubTask))
  .get(withAsync(taskController.getSubTasks));
router
  .route('/:taskId')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(taskController.getTaskDetail))
  .patch(withAsync(taskController.updateTask))
  .delete(withAsync(taskController.deleteTask));

export default router;
