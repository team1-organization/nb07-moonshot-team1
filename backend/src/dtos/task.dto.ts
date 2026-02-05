import { z } from 'zod';
import { default as LocalDateTime } from 'dayjs';

export const baseTaskBody = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100),
  content: z.string().min(1, '내용을 입력해주세요').max(1000),
  startYear: z.number().int().min(2026),
  startMonth: z.number().int().min(1).max(12),
  startDay: z.number().int().min(1).max(31),
  endYear: z.number().int().min(2026),
  endMonth: z.number().int().min(1).max(12),
  endDay: z.number().int().min(1).max(31),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  tags: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
});

export const createTaskBody = baseTaskBody
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
      message: '종료일은 시작일보다 빠를 수 없습니다.',
      path: ['endDate'],
    },
  );

export const updateTaskBody = baseTaskBody
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: '수정하려는 데이터가 없습니다.' })
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

export type createTaskDTO = z.infer<typeof createTaskBody>;
export type updateTaskDTO = z.infer<typeof updateTaskBody>;
