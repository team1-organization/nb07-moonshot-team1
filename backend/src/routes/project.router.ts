import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import * as taskController from '../controllers/task.controller';
import passport from '../lib/passport';

const router = Router();
//프로젝트생성
// router
//   .route('/')
//   .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
//   .post(withAsync(projectController.createProject));

router
  .route('/:projectId/tasks')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(taskController.getTasks))
  .post(withAsync(taskController.createTask));

export default router;
