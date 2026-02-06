import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import * as subTaskService from '../services/subTask.service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { createTaskBody, updateTaskBody } from '../dtos/task.dto';
import { commonIdParam, listParams } from '../dtos/common.dto';
import { createSubTaskBody, updateSubTaskBody } from '../dtos/subTask.dto';

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

export async function createSubTask(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { taskId, userId } = commonIdParam.pick({ taskId: true, userId: true }).required().parse({
    taskId: req.params.taskId,
    userId: req.user.id,
  });
  const { title } = createSubTaskBody.parse(req.body);
  const subTask = await subTaskService.createSubTask({ taskId, userId, title });
  res.status(201).json(subTask);
}
export async function getSubTasks(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { taskId, userId } = commonIdParam.pick({ taskId: true, userId: true }).required().parse({
    taskId: req.params.taskId,
    userId: req.user.id,
  });
  const data = listParams.parse(req.query); //임시 - 페이징 코드로 변경할 예정
  const subTask = await subTaskService.getSubTasks({ taskId, userId, data });
  res.status(200).json(subTask);
}
export async function getSubTaskDetail(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { subTaskId, userId } = commonIdParam
    .pick({ subTaskId: true, userId: true })
    .required()
    .parse({
      subTaskId: req.params.subtaskId,
      userId: req.user.id,
    });
  const subTask = await subTaskService.getSubTaskDetail({ subTaskId, userId });
  res.status(200).json(subTask);
}
export async function updateSubTask(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { subTaskId, userId } = commonIdParam
    .pick({ subTaskId: true, userId: true })
    .required()
    .parse({
      subTaskId: req.params.subtaskId,
      userId: req.user.id,
    });
  const updateSubTaskData = updateSubTaskBody.parse(req.body);

  const updatedTask = await subTaskService.updateSubTask({
    subTaskId,
    userId,
    data: updateSubTaskData,
  });
  res.status(200).json(updatedTask);
}
export async function deleteSubTask(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { subTaskId, userId } = commonIdParam
    .pick({ subTaskId: true, userId: true })
    .required()
    .parse({
      subTaskId: req.params.subtaskId,
      userId: req.user.id,
    });
  await subTaskService.deleteSubTask({ subTaskId, userId });
  res.status(204).json();
}
