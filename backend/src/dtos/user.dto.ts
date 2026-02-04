import { z } from 'zod';

export const baseUserBody = z.object({
  email: z.email('이메일 형식이 올바르지 않습니다.'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  password: z.string().min(4, '비밀번호는 4자 이상이어야 합니다.').optional(),
  profileImage: z.url().optional(),
  provider: z.enum(['LOCAL', 'GOOGLE', 'KAKAO', 'FACEBOOK', 'NAVER']).default('LOCAL'),
  providerId: z.string().optional(),
});

export const createUserBody = baseUserBody.transform((data) => {
  return {
    ...data,
  };
});

export const updateUserBody = baseUserBody
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: '수정하려는 데이터가 없습니다.',
  })
  .transform((data) => {
    return {
      ...data,
    };
  });

export const loginUserBody = z.object({
  email: z.email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(4, '비밀번호는 4자 이상이어야 합니다.'),
});

export type createUserDTO = z.infer<typeof createUserBody>;
export type loginUserDTO = z.infer<typeof loginUserBody>;
