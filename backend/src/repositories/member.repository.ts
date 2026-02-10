import { prisma } from '../lib/prisma';

export async function isMemberByProjectId({
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
      status: 'JOINED',
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
      status: 'JOINED',
      project: {
        tasks: {
          some: {
            subTasks: { some: { id: BigInt(subTaskId) } },
          },
        },
      },
    },
  });
  return count > 0;
}

export async function isMemberByCommentId(commonId: string, userId: string) {
  const count = await prisma.member.count({
    where: {
      user_id: BigInt(userId),
      status: 'JOINED',
      project: {
        tasks: {
          some: {
            comments: { some: { id: BigInt(commonId) } },
          },
        },
      },
    },
  });
  return count > 0;
}

export async function createMember(userId: string, projectId: string) {
  return prisma.member.create({
    data: {
      user_id: BigInt(userId),
      project_id: BigInt(projectId),
      status: 'JOINED',
      role: 'OWNER',
    },
  });
}

export async function inviteMember(userId: string, projectId: string) {
  return prisma.member.create({
    data: {
      project_id: BigInt(projectId),
      user_id: BigInt(userId),
      status: 'INVITED', // 초대 중 상태
      role: 'MEMBER', // 초대받은 사람은 일반 멤버
    },
  });
}

export async function acceptInvitation(userId: string, projectId: string) {
  return prisma.member.update({
    where: {
      project_id_user_id: {
        project_id: BigInt(projectId),
        user_id: BigInt(userId),
      },
    },
    data: {
      status: 'JOINED',
    },
  });
}

export async function removeMember(projectId: string, userId: string) {
  return prisma.member.delete({
    where: {
      project_id_user_id: {
        project_id: BigInt(projectId),
        user_id: BigInt(userId),
      },
    },
  });
}
