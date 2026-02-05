import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { createTaskBody, updateTaskBody } from '../dtos/task.dto';
import { commonIdParam, listParams } from '../dtos/common.dto';

export async function createTask(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');

  const { projectId, userId } = commonIdParam
    .pick({ projectId: true, userId: true })
    .required()
    .parse({
      projectId: req.params.projectId,
      userId: req.user.id,
    });

  const data = createTaskBody.parse(req.body);
  const task = await taskService.createTask({ projectId, userId, data });
  res.status(200).json(task);
}

export async function getTasks(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { projectId, userId } = commonIdParam
    .pick({ projectId: true, userId: true })
    .required()
    .parse({
      projectId: req.params.projectId,
      userId: req.user.id.toString(),
    });

  const validateQueryParams = listParams.parse(req.query);

  const tasks = await taskService.getTasks({
    projectId,
    userId,
    data: validateQueryParams,
  });
  res.status(200).json(tasks);
}
export async function getTaskDetail(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { taskId, userId } = commonIdParam.pick({ taskId: true, userId: true }).required().parse({
    taskId: req.params.taskId,
    userId: req.user.id,
  });
  const task = await taskService.getTaskDetail({ taskId, userId });
  res.status(200).json(task);
}
export async function updateTask(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { taskId, userId } = commonIdParam.pick({ taskId: true, userId: true }).required().parse({
    taskId: req.params.taskId,
    userId: req.user.id,
  });

  const updateTaskData = updateTaskBody.parse(req.body);

  const updatedTask = await taskService.updateTask({ taskId, userId, data: updateTaskData });
  res.status(200).json(updatedTask);
}
export async function deleteTask(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { taskId, userId } = commonIdParam.pick({ taskId: true, userId: true }).required().parse({
    taskId: req.params.taskId,
    userId: req.user.id,
  });
  await taskService.deleteTask({ taskId, userId });
  res.status(204).json();
}
