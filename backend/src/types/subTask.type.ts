import { safeString } from '../utils/string.util';
import { default as LocalDateTime } from 'dayjs';
import { DATE_FORMAT } from '../dtos/common.dto';

export type SubTaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface SubTaskData {
  id: bigint;
  task_id: bigint;
  user_id: bigint;
  content: string;
  status: SubTaskStatus;
  created_at: Date;
  updated_at: Date;
}

export interface SubTaskParams {
  id: string;
  taskId: string;
  userId: string;
  title: string;
  status: SubTaskStatus;
  createdAt: string;
  updatedAt: string;
}

export class SubTask {
  readonly id: string;
  readonly taskId: string;
  readonly userId: string;
  readonly title: string;
  readonly status: SubTaskStatus;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(params: SubTaskParams) {
    this.id = params.id;
    this.taskId = params.taskId;
    this.userId = params.userId;
    this.title = params.title;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
  static fromEntity(data: SubTaskData): SubTask {
    if (!data) throw new Error('데이터가 없습니다.');
    return new SubTask({
      id: safeString(data.id),
      taskId: safeString(data.task_id),
      userId: safeString(data.user_id),
      title: data.content,
      status: data.status,
      createdAt: LocalDateTime(data.created_at).format(DATE_FORMAT),
      updatedAt: LocalDateTime(data.updated_at).format(DATE_FORMAT),
    });
  }
  static fromEntityList(data: SubTaskData[]): SubTask[] {
    return data.map((subTaskData: SubTaskData) => SubTask.fromEntity(subTaskData));
  }
}
