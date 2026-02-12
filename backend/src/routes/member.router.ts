import { Router } from 'express';
import * as memberController from '../controllers/member.controller';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';

const router = Router();

router.post(
  '/:invitationId/accept',
  passport.authenticate('accessToken', { session: false, failWithError: true }),
  withAsync(memberController.acceptInvitation),
);

router.delete(
  '/:invitationId',
  passport.authenticate('accessToken', { session: false, failWithError: true }),
  withAsync(memberController.cancelInvitation),
);

export default router;
