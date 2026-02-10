import { z } from 'zod';
import { default as LocalDateTime } from 'dayjs';

export const baseProjectBody = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100),
  description: z.string().min(1, '내용을 입력해주세요').max(1000),
});

export const simpleCreateProjectBody = baseProjectBody.transform((data) => {
  return {
    ...data,
  };
});

export const simpleUpdateProjectBody = baseProjectBody
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: '수정하려는 데이터가 없습니다.',
  })
  .transform((data) => {
    return {
      ...data,
    };
  });

export const projectSchema = z.object({
  title: z
    .string()
    .min(2, '프로젝트 이름을 2자 이상 입력해주세요')
    .max(50, '이름이 너무 깁니다 (최대 50자)'),
  description: z
    .string()
    .min(1, '설명을 입력해주세요')
    .max(1000, '설명은 1000자 이내로 작성해주세요'),
  startYear: z.number().int().min(2026),
  startMonth: z.number().int().min(1).max(12),
  startDay: z.number().int().min(1).max(31),
  endYear: z.number().int().min(2026),
  endMonth: z.number().int().min(1).max(12),
  endDay: z.number().int().min(1).max(31),

  status: z.enum(['PLANNING', 'ONGOING', 'COMPLETED', 'ON_HOLD']).default('PLANNING'),
  members: z.array(z.string()).default([]),
  thumbnail: z.string().url('유효한 URL 형식이 아닙니다').optional(),
});

export const createProjectBody = projectSchema
  .transform((data) => {
    const startDateTime = LocalDateTime(`${data.startYear}-${data.startMonth}-${data.startDay}`);
    const endDateTime = LocalDateTime(`${data.endYear}-${data.endMonth}-${data.endDay}`);
    return {
      ...data,
      startDate: startDateTime.toDate(),
      endDate: endDateTime.toDate(),
    };
  })
  .refine(
    (data) => {
      const start = LocalDateTime(data.startDate);
      const end = LocalDateTime(data.endDate);
      return end.isAfter(start);
    },
    {
      message: '프로젝트 종료일은 시작일보다 빠를 수 없습니다.',
      path: ['endDate'],
    },
  );

export const updateProjectBody = projectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: '수정하려는 데이터가 없습니다',
  })
  .transform((data) => {
    const hasStartDate = data.startYear && data.startMonth && data.startDay;
    const hasEndDate = data.endYear && data.endMonth && data.endDay;

    return {
      ...data,
      startDate: hasStartDate
        ? LocalDateTime(`${data.startYear}-${data.startMonth}-${data.startDay}`).toDate()
        : undefined,
      endDate: hasEndDate
        ? LocalDateTime(`${data.endYear}-${data.endMonth}-${data.endDay}`).toDate()
        : undefined,
    };
  });

export type simpleCreateProjectDTO = z.infer<typeof simpleCreateProjectBody>;
export type simpleUpdateProjectDTO = z.infer<typeof simpleUpdateProjectBody>;
export type ProjectDto = z.infer<typeof projectSchema>;
export type CreateProjectDTO = z.infer<typeof createProjectBody>;
export type UpdateProjectDTO = z.infer<typeof updateProjectBody>;
