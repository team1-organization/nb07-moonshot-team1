import { safeString } from '../utils/string.util';
import { default as LocalDateTime } from 'dayjs';
import { DATE_FORMAT } from '../dtos/common.dto';

export interface SubTaskData {
  id: bigint;
  task_id: bigint;
  user_id: bigint;
  content: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SubTaskParams {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class SubTask {
  readonly id: string;
  readonly taskId: string;
  readonly userId: string;
  readonly content: string;
  readonly completed: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(params: SubTaskParams) {
    this.id = params.id;
    this.taskId = params.taskId;
    this.userId = params.userId;
    this.content = params.content;
    this.completed = params.completed;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
  static fromEntity(data: SubTaskData): SubTask {
    if (!data) throw new Error('데이터가 없습니다.');
    return new SubTask({
      id: safeString(data.id),
      taskId: safeString(data.task_id),
      userId: safeString(data.user_id),
      content: data.content,
      completed: data.completed,
      createdAt: LocalDateTime(data.created_at).format(DATE_FORMAT),
      updatedAt: LocalDateTime(data.updated_at).format(DATE_FORMAT),
    });
  }
  static fromEntityList(data: SubTaskData[]): SubTask[] {
    return data.map((subTaskData: SubTaskData) => SubTask.fromEntity(subTaskData));
  }
}
