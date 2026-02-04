import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import { createTask, getTasks } from '../controllers/task.controller';
import passport from '../lib/passport';

const router = Router();
router
  .route('/:projectId/tasks')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(getTasks))
  .post(withAsync(createTask));

export default router;
