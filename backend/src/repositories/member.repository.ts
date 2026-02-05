import { prisma } from '../lib/prisma';

export async function findProjectMember({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const count = await prisma.member.count({
    where: {
      project_id: BigInt(projectId),
      user_id: BigInt(userId),
      status: 'JOINED',
    },
  });
  return count > 0;
}

export async function isMemberByTaskId(taskId: string, userId: string) {
  const count = await prisma.member.count({
    where: {
      user_id: BigInt(userId),
      project: {
        tasks: {
          some: { id: BigInt(taskId) },
        },
      },
    },
  });
  return count > 0;
}

export async function isMemberBySubTaskId(subTaskId: string, userId: string) {
  const count = await prisma.member.count({
    where: {
      user_id: BigInt(userId),
      project: {
        tasks: {
          some: {
            subTasks: {
              some: { id: BigInt(subTaskId) },
            },
          },
        },
      },
    },
  });
  return count > 0;
}
