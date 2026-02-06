import { Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { commonIdParam, listParams } from '../dtos/common.dto';
import * as commentService from '../services/comment.service';
import { createCommentBody, updateCommentBody } from '../dtos/comment.dto';

export async function createComment(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { taskId, userId } = commonIdParam.pick({ taskId: true, userId: true }).required().parse({
    taskId: req.params.taskId,
    userId: req.user.id,
  });
  const data = createCommentBody.parse(req.body);
  const comment = await commentService.createComment({ taskId, userId, data });
  res.status(200).json(comment);
}

export async function getComments(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { taskId, userId } = commonIdParam.pick({ taskId: true, userId: true }).required().parse({
    taskId: req.params.taskId,
    userId: req.user.id,
  });
  const data = listParams.parse(req.query);
  const comments = await commentService.getComments({
    taskId,
    userId,
    data,
  });
  res.status(200).json(comments);
}

export async function getCommentDetail(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { commentId, userId } = commonIdParam
    .pick({ commentId: true, userId: true })
    .required()
    .parse({
      commentId: req.params.commentId,
      userId: req.user.id,
    });
  const comment = await commentService.getCommentDetail({ commentId, userId });
  res.status(200).json(comment);
}

export async function updateComment(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { commentId, userId } = commonIdParam
    .pick({ commentId: true, userId: true })
    .required()
    .parse({
      commentId: req.params.commentId,
      userId: req.user.id,
    });
  const data = updateCommentBody.parse(req.body);

  const comment = await commentService.updateComment({ commentId, userId, data });
  res.status(200).json(comment);
}
//
// export async function deleteComment(req: Request, res: Response) {
//   if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
//   const { commentId, userId } = commonIdParam
//     .pick({ commentId: true, userId: true })
//     .required()
//     .parse({
//       commentId: req.params.projectId,
//       userId: req.user.id,
//     });
//   const comment = await commentService.deleteComment({ commentId, userId });
//   res.status(200).json(comment);
// }
