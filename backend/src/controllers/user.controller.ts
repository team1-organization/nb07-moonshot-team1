/* eslint-disable no-console */
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

//유저 생성
export const createUser = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password, name, profile_image } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'name, email, password는 필수항목입니다.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email } });

    if (!existingUser) {
      return res.status(400).json({ message: '이미 가입한 email입니다. ' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profile_image,
      },
    });
    return res.status(201).json({
      id: Number(newUser.id),
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류 발생' });
  }
};
