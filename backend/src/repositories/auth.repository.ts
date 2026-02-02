import { prisma } from '../lib/prisma';
import { UserData } from '../types/user.type';
import { createUserDTO } from '../dtos/user.dto';

export async function findById({ id: userId }: { id: string }): Promise<UserData | null> {
  return prisma.user.findUnique({
    where: { id: BigInt(userId) },
  });
}
export async function findUserEmail(email: string): Promise<UserData | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}
export async function createUser({
  email,
  name,
  password,
  profileImage,
  provider,
  providerId,
}: createUserDTO): Promise<UserData> {
  return prisma.user.create({
    data: {
      email: email,
      name: name,
      password: password,
      profile_image: profileImage ?? null,
      provider,
      provider_id: providerId ?? null,
    },
  });
}
export async function deleteUser({
  id: userId,
  password,
}: {
  id: string;
  password: string;
}): Promise<boolean> {
  try {
    const result = await prisma.user.deleteMany({
      where: {
        id: BigInt(userId),
        password,
      },
    });
    return result.count > 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
}
