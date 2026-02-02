/* eslint-disable no-console */
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

//프로젝트 생성
export const createProject = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { user_id, title, description } = req.body;
    const loginUser = (req as any).user?.id;
    //user dto 작성한 후 자세한 타입 수정하겠습니다.
    if (!loginUser) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    const projectCount = await prisma.project.count({
      where: { user_id: BigInt(user_id) },
    });

    if (projectCount >= 5) {
      return res.status(400).json({ message: '유저당 최대 5개의 프로젝트만 생성 가능합니다.' });
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        user_id: BigInt(user_id),
      },
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};

//project조회
export const getProject = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        tasks: true,
        Member: true,
      },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};
