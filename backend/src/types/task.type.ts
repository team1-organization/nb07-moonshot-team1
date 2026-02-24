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
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  assignee: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  tags: {
    id: string;
    name: string;
  }[];
  attachments: string[];
  startYear: string;
  startMonth: string;
  startDay: string;
  endYear: string;
  endMonth: string;
  endDay: string;
}

export class Task {
  readonly id: string;
  readonly projectId: string;
  readonly userId: string;
  readonly title: string;
  readonly eventId: string | null;
  readonly description: string;
  readonly status: TaskStatus;
  readonly assignee: TaskParams['assignee'];
  readonly tags: TaskParams['tags'];
  readonly attachments: TaskParams['attachments'];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startYear: string;
  readonly startMonth: string;
  readonly startDay: string;
  readonly endYear: string;
  readonly endMonth: string;
  readonly endDay: string;
  constructor(params: TaskParams) {
    this.id = params.id;
    this.projectId = params.projectId;
    this.userId = params.userId;
    this.title = params.title;
    this.eventId = params.eventId;
    this.description = params.description;
    this.status = params.status;
    this.assignee = params.assignee;
    this.tags = params.tags;
    this.attachments = params.attachments;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.startYear = params.startYear;
    this.startMonth = params.startMonth;
    this.startDay = params.startDay;
    this.endYear = params.endYear;
    this.endMonth = params.endMonth;
    this.endDay = params.endDay;
  }
  static fromEntity(data: TaskData): Task {
    if (!data) throw new Error('데이터가 없습니다.');
    const start = LocalDateTime(data.start_date);
    const end = LocalDateTime(data.end_date);
    return new Task({
      id: safeString(data.id),
      projectId: safeString(data.project_id),
      userId: safeString(data.user_id),
      eventId: data.event_id || null,
      title: data.title,
      description: data.content,
      status: data.status,
      startYear: safeString(start.year()),
      startMonth: safeString(start.month() + 1),
      startDay: safeString(start.date()),
      endYear: safeString(end.year()),
      endMonth: safeString(end.month() + 1),
      endDay: safeString(end.date()),

      assignee: {
        id: safeString(data.user.id),
        name: data.user.name,
        email: data.user.email,
        profileImage: data.user.profile_image,
      },
      tags: (data.tags || []).map((tags) => ({
        id: safeString(tags.tag.id),
        name: tags.tag.name,
      })),
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
