import { prisma } from '../lib/prisma';
import { Prisma } from '../../generated/prisma';
import { createTaskDTO, updateTaskDTO } from '../dtos/task.dto';
import { searchParamsDTO } from '../dtos/common.dto';
import { TaskStatus } from '../types/task.type';

const TASK_INCLUDE = {
  user: true,
  taskImages: true,
  tags: { include: { tag: true } },
};
export async function createTaskTags({
  transaction,
  taskId,
  tags = [],
}: {
  transaction: Prisma.TransactionClient;
  taskId: string;
  tags: string[];
}) {
  await transaction.taskTag.deleteMany({
    where: {
      task_id: BigInt(taskId),
      tag: { name: { notIn: tags } },
    },
  });
  for (const tagName of tags) {
    const tag = await transaction.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
    await transaction.taskTag.upsert({
      where: {
        task_id_tag_id: {
          task_id: BigInt(taskId),
          tag_id: BigInt(tag.id),
        },
      },
      update: {},
      create: { task_id: BigInt(taskId), tag_id: BigInt(tag.id) },
    });
  }
}

export async function createTaskImage({
  transaction,
  taskId,
  attachments = [],
}: {
  transaction: Prisma.TransactionClient;
  taskId: string;
  attachments: string[];
}) {
  return transaction.taskImage.createMany({
    data: attachments.map((url, index) => ({
      task_id: BigInt(taskId),
      url,
      order: index,
    })),
  });
}

export async function createTask({
  projectId,
  userId,
  startDate,
  endDate,
  title,
  description,
  status,
  tags = [],
  attachments = [],
}: {
  projectId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
} & createTaskDTO) {
  return prisma.$transaction(async (transaction) => {
    const newTask = await transaction.task.create({
      data: {
        project_id: BigInt(projectId),
        user_id: BigInt(userId),
        title: title,
        content: description,
        status: status,
        start_date: startDate,
        end_date: endDate,
      },
    });
    await createTaskTags({ transaction, taskId: newTask.id.toString(), tags });
    await createTaskImage({ transaction, taskId: newTask.id.toString(), attachments });
    return transaction.task.findUnique({
      where: { id: newTask.id },
      include: TASK_INCLUDE,
    });
  });
}
export async function getTasks({
  projectId,
  userId,
  ...data
}: {
  projectId: string;
  userId: string;
} & searchParamsDTO) {
  const where: Prisma.TaskWhereInput = {
    project_id: BigInt(projectId),
    user_id: data.assignee ? BigInt(data.assignee) : BigInt(userId),
  };
  if (data.status) {
    where.status = data.status as TaskStatus;
  }
  return prisma.task.findMany({
    where,
    skip: (data.page - 1) * data.limit,
    take: data.limit,
    orderBy: { created_at: 'desc' },
    include: TASK_INCLUDE,
  });
}

export async function getTaskDetail({ taskId }: { taskId: string }) {
  return prisma.task.findFirst({
    where: {
      id: BigInt(taskId),
    },
    include: TASK_INCLUDE,
  });
}
export async function updateTask({
  taskId,
  userId,
  ...data
}: {
  taskId: string;
  userId: string;
  startDate?: Date;
  endDate?: Date;
} & updateTaskDTO) {
  return prisma.$transaction(async (transaction) => {
    if (data.tags) {
      await transaction.taskTag.deleteMany({
        where: { task_id: BigInt(taskId), tag: { name: { notIn: data.tags } } },
      });
      for (const tagName of data.tags) {
        const tag = await transaction.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        await transaction.taskTag.upsert({
          where: { task_id_tag_id: { task_id: BigInt(taskId), tag_id: BigInt(tag.id) } },
          update: {},
          create: { task_id: BigInt(taskId), tag_id: BigInt(tag.id) },
        });
      }
    }

    return transaction.task.update({
      where: {
        id: BigInt(taskId),
        user_id: BigInt(userId),
      },
      data: {
        title: data.title,
        content: data.description,
        status: data.status,
        start_date: data.startDate,
        end_date: data.endDate,
      },
      include: TASK_INCLUDE,
    });
  });
}
export async function deleteTask(taskId: string, userId: string) {
  return prisma.task.delete({
    where: {
      id: BigInt(taskId),
      user_id: BigInt(userId),
    },
  });
}

export async function getMyTasks({ userId, params }: { userId: string; params: searchParamsDTO }) {
  return prisma.task.findMany({
    where: {
      project: {
        member: { some: { user_id: BigInt(userId) } },
      },
    },
    include: {
      tags: { include: { tag: true } },
      user: true,
      taskImages: true,
    },
    skip: (params.page - 1) * params.limit,
    take: params.limit,
    orderBy: { created_at: 'desc' },
  });
}
