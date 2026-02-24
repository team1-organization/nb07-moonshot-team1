import { Request, Response } from 'express';
import * as imageService from '../services/image.service';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export async function uploadImages(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const files = (req.files as Express.Multer.File[]) ?? [];
  if (!files.length) {
    return res.status(400).json({ message: '업로드할 파일이 없습니다.' });
  }
  const imageType = ((req.body.type as string) || 'others') as 'others' | 'user' | 'task';
  let targetId;
  if (imageType === 'user') {
    targetId = req.user.id;
  } else if (imageType === 'task') {
    targetId = req.body.taskId;
  }
  const fileNames = files.map((file) => generetedFileName(req, imageType, file.filename));
  await imageService.uploadImages(imageType, targetId, fileNames);

  res.status(200).json(fileNames);
}

function generetedFileName(req: Request, imageType: string, fileName: string) {
  const protocol = req.protocol || 'http';
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;
  return `${baseUrl}/images/${imageType}/${fileName}`;
}
