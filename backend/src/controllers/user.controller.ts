import { Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { commonIdParam } from '../dtos/common.dto';
import * as userService from '../services/user.service';
import { updateUserBody } from '../dtos/user.dto';

export async function getMyProfile(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { userId } = commonIdParam.pick({ userId: true }).required().parse({
    userId: req.user.id,
  });
  const user = await userService.getMyProfile(userId);
  res.status(200).json(user);
}

export async function updateMyProfile(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { userId } = commonIdParam.pick({ userId: true }).required().parse({
    userId: req.user.id,
  });
  const data = updateUserBody.parse(req.body);
  const project = await userService.updateMyProfile({ userId, data });
  res.status(200).json(project);
}
