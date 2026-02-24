/* eslint-disable no-console */
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import * as projectService from '../services/project.service';
import { commonIdParam, listParams } from '../dtos/common.dto';

export async function getMyProjects(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { userId } = commonIdParam.pick({ userId: true }).required().parse({
    userId: req.user.id,
  });
  const params = listParams.parse(req.query);
  const project = await projectService.getMyProjects(userId, params);
  res.status(200).json(project);
}

//프로젝트 생성
export const createProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
    const authUser = req.user as { id?: string | number | bigint };
    const { name: title, description } = req.body;

    if (!authUser.id) {
      throw new UnauthorizedError('인증된 유저 정보가 없습니다.');
    }
    const userId = Number(authUser.id);
    const projectCount = await prisma.project.count({
      where: {
        user_id: userId,
      },
    });

    if (projectCount >= 5) {
      return res.status(400).json({ message: '유저당 최대 5개의 프로젝트만 생성 가능합니다.' });
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        user_id: userId,
        member: {
          create: {
            user_id: userId,
            role: 'OWNER',
          },
        },
      },
    });

    return res.status(201).json({
      id: Number(newProject.id),
      name: newProject.title,
      description: newProject.description,
      memberCount: 1,
      todoCount: 0,
      inProgressCount: 0,
      doneCount: 0,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};

//project조회

export const getProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params as { projectId: string };

    if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
    const authUser = req.user as { id?: string | number | bigint };

    if (!authUser.id) {
      throw new UnauthorizedError('인증된 유저 정보가 없습니다.');
    }

    const myId = BigInt(authUser.id);
    const targetId = BigInt(projectId);

    const project = await prisma.project.findUnique({
      where: {
        id: targetId,
      },
      include: {
        _count: { select: { member: true } },
        tasks: { select: { status: true } },
        member: {
          where: { user_id: myId },
        },
      },
    });

    if (!project) return res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });

    const todoCount = project.tasks.filter((t) => t.status === 'TODO').length;
    const inProgressCount = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const doneCount = project.tasks.filter((t) => t.status === 'DONE').length;

    return res.json({
      id: Number(project.id),
      name: project.title,
      description: project.description,
      memberCount: project._count.member,
      todoCount,
      inProgressCount,
      doneCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};

//프로젝트 수정
export const updateProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
    const { projectId, userId } = commonIdParam
      .pick({ projectId: true, userId: true })
      .required()
      .parse({
        userId: req.user.id,
        projectId: req.params.projectId,
      });

    const { name, description } = req.body;

    const project = await prisma.project.findUnique({
      where: {
        id: BigInt(projectId),
      },
      include: {
        _count: { select: { member: true } },
        tasks: { select: { status: true } },
        member: {
          where: { user_id: BigInt(userId) },
        },
      },
    });

    if (!project) {
      return res.status(400).json({ message: '프로젝트를 찾을 수 없습니다.' });
    }

    if (project.user_id.toString() !== userId) {
      return res.status(403).json({ message: '프로젝트 관리자가 아닙니다.' });
    }

    const updateProject = await prisma.project.update({
      where: {
        id: BigInt(projectId),
      },
      data: {
        title: name ?? project.title,
        description: description ?? project.description,
      },
      include: {
        _count: {
          select: { tasks: true, member: true },
        },
      },
    });

    if (!updateProject) {
      return res.status(400).json({ message: '잘못된 데이터 형식' });
    }

    return res.status(200).json({
      id: updateProject.id,
      name: updateProject.title,
      description: updateProject.description,
      memberCount: updateProject._count.member,
      todoCount: updateProject._count.tasks,
      inProgressCount: updateProject._count.tasks,
      doneCount: updateProject._count.tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};
//프로젝트 삭제

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params as { projectId: string };
    if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
    const authUser = req.user as { id?: string | number | bigint };

    if (!authUser.id) {
      throw new UnauthorizedError('인증된 유저 정보가 없습니다.');
    }
    const myId = BigInt(authUser.id);
    const targetId = BigInt(projectId);

    const project = await prisma.project.findUnique({
      where: { id: targetId },
    });

    if (!project) {
      return res.status(404).json({ message: '삭제할 프로젝트를 찾을 수 없습니다.' });
    }

    if (project.user_id !== myId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await prisma.project.delete({
      where: { id: targetId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};
