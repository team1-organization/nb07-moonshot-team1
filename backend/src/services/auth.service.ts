import { generateTokens } from '../lib/token';
import { createUserDTO } from '../dtos/user.dto';
import * as userRepository from '../repositories/auth.repository';
import bcrypt from 'bcrypt';
import { User } from '../types/user.type';
import { BadRequestError } from '../errors/BadRequestError';

export function login(userId: string) {
  const { accessToken, refreshToken } = generateTokens(userId);
  return { accessToken, refreshToken };
}

export async function register({
  email,
  name,
  password,
  profileImage,
  provider,
  providerId,
}: createUserDTO) {
  let hashedPassword: string | undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const existingUser = await userRepository.findUserEmail(email);
  if (existingUser) {
    throw new BadRequestError('이미 가입한 이메일입니다.');
  }
  const data = await userRepository.createUser({
    email,
    name,
    profileImage,
    provider,
    providerId,
    password: hashedPassword,
  });
  return User.fromEntity(data);
}
