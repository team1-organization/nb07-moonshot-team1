import { safeString } from '../utils/string.util';
import { default as LocalDateTime } from 'dayjs';
import { DATE_FORMAT } from '../dtos/common.dto';

export interface CommentData {
  id: bigint;
  user_id: bigint;
  task_id: bigint;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface CommentParams {
  id: string;
  userId: string;
  taskId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export class Comment {
  readonly id: string;
  readonly userId: string;
  readonly taskId: string;
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(params: CommentParams) {
    this.id = params.id;
    this.userId = params.userId;
    this.taskId = params.taskId;
    this.content = params.content;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
  static fromEntity(data: CommentData): Comment {
    if (!data) throw new Error('데이터가 없습니다.');
    return new Comment({
      id: safeString(data.id),
      userId: safeString(data.user_id),
      taskId: safeString(data.task_id),
      content: data.content,
      createdAt: LocalDateTime(data.created_at).format(DATE_FORMAT),
      updatedAt: LocalDateTime(data.updated_at).format(DATE_FORMAT),
    });
  }
  static fromEntityList(data: CommentData[]): Comment[] {
    return data.map((taskData: CommentData) => Comment.fromEntity(taskData));
  }
}
