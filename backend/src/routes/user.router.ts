import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as taskController from '../controllers/task.controller';
import * as projectController from '../controllers/project.controller';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';

const router = Router();
router
  .route('/me')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(userController.getMyProfile)) // 내 정보 조회
  .patch(withAsync(userController.updateMyProfile)); // 내 정보 수정

router.get(
  '/me/projects',
  passport.authenticate('accessToken', { session: false, failWithError: true }),
  withAsync(projectController.getMyProjects), // 참여 중인 프로젝트 조회
);

router.get(
  '/me/tasks',
  passport.authenticate('accessToken', { session: false, failWithError: true }),
  withAsync(taskController.getMyTasks), // 참여 중인 모든 프로젝트의 할일 목록 조회
);
export default router;
