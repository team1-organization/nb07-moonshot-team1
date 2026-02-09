import { z } from 'zod';

export const baseProjectBody = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100),
  description: z.string().min(1, '내용을 입력해주세요').max(1000),
});

export const createProjectBody = baseProjectBody.transform((data) => {
  return {
    ...data,
  };
});

export const updateProjectBody = baseProjectBody
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: '수정하려는 데이터가 없습니다.',
  })
  .transform((data) => {
    return {
      ...data,
    };
  });

export type createProjectDTO = z.infer<typeof createProjectBody>;
export type updateProjectDTO = z.infer<typeof updateProjectBody>;
