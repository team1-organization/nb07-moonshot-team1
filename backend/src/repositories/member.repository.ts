import { prisma } from '../lib/prisma';

export async function findProjectMember({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  return await prisma.member.findFirst({
    where: {
      project_id: BigInt(projectId),
      user_id: BigInt(userId),
      status: 'JOINED',
    },
  });
}
