import { updateUserDTO } from '../dtos/user.dto';
import * as userRepository from '../repositories/user.repository';
import { NotFoundError } from '../errors/NotFoundError';
import { User } from '../types/user.type';
import { BadRequestError } from '../errors/BadRequestError';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export async function getMyProfile(userId: string) {
  const user = await userRepository.getMyProfile(userId);
  if (!user) throw new NotFoundError('사용자를 찾을 수 없습니다.');
  return User.fromEntity(user).toProfile();
}

export async function updateMyProfile({ userId, data }: { userId: string; data: updateUserDTO }) {
  const { currentPassword, newPassword, ...updateData } = data;

  const user = await userRepository.findUserPasswordById(userId);
  if (!user) throw new NotFoundError('사용자를 찾을 수 없습니다.');

  if (newPassword) {
    if (!currentPassword) {
      throw new BadRequestError('비밀번호를 변경하려면 현재 비밀번호를 입력해야 합니다.');
    }
    if (!user.password) {
      throw new UnauthorizedError('저장된 비밀번호 정보가 없습니다.');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('현재 비밀번호가 올바르지 않습니다.');
    }

    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await userRepository.updateMyProfile({
    userId,
    data: updateData,
  });
  return User.fromEntity(updatedUser).toProfile();
}
