import { z } from 'zod';

// 기본 ID 규칙
const idRule = z.coerce.string().min(1);

// ID 공통 규칙
export const commonIdParam = z
  .object({
    projectId: idRule,
    taskId: idRule,
    userId: idRule,
    commentId: idRule,
    subTaskId: idRule,
    invitationId: idRule,
    inviterId: idRule,
    inviteeId: idRule,
  })
  .partial();

export const pageParam = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(10).max(100).default(10),
});

//검색 및 정렬 (목록 조회 공통)
export const searchParams = z.object({
  status: z
    .preprocess(
      (val) => (typeof val === 'string' ? val.toUpperCase() : val),
      z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
    )
    .optional(),
  assignee: z.coerce.number().optional(),
  keyword: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  order_by: z.enum(['created_at', 'name', 'end_date']).default('created_at'),
});

export const listParams = pageParam.extend(searchParams.shape);

// 날짜 범위 검증 (통계나 리포트 조회 시)
export const dateRangeQuery = z
  .object({
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: '종료일은 시작일보다 빠를 수 없습니다.',
  });

export type searchParamsDTO = z.infer<typeof listParams>;

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export type listResponse<T> = {
  data: T[];
  total: number;
};
