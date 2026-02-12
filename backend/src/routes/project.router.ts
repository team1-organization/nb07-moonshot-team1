import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';
import * as taskController from '../controllers/task.controller';
import * as projectController from '../controllers/project.controller';
import * as memberController from '../controllers/member.controller';

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

router.get(
  '/:projectId/users',
  passport.authenticate('accessToken', { session: false, failWithError: true }),
  withAsync(memberController.getProjectMembers),
);

router.delete(
  '/:projectId/users/:userId',
  passport.authenticate('accessToken', { session: false, failWithError: true }),
  withAsync(memberController.removeProjectMember),
);

router.post(
  '/:projectId/invitations',
  passport.authenticate('accessToken', { session: false, failWithError: true }),
  withAsync(memberController.inviteUserToProject),
);
export default router;
