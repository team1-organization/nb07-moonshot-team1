import { createCommentDTO, updateCommentDTO } from '../dtos/comment.dto';
import { searchParamsDTO } from '../dtos/common.dto';
import { ForbiddenError } from '../errors/ForbiddenError';
import * as memberRepository from '../repositories/member.repository';
import * as commentRepository from '../repositories/comment.repository';
import { Comment } from '../types/comment.type';

export async function createComment({
  taskId,
  userId,
  data,
}: {
  taskId: string;
  userId: string;
  data: createCommentDTO;
}) {
  const isMember = await memberRepository.isMemberByTaskId(taskId, userId);
  if (!isMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const comment = await commentRepository.createComment({ taskId, userId, ...data });
  if (!comment) {
    throw new Error('댓글을 생성하지 못했습니다.');
  }
  return Comment.fromEntity(comment);
}
export async function getComments({
  taskId,
  userId,
  data,
}: {
  taskId: string;
  userId: string;
  data: searchParamsDTO;
}) {
  const isMember = await memberRepository.isMemberByTaskId(taskId, userId);
  if (!isMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const comments = await commentRepository.getComments({ taskId, ...data });
  return Comment.fromEntityList(comments);
}
export async function getCommentDetail({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  const isMember = await memberRepository.isMemberByCommentId(commentId, userId);
  if (!isMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const comment = await commentRepository.getCommentDetail(commentId);
  if (!comment) {
    throw new Error('할 일을 찾을 수 없습니다.');
  }
  return Comment.fromEntity(comment);
}
export async function updateComment({
  commentId,
  userId,
  data,
}: {
  commentId: string;
  userId: string;
  data: updateCommentDTO;
}) {
  const isMember = await memberRepository.isMemberByCommentId(commentId, userId);
  if (!isMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const findComment = await commentRepository.getCommentDetail(commentId);
  if (!findComment) throw new Error('수정하려는 댓글이 없습니다.');
  const comment = await commentRepository.updateComment({
    commentId,
    userId,
    ...data,
  });
  return Comment.fromEntity(comment);
}

export async function deleteComment({ commentId, userId }: { commentId: string; userId: string }) {
  const isMember = await memberRepository.isMemberByCommentId(commentId, userId);
  if (!isMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const comment = await commentRepository.getCommentDetail(commentId);
  if (!comment) throw new Error('삭제하려는 할 일이 없습니다.');
  return await commentRepository.deleteComment(commentId, userId);
}
