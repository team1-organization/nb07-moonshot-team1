import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';

const router = Router();
router
  .route('/:commentId')
  .all(passport.authenticate('accessToken', { session: false, failWithError: true }))
  .get(withAsync(commentController.getCommentDetail))
  .patch(withAsync(commentController.updateComment))
  .delete(withAsync(commentController.deleteComment));

export default router;
