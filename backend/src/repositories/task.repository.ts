import { prisma } from '../lib/prisma';
import { Prisma } from '../../generated/prisma';
import { createTaskDTO, updateTaskDTO } from '../dtos/task.dto';
import { searchParamsDTO } from '../dtos/common.dto';

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
  content,
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
        content: content,
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
  return prisma.task.findMany({
    where: {
      project_id: BigInt(projectId),
      user_id: BigInt(userId),
    },
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
    if (data.attachments) {
      await transaction.taskImage.deleteMany({ where: { task_id: BigInt(taskId) } });
      await createTaskImage({ transaction, taskId, attachments: data.attachments });
    }
    return transaction.task.update({
      where: {
        id: BigInt(taskId),
        user_id: BigInt(userId),
      },
      data: {
        title: data.title,
        content: data.content,
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
