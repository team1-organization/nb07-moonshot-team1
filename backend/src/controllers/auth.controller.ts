import { clearTokenCookies, generateTokens, setTokenCookies } from '../lib/token';
import { Request, Response } from 'express';
import * as userService from '../services/auth.service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { createUserBody } from '../dtos/user.dto';

export function login(req: Request, res: Response) {
  const user = req.user;
  if (!user) throw new UnauthorizedError('인증된 사용자가 아닙니다.');
  const { accessToken, refreshToken } = userService.login(user.id);
  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).json({
    accessToken,
    refreshToken,
  });
}
export async function register(req: Request, res: Response) {
  const { email, name, password, profileImage, provider, providerId } = createUserBody.parse(
    req.body,
  );
  const createdUser = await userService.register({
    email,
    name,
    password,
    profileImage,
    provider,
    providerId,
  });
  return res.status(201).json({
    id: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
    profileImage: createdUser.profileImage,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
  });
}

export function refreshTokens(req: Request, res: Response) {
  const user = req.user;
  if (!user) throw new UnauthorizedError('인증된 사용자가 아닙니다.');

  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);
  return res.status(200).json({
    accessToken,
    refreshToken,
  });
}

export function logout(req: Request, res: Response) {
  clearTokenCookies(res);
  res.json({
    message: '로그아웃 되었습니다.',
  });
}

export function googleLogin(req: Request, res: Response) {
  const user = req.user;

  if (!user) throw new UnauthorizedError('구글 인증 정보가 없습니다.');
  const { accessToken, refreshToken } = userService.login(user.id);
  setTokenCookies(res, accessToken, refreshToken);
  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl) {
    res.status(307).redirect(frontendUrl);
  } else {
    // 테스트 용도
    return res.status(200).json({
      message: '구글 로그인 성공(프론트 연동 전 테스트)',
      accessToken,
      refreshToken,
    });
  }
}
