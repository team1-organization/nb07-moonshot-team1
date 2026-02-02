import { NextFunction, Request, Response } from 'express';
import { CustomError } from './customError';
import { Prisma } from '../../generated/prisma';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(`[Error] ${req.method} ${req.url}`, err);

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = err as Prisma.PrismaClientKnownRequestError;
    if (prismaError.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: `이미 존재하는 데이터입니다.`,
      });
      return;
    }
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: '해당 데이터를 찾을 수 없습니다.',
      });
      return;
    }
  }
  if (err.message.includes('JSON')) {
    res.status(400).json({
      success: false,
      message: '잘못된 JSON 형식입니다. 요청 데이터를 확인해주세요.',
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: '서버 내부 오류가 발생했습니다.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
  return;
}
