import { prisma } from '../lib/prisma';
import { searchParamsDTO } from '../dtos/common.dto';
import dayjs from 'dayjs';
import { MemberData } from '../types/member.type';

async function checkMemberAccess(userId: string, whereClause: any) {
  const count = await prisma.member.count({
    where: {
      user_id: BigInt(userId),
      project: whereClause,
    },
  });
  return count > 0;
}

export const isMemberByProjectId = (projectId: string, userId: string) =>
  checkMemberAccess(userId, { id: BigInt(projectId) });
export const isMemberByTaskId = (taskId: string, userId: string) =>
  checkMemberAccess(userId, { tasks: { some: { id: BigInt(taskId) } } });
export const isMemberBySubTaskId = (subTaskId: string, userId: string) =>
  checkMemberAccess(userId, { tasks: { some: { subTasks: { some: { id: BigInt(subTaskId) } } } } });
export const isMemberByCommentId = (commentId: string, userId: string) =>
  checkMemberAccess(userId, { tasks: { some: { comments: { some: { id: BigInt(commentId) } } } } });

export async function createMember(userId: string, projectId: string) {
  return prisma.member.create({
    data: {
      user_id: BigInt(userId),
      project_id: BigInt(projectId),
      role: 'OWNER',
    },
  });
}

export async function inviteMember(projectId: string, inviterId: string, email: string) {
  const invitee = await prisma.user.findUnique({ where: { email } });
  if (!invitee) throw new Error('존재하지 않는 사용자입니다.');
  return prisma.invitation.upsert({
    where: {
      project_id_invitee_id: {
        project_id: BigInt(projectId),
        invitee_id: BigInt(invitee.id),
      },
    },
    update: {
      project_id: BigInt(projectId),
      inviter_id: BigInt(inviterId),
      invitee_id: BigInt(invitee.id),
      expires_at: dayjs().add(7, 'day').toDate(),
      status: 'PENDING',
    },
    create: {
      project_id: BigInt(projectId),
      inviter_id: BigInt(inviterId),
      invitee_id: BigInt(invitee.id),
      expires_at: dayjs().add(7, 'day').toDate(),
      status: 'PENDING',
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

export async function isAdmin({ projectId, userId }: { projectId: string; userId: string }) {
  const member = await prisma.member.count({
    where: {
      project_id: BigInt(projectId),
      user_id: BigInt(userId),
      role: 'OWNER',
    },
  });
  return member > 0;
}

export async function getProjectMembers({
  projectId,
  userId,
  data,
}: {
  projectId: string;
  userId: string;
  data: searchParamsDTO;
}) {
  const [members, total, invitations] = await Promise.all([
    prisma.member.findMany({
      where: { project_id: BigInt(projectId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_image: true,
            _count: {
              select: { tasks: { where: { project_id: BigInt(projectId) } } },
            },
          },
        },
      },
      skip: (data.page - 1) * data.limit,
      take: data.limit,
      orderBy: { project: { created_at: 'desc' } },
    }),
    prisma.member.count({ where: { project_id: BigInt(projectId) } }),
    prisma.invitation.findMany({
      where: { project_id: BigInt(projectId), status: 'PENDING' },
      include: {
        invitee: {
          select: { id: true, name: true, email: true, profile_image: true },
        },
      },
    }),
  ]);

  const joinedList: MemberData[] = members.map((m) => ({
    ...m,
    status: 'JOINED' as const,
    isMe: m.user_id === BigInt(userId),
  }));

  const invitationList = invitations.map((i) => ({
    id: i.id,
    project_id: i.project_id,
    user_id: i.invitee_id,
    role: 'MEMBER' as const,
    isMe: i.invitee_id === BigInt(userId),
    status: i.status === 'PENDING' ? ('INVITED' as const) : ('DECLINED' as const),
    user: { ...i.invitee, _count: { tasks: 0 } },
  }));

  return {
    members: [...joinedList, ...invitationList],
    total: total + invitations.length,
  };
}

export async function cancelInvitation(invitationId: string) {
  return prisma.invitation.delete({
    where: { id: BigInt(invitationId) },
  });
}

export async function getInvitationById(invitationId: string) {
  return prisma.invitation.findUnique({
    where: { id: BigInt(invitationId) },
    include: {
      project: true,
      inviter: { select: { name: true, email: true, profile_image: true } },
      invitee: { select: { name: true, email: true, profile_image: true } },
    },
  });
}

export async function acceptInvitation({
  invitationId,
  projectId,
  inviteeId,
}: {
  invitationId: string;
  projectId: string;
  inviteeId: string;
}) {
  return prisma.$transaction(async (tx) => {
    await tx.invitation.update({
      where: { id: BigInt(invitationId) },
      data: { status: 'ACCEPTED' },
    });
    return tx.member.create({
      data: {
        project_id: BigInt(projectId),
        user_id: BigInt(inviteeId),
        role: 'MEMBER',
      },
    });
  });
}
