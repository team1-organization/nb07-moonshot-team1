import { Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { commonIdParam, listParams } from '../dtos/common.dto';
import * as projectService from '../services/project.service';
import { createProjectBody } from '../dtos/project.dto';

export async function createProject(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { userId } = commonIdParam.pick({ userId: true }).required().parse({
    userId: req.user.id,
  });
  const data = createProjectBody.parse(req.body);
  const project = await projectService.createProject({ userId, data });
  res.status(200).json(project);
}

export async function getMyProjects(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { userId } = commonIdParam.pick({ userId: true }).required().parse({
    userId: req.user.id,
  });
  const params = listParams.parse(req.query);
  const project = await projectService.getMyProjects(userId, params);
  res.status(200).json(project);
}
