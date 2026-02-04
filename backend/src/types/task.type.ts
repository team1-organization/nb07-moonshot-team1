import { safeString } from '../utils/string.util';
import { default as LocalDateTime } from 'dayjs';
import { DATE_FORMAT } from '../dtos/common.dto';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskData {
  id: bigint;
  project_id: bigint;
  user_id: bigint;
  title: string;
  event_id?: string | null;
  content: string;
  status: TaskStatus;
  start_date: Date;
  end_date: Date;
  user: {
    id: bigint;
    name: string;
    email: string;
    profile_image: string | null;
  };
  tags: {
    tag: {
      id: bigint;
      name: string;
    };
  }[];
  taskImages: {
    id: bigint;
    url: string;
    order: number;
  }[];
  created_at: Date;
  updated_at: Date;
}

export interface TaskParams {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  eventId: string | null;
  content: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  assignee: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  tags: string[];
  attachments: string[];
}

export class Task {
  readonly id: string;
  readonly projectId: string;
  readonly userId: string;
  readonly title: string;
  readonly eventId: string | null;
  readonly content: string;
  readonly status: TaskStatus;
  readonly startDate: string;
  readonly endDate: string;
  readonly assignee: TaskParams['assignee'];
  readonly tags: TaskParams['tags'];
  readonly attachments: TaskParams['attachments'];
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(params: TaskParams) {
    this.id = params.id;
    this.projectId = params.projectId;
    this.userId = params.userId;
    this.title = params.title;
    this.eventId = params.eventId;
    this.content = params.content;
    this.status = params.status;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.assignee = params.assignee;
    this.tags = params.tags;
    this.attachments = params.attachments;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
  static fromEntity(data: TaskData): Task {
    if (!data) throw new Error('데이터가 없습니다.');
    return new Task({
      id: safeString(data.id),
      projectId: safeString(data.project_id),
      userId: safeString(data.user_id),
      eventId: data.event_id || null,
      title: data.title,
      content: data.content,
      status: data.status,
      startDate: LocalDateTime(data.start_date).format(DATE_FORMAT),
      endDate: LocalDateTime(data.end_date).format(DATE_FORMAT),

      assignee: {
        id: safeString(data.user.id),
        name: data.user.name,
        email: data.user.email,
        profileImage: data.user.profile_image,
      },
      tags: (data.tags || [])
        .slice()
        .sort((a, b) => {
          if (a.tag.id < b.tag.id) return -1;
          if (a.tag.id > b.tag.id) return 1;
          return 0;
        })
        .map((item) => item.tag.name),
      attachments: (data.taskImages || [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((img) => img.url),
      createdAt: LocalDateTime(data.created_at).format(DATE_FORMAT),
      updatedAt: LocalDateTime(data.updated_at).format(DATE_FORMAT),
    });
  }
  static fromEntityList(data: TaskData[]): Task[] {
    return data.map((taskData: TaskData) => Task.fromEntity(taskData));
  }
}
