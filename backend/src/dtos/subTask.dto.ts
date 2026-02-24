import { z } from 'zod';

export const baseSubTaskBody = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100),
});

export const createSubTaskBody = baseSubTaskBody.transform((data) => {
  return {
    ...data,
  };
});

export const updateSubTaskBody = baseSubTaskBody
  .extend({
    status: z
      .preprocess(
        (val) => (typeof val === 'string' ? val.toUpperCase() : val),
        z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
      )
      .optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: '수정하려는 데이터가 없습니다.' })
  .transform((data) => {
    return {
      ...data,
      status: data.status as 'TODO' | 'IN_PROGRESS' | 'DONE' | undefined,
    };
  });

export type createSubTaskDTO = z.infer<typeof createSubTaskBody>;
export type updateSubTaskDTO = z.infer<typeof updateSubTaskBody>;
