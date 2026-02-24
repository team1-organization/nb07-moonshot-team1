import { safeString } from '../utils/string.util';
import { default as LocalDateTime } from 'dayjs';
import { DATE_FORMAT } from '../dtos/common.dto';

export interface CommentData {
  id: bigint;
  content: string;
  task_id: bigint;
  created_at: Date;
  updated_at: Date;
  user: {
    id: bigint;
    name: string;
    email: string;
    profile_image: string | null;
  };
}

export interface CommentParams {
  id: string;
  content: string;
  taskId: string;
  author: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export class Comment {
  readonly id: string;
  readonly content: string;
  readonly taskId: string;
  readonly author: CommentParams['author'];
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(params: CommentParams) {
    this.id = params.id;
    this.content = params.content;
    this.taskId = params.taskId;
    this.author = params.author;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
  static fromEntity(data: CommentData): Comment {
    if (!data) throw new Error('데이터가 없습니다.');
    return new Comment({
      id: safeString(data.id),
      content: safeString(data.content),
      taskId: safeString(data.task_id),
      author: {
        id: safeString(data.user.id),
        name: data.user.name,
        email: data.user.email,
        profileImage: data.user.profile_image,
      },
      createdAt: LocalDateTime(data.created_at).format(DATE_FORMAT),
      updatedAt: LocalDateTime(data.updated_at).format(DATE_FORMAT),
    });
  }
  static fromEntityList(data: CommentData[]): Comment[] {
    return data.map((taskData: CommentData) => Comment.fromEntity(taskData));
  }
}
