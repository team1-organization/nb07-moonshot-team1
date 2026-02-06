import { z } from 'zod';

export const baseCommentBody = z.object({
  content: z.string().min(1, '내용을 입력해주세요').max(100),
});

export const createCommentBody = baseCommentBody.transform((data) => {
  return {
    ...data,
  };
});

export const updateCommentBody = baseCommentBody
  .refine((data) => Object.keys(data).length > 0, { message: '수정하려는 데이터가 없습니다.' })
  .transform((data) => {
    return {
      ...data,
    };
  });

export type createCommentDTO = z.infer<typeof createCommentBody>;
export type updateCommentDTO = z.infer<typeof updateCommentBody>;
