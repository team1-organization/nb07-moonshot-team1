import * as subTaskRepository from '../repositories/subTask.repository';
import * as memberRepository from '../repositories/member.repository';
import { ForbiddenError } from '../errors/ForbiddenError';
import { SubTask } from '../types/subTask.type';
import { searchParamsDTO } from '../dtos/common.dto';
import { updateSubTaskDTO } from '../dtos/subTask.dto';

export async function createSubTask({
  taskId,
  userId,
  title,
}: {
  taskId: string;
  userId: string;
  title: string;
}) {
  const findMember = await memberRepository.isMemberByTaskId(taskId, userId);
  if (findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const createSubTask = await subTaskRepository.createSubTask({ taskId, userId, title });
  if (!createSubTask) {
    throw new Error('할 일을 생성하지 못했습니다.');
  }
  return SubTask.fromEntity(createSubTask);
}
export async function getSubTasks({
  taskId,
  userId,
  data,
}: {
  taskId: string;
  userId: string;
  data: searchParamsDTO;
}) {
  const findMember = await memberRepository.isMemberByTaskId(taskId, userId);
  if (findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const subTasks = await subTaskRepository.getSubTasks({ taskId, ...data });
  return SubTask.fromEntityList(subTasks);
}
export async function getSubTaskDetail({
  subTaskId,
  userId,
}: {
  subTaskId: string;
  userId: string;
}) {
  const findMember = await memberRepository.isMemberBySubTaskId(subTaskId, userId);
  if (findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const subTask = await subTaskRepository.getSubTaskDetail(subTaskId);
  if (!subTask) {
    throw new Error('할 일을 찾을 수 없습니다.');
  }
  return SubTask.fromEntity(subTask);
}
export async function updateSubTask({
  subTaskId,
  userId,
  data,
}: {
  subTaskId: string;
  userId: string;
  data: updateSubTaskDTO;
}) {
  const existingTask = await subTaskRepository.getSubTaskDetail(subTaskId);
  if (!existingTask) throw new Error('수정하려는 할 일이 없습니다.');
  const findMember = await memberRepository.isMemberBySubTaskId(subTaskId, userId);
  if (findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const updateTask = await subTaskRepository.updateSubTask({
    subTaskId,
    userId,
    ...data,
  });
  return SubTask.fromEntity(updateTask);
}
export async function deleteSubTask({ subTaskId, userId }: { subTaskId: string; userId: string }) {
  const findMember = await memberRepository.isMemberBySubTaskId(subTaskId, userId);
  if (findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');

  const existingTask = await subTaskRepository.getSubTaskDetail(subTaskId);
  if (!existingTask) throw new Error('삭제하려는 할 일이 없습니다.');
  return await subTaskRepository.deleteSubTask(subTaskId, userId);
}
