import { prisma } from '../lib/prisma';

export async function userImageUpload(targetId: string, fileName: string, index: number) {
  return prisma.user.update({
    where: { id: BigInt(targetId) },
    data: { profile_image: fileName },
  });
}

export async function taskImageUpload(targetId: string, fileName: string, index: number) {
  return prisma.taskImage.create({
    data: {
      task_id: BigInt(targetId),
      url: fileName,
      order: index,
    },
  });
}
