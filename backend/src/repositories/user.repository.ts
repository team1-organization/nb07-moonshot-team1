import { prisma } from '../lib/prisma';
import { updateUserDTO } from '../dtos/user.dto';

export async function findUserPasswordById(userId: string) {
  return prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: {
      password: true,
    },
  });
}

export async function getMyProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: {
      id: true,
      email: true,
      name: true,
      profile_image: true,
      created_at: true,
      updated_at: true,
      provider: true,
      provider_id: true,
    },
  });
}

export async function updateMyProfile({ userId, data }: { userId: string; data: updateUserDTO }) {
  return prisma.user.update({
    where: { id: BigInt(userId) },
    data: {
      email: data.email,
      name: data.name,
      profile_image: data.profileImage,
      password: data.password,
    },
  });
}
