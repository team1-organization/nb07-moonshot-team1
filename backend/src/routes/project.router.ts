import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';
import * as projectController from '../controllers/project.controller';

const router = Router();

router
  .route('/')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .post(withAsync(projectController.createProject));

router
  .route('/:projectId')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(projectController.getProject))
  .patch(withAsync(projectController.updateProject))
  .delete(withAsync(projectController.deleteProject));
router
  .route('/:projectId/tasks')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(taskController.getTasks))
  .post(withAsync(taskController.createTask));

export default router;
