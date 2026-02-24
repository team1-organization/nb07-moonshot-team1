import { afterAll, beforeAll } from 'vitest';
import { prisma } from '../src/lib/prisma';

beforeAll(async () => {
  await prisma.$transaction([
    prisma.taskTag.deleteMany(),
    prisma.taskImage.deleteMany(),
    prisma.subTask.deleteMany(),
    prisma.task.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.project.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
