import { Request, Response } from 'express';

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: '내 정보 조회 성공 (가짜 데이터)',
      data: { id: 1, nickname: '테스트유저' },
    });
  } catch (error) {
    res.status(500).json({ message: '서버 에러' });
  }
};