import { prisma } from '../lib/prisma';
import { searchParamsDTO } from '../dtos/common.dto';
import { updateSubTaskDTO } from '../dtos/subTask.dto';
import { SubTaskStatus } from '../types/subTask.type';

export async function createSubTask({
  taskId,
  userId,
  title,
}: {
  taskId: string;
  userId: string;
  title: string;
}) {
  return prisma.subTask.create({
    data: {
      task_id: BigInt(taskId),
      user_id: BigInt(userId),
      content: title,
      status: 'TODO',
    },
  });
}

export async function getSubTasks({ taskId, ...data }: { taskId: string } & searchParamsDTO) {
  return prisma.subTask.findMany({
    where: {
      task_id: BigInt(taskId),
    },
    skip: (data.page - 1) * data.limit,
    take: data.limit,
    orderBy: { created_at: 'desc' },
  });
}

export async function getSubTaskDetail(subTaskId: string) {
  return prisma.subTask.findUnique({
    where: {
      id: BigInt(subTaskId),
    },
    include: {
      task: {
        include: {
          project: {
            include: {
              member: true,
            },
          },
        },
      },
    },
  });
}

export async function updateSubTask({
  subTaskId,
  userId,
  ...data
}: {
  subTaskId: string;
  userId: string;
} & updateSubTaskDTO) {
  return prisma.subTask.update({
    where: {
      id: BigInt(subTaskId),
      user_id: BigInt(userId),
    },
    data: {
      content: data.title,
    },
  });
}

export async function updateSubTaskStatus({
  subTaskId,
  userId,
  status,
}: {
  subTaskId: string;
  userId: string;
  status: SubTaskStatus;
}) {
  return prisma.subTask.update({
    where: {
      id: BigInt(subTaskId),
      user_id: BigInt(userId),
    },
    data: {
      status,
    },
  });
}

export async function deleteSubTask(subTaskId: string, userId: string) {
  return prisma.subTask.delete({
    where: {
      id: BigInt(subTaskId),
      user_id: BigInt(userId),
    },
  });
}
