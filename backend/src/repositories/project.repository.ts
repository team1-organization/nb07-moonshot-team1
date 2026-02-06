// src/services/project.service.ts
import { prisma } from '../lib/prisma';

export async function createProject({
  userId,
  title,
  description,
}: {
  userId: string;
  title: string;
  description: string;
}) {
  return prisma.$transaction(async (tx) => {
    // 프로젝트 생성
    const project = await tx.project.create({
      data: {
        title,
        description,
        user_id: BigInt(userId), // 생성자 기록
      },
    });

    await tx.member.create({
      data: {
        project_id: project.id,
        user_id: BigInt(userId),
        status: 'JOINED', // INVITED, JOINED
        role: 'OWNER', //OWNER, //MEMBER
      },
    });

    return project;
  });
}
