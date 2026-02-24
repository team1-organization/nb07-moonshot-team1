import { prisma } from '../lib/prisma';
import { searchParamsDTO } from '../dtos/common.dto';

const COMMENT_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      profile_image: true,
    },
  },
};

export async function createComment({
  taskId,
  userId,
  content,
}: {
  taskId: string;
  userId: string;
  content: string;
}) {
  return prisma.comment.create({
    data: {
      task_id: BigInt(taskId),
      user_id: BigInt(userId),
      content,
    },
    include: COMMENT_INCLUDE,
  });
}

export async function getComments({ taskId, ...data }: { taskId: string } & searchParamsDTO) {
  return prisma.comment.findMany({
    where: {
      task_id: BigInt(taskId),
    },
    include: COMMENT_INCLUDE,
    skip: (data.page - 1) * data.limit,
    take: data.limit,
    orderBy: { created_at: 'desc' },
  });
}

export async function getCommentDetail(commentId: string) {
  return prisma.comment.findFirst({
    where: {
      id: BigInt(commentId),
    },
    include: COMMENT_INCLUDE,
  });
}

export async function updateComment({
  commentId,
  userId,
  content,
}: {
  commentId: string;
  userId: string;
  content: string;
}) {
  return prisma.comment.update({
    where: {
      id: BigInt(commentId),
      user_id: BigInt(userId),
    },
    data: {
      content,
    },
    include: COMMENT_INCLUDE,
  });
}

export async function deleteComment(commentId: string, userId: string) {
  return prisma.comment.delete({
    where: {
      id: BigInt(commentId),
      user_id: BigInt(userId),
    },
  });
}
