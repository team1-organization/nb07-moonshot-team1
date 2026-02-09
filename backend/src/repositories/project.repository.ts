import { createProjectDTO } from '../dtos/project.dto';
import { searchParamsDTO } from '../dtos/common.dto';
import { prisma } from '../lib/prisma';

export async function createProject({ userId, data }: { userId: string; data: createProjectDTO }) {
  return prisma.project.create({
    data: {
      user_id: BigInt(userId),
      title: data.title,
      description: data.description,
    },
  });
}
export async function getMyProjects({
  userId,
  params,
}: {
  userId: string;
  params: searchParamsDTO;
}) {
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: {
        member: {
          some: {
            user_id: BigInt(userId),
            status: 'JOINED',
          },
        },
      },
      include: {
        member: { select: { id: true } },
        tasks: { select: { status: true } },
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.project.count({
      where: {
        member: {
          some: {
            user_id: BigInt(userId),
            status: 'JOINED',
          },
        },
      },
    }),
  ]);
  return {
    projects,
    total,
  };
}
