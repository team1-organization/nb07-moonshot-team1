import { createTaskDTO, updateTaskDTO } from '../dtos/task.dto';
import { Task } from '../types/task.type';
import * as taskRepository from '../repositories/task.repository';
import * as memberRepository from '../repositories/member.repository';
import { searchParamsDTO } from '../dtos/common.dto';
import { ForbiddenError } from '../errors/ForbiddenError';

export async function createTask({
  projectId,
  userId,
  data,
}: {
  projectId: string;
  userId: string;
  data: createTaskDTO;
}) {
  const findMember = await memberRepository.findProjectMember({ projectId, userId });
  if (!findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');

  const taskData = await taskRepository.createTask({
    projectId,
    userId,
    ...data,
  });
  if (!taskData) {
    throw new Error('할 일을 생성하지 못했습니다.');
  }
  return Task.fromEntity(taskData);
}
export async function getTasks({
  projectId,
  userId,
  data,
}: {
  projectId: string;
  userId: string;
  data: searchParamsDTO;
}) {
  const findMember = await memberRepository.findProjectMember({ projectId, userId });
  if (!findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const taskData = await taskRepository.getTasks({
    projectId,
    userId,
    ...data,
  });
  return Task.fromEntityList(taskData);
}
export async function getTaskDetail({ taskId, userId }: { taskId: string; userId: string }) {
  const taskData = await taskRepository.getTaskDetail({ taskId, userId });
  if (!taskData) {
    throw new Error('할 일을 찾을 수 없습니다.');
  }
  const findMember = await memberRepository.findProjectMember({
    projectId: taskData.project_id.toString(),
    userId,
  });
  if (!findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  return Task.fromEntity(taskData);
}
export async function updateTask({
  taskId,
  userId,
  data,
}: {
  taskId: string;
  userId: string;
  data: updateTaskDTO;
}) {
  const existingTask = await taskRepository.getTaskDetail({ taskId, userId });
  if (!existingTask) throw new Error('수정하려는 할 일이 없습니다.');
  const findMember = await memberRepository.findProjectMember({
    projectId: existingTask.project_id.toString(),
    userId,
  });
  if (!findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const updateTask = await taskRepository.updateTask({
    taskId,
    userId,
    ...data,
  });
  return Task.fromEntity(updateTask);
}
export async function deleteTask({ taskId, userId }: { taskId: string; userId: string }) {
  const existingTask = await taskRepository.getTaskDetail({ taskId, userId });
  if (!existingTask) throw new Error('삭제하려는 할 일이 없습니다.');
  const findMember = await memberRepository.findProjectMember({
    projectId: existingTask.project_id.toString(),
    userId,
  });
  if (!findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  return await taskRepository.deleteTask(taskId, userId);
}
